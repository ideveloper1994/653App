import React from 'react';
import { AppState,
    AsyncStorage, NetInfo,
    NativeModules} from 'react-native';
import Constant from '../helper/constant';
import InitialSplashView from '../screens/commonComponent/initialSplashScreen';
import { connect } from 'react-redux';
import {cloneDeep} from 'lodash';
import SafeArea, {  SafeAreaInsets } from 'react-native-safe-area';
import {NavigationActions, StackActions} from "react-navigation";
import {
    loadDataOnAppOpen, startLoading,
    setAskedForCheckupPopup, setIsNetworkAvailable,
    setDateforTodayOpen, manageStreakAchievedPopup,
    setSafeAreaIntent, managePopupQueue
} from '../actions/userActions';
import {showNoInternetAlert, showServerNotReachable, backendNotReachable} from '../helper/appHelper';
import {getAllMetaData, updateMetaDataNoCalculation} from '../actions/metadataActions';
import {checkForRechability, createNewTocken} from "../services/apiCall";
import {EventRegister} from "react-native-event-listeners";
let NativeCallback = NativeModules.checkBundle;
let isInitialView = true;
let isLogin = 'login';
import {callAppGoesToBackground} from "../services/apiCall";

class Main extends React.Component {

    constructor(props){
        super(props);
        this.state={
            isAppLoading:false,
            isToken: false,
            userData: null
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('user').then(user=>{
            if(user){
                let userData = JSON.parse(user);
                if(userData.token){
                    this.setState({
                        isToken: true,
                        userData: userData
                    });
                    this.manageComponetWillMount(true, userData, true, false);
                }else{
                    this.manageComponetWillMount(false);
                }
            }else{
                this.manageComponetWillMount(false);
            }
        });
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    manageComponetWillMount(isToken, userData=null,isGotoInitial = true, isFromBackground = false) {
        if (isToken && isGotoInitial) {
            this.setAppMainView(true);
        }else{
            this.setAppMainView(false);
        }
        const dispatchConnected = isConnected => {
            this.props.setIsNetworkAvailable(isConnected);
            console.log("---------isConnected---------", isConnected)
            if(isConnected) {
                NetInfo.isConnected.removeEventListener('connectionChange', dispatchConnected);
            }else{
                showNoInternetAlert();
            }
        };
        NetInfo.isConnected.fetch().then().done(() => {
            NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
        });

        if(isToken && userData && userData.token){
            this.props.getAllMetaData(userData, true).then(res=>{
                // if(!__DEV__){
                this.props.loadDataOnAppOpen(false, isFromBackground);
                // }
            }).catch(e=>{
                this.checkForRechabilityStatus(isToken,isFromBackground);
            })
        }else{
            this.checkForRechabilityStatus(isToken,isFromBackground);
        }
    }

    checkForRechabilityStatus = (isToken,isFromBackground) => {
        checkForRechability().then(resStatus=>{
            if(resStatus === Constant.REACHABLE){
                if(isToken){
                    // if(!__DEV__) {
                    this.props.loadDataOnAppOpen(true, isFromBackground);
                    // }
                }
            }else if(resStatus === Constant.NOT_REACHABLE_BACKEND){
                backendNotReachable();
            }
        }).catch(errStatus=>{
            if(errStatus === Constant.NOT_REACHABLE){
                //Wireless connection but no internet
                showServerNotReachable();
            }
        });
    }

    setSafeArea = () => {
        SafeArea.getSafeAreaInsetsForRootView()
            .then((result) => {
                let temp = {
                    top:(result.safeAreaInsets.top>0)?result.safeAreaInsets.top-20:result.safeAreaInsets.top,
                    bottom:result.safeAreaInsets.bottom,
                    left:result.safeAreaInsets.left,
                    right:result.safeAreaInsets.right
                };
                let obj = cloneDeep(temp);
                this.props.setSafeAreaIntent(obj);
                SafeArea.removeEventListener('safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsForRootViewChange);
            })
    };

    setAppMainView = (isUserLoggedIn = false) => {
        console.log("---setAppMainView ",new Date());
        let isFromWelcome = false;
        NativeCallback.manageKeyboard(false);
        AsyncStorage.getItem("AppInstallationDate").then(res=>{
            if(!res) {
                NativeCallback.installationDate((error, events) => {
                    AsyncStorage.setItem("AppInstallationDate", events);
                });
            }
        });
        AsyncStorage.setItem('isNewOpen',"true");
        if(isUserLoggedIn){
            AsyncStorage.getItem('secure').then(isPasscode => {
                isLogin= (isPasscode) && 'getPasscode' || "rootTabNavigation";
                if(isLogin === "rootTabNavigation"){
                    return AsyncStorage.getItem('isUserDetailSet');
                }else{
                    return Promise.reject(false);
                }
            }).then(isUserDetail => {
                if(isUserDetail){
                    return Promise.reject(false);
                }else{
                    isLogin = "beforeBeginToday";
                    return Promise.reject(false);
                }
            }).catch(err =>{
                this.goToNextView();
            });
        }else{
            AsyncStorage.getItem('isWelcomeFlowCompleted')
                .then(isWelcome => {
                    if(isWelcome){
                        isFromWelcome=false;
                        if(isUserLoggedIn){
                            return Promise.resolve(true);
                        }else{
                            return Promise.reject(false);
                        }
                    }else{
                        isFromWelcome=true;
                        return AsyncStorage.getItem('isIntroScreenDone');
                    }
                }).then(user => {
                if(isFromWelcome) {
                    isLogin='welcome';
                    if(user){
                        isLogin = 'welcomeBack';
                    }
                    return Promise.reject(false)
                }else{
                    return Promise.resolve(false)
                }
            }).then(res => {
                return AsyncStorage.getItem('secure');
            }).then(isPasscode => {
                isLogin= (isPasscode) && 'getPasscode' || "rootTabNavigation";
                if(isLogin === "rootTabNavigation"){
                    return AsyncStorage.getItem('isUserDetailSet');
                }else{
                    return Promise.reject(false);
                }
            }).then(isUserDetail => {
                if(isUserDetail){
                    return Promise.reject(false);
                }else{
                    isLogin = "beforeBeginToday";
                    return Promise.reject(false);
                }
            }).catch(err =>{
                this.goToNextView();
            });
        }
    };

    goToNextView = () => {
        console.log("---catch ",new Date())
        if(!this.state.isAppLoading) {
            this.setState({isAppLoading: true});
            this.manageAppListener();
            this.props.setAskedForCheckupPopup(false);
            this.setSafeArea();
            this.props.startLoading(false);
            this.props.setDateforTodayOpen(false, true, true);

            this.props.managePopupQueue({checkup: null, streakGoal: null, rewired: null, monthlyChallenge: null});
            let showStreakGoalPopUp = this.props.showStreakGoalPopUp;
            showStreakGoalPopUp.isShow = false;
            showStreakGoalPopUp.inProcess = false;
            this.props.manageStreakAchievedPopup(showStreakGoalPopUp);

            if (!isLogin.includes("welcome")) {
                //Set Replies to your posts Notification True by Default
                this.setNotificationRepliesToPost();
            } else {
                NativeCallback.setTodayWidget(JSON.stringify({isLogin: "NO"}));
            }
            if (this.props.navigation.state.params && this.props.navigation.state.params.fromNotification) {
                if (this.props.navigation.state.params.goToTeamChat) {
                    this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({
                            routeName: isLogin,
                            params: {transition: "fadeIn", goToTeamChat: true}
                        })],
                    }))
                } else if (this.props.navigation.state.params.goToCommunity) {
                    this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({
                            routeName: isLogin,
                            params: {
                                transition: "fadeIn", goToCommunity: true,
                                postId: this.props.navigation.state.params.postId
                            }
                        })],
                    }))
                } else {
                    this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: isLogin, params: {transition: "fadeIn"}})],
                    }))
                }
            } else {
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: isLogin, params: {transition: "fadeIn"}})],
                }))
            }
        }
    }

    setNotificationRepliesToPost = () => {
        AsyncStorage.getItem("ReplyToPostsNotification").then(res=>{
            if(!res) {
                AsyncStorage.setItem("ReplyToPostsNotification", "true");
                this.props.updateMetaDataNoCalculation({
                    wants_reply_notifications: true
                });
            }
        });
    }

    manageAppListener = () => {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    };

    handleFirstConnectivityChange = (isConnected) => {
        this.props.setIsNetworkAvailable(isConnected);
    };

    //isToken, userData=null,isGotoInitial = true, isFromBackground = false
//App State change - background to forground
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            createNewTocken();
            if(this.state.isToken){
                this.manageComponetWillMount(this.state.isToken,this.state.userData, false, true);
            }else{
                if(!this.state.isAppLoading){
                    console.log("this.manageComponetWillMount");
                    this.manageComponetWillMount(this.state.isToken,this.state.userData, true, true);
                }
                else{
                    console.log("Do nothing");
                }
            }
        }else if(nextAppState === "background"){
            callAppGoesToBackground();
        }
    };

    render() {
        return (
            <InitialSplashView/>
        );
    }
}

const mapStateToProps = state => {
    return {
        isConnected: state.user.isConnected,
        showStreakGoalPopUp: state.user.showStreakGoalPopUp,
        appBadgeCount: state.user.appBadgeCount,
    };
};

export default connect(mapStateToProps, {
    loadDataOnAppOpen,
    startLoading,
    setIsNetworkAvailable,
    setAskedForCheckupPopup,
    setDateforTodayOpen,
    setSafeAreaIntent,
    managePopupQueue,
    manageStreakAchievedPopup,
    updateMetaDataNoCalculation,
    getAllMetaData
})(Main);