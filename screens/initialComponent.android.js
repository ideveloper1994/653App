import React from 'react';
import {
    AppState,
    AsyncStorage, NetInfo,
    NativeModules
} from 'react-native';
import Constant from '../helper/constant';
import InitialSplashView from '../screens/commonComponent/initialSplashScreen';
import {connect} from 'react-redux';
import {
    loginUser, loadDataOnAppOpen, startLoading,
    setAskedForCheckupPopup, setIsNetworkAvailable,
    setDateforTodayOpen, manageStreakAchievedPopup,
    setSafeAreaIntent, managePopupQueue
} from '../actions/userActions';
import {loadAllProducts, restoreAllData, checkForValidation} from '../helper/inAppPurchase';
import {backendNotReachable, showNoInternetAlert, showServerNotReachable, showThemeAlert} from '../helper/appHelper';
import moment from 'moment';
import {getAllMetaData, updateMetaDataNoCalculation} from '../actions/metadataActions';
import {NavigationActions, StackActions} from "react-navigation";
import AppStatusBar from './commonComponent/statusBar';
import {callAppGoesToBackground, checkForRechability, createNewTocken} from "../services/apiCall";

let isLogin = 'login';
let isInitialView = true;
let AndroidNativeModule = NativeModules.AndroidNativeModule;

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAppLoading: false,
            isNeedToCheckReachability: false,
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
            if (isConnected) {
                NetInfo.isConnected.removeEventListener('connectionChange', dispatchConnected);
            } else {
                showNoInternetAlert();
            }
        };
        NetInfo.isConnected.fetch().then().done((isConnected) => {
            if (isConnected) {
                NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
            } else {
                showNoInternetAlert();
                NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
            }
        });

        if(isToken && userData && userData.token){
            this.props.getAllMetaData(userData, true).then(res=>{
                this.props.loadDataOnAppOpen(false, isFromBackground);
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
                    this.props.loadDataOnAppOpen(true, isFromBackground);
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

    setAppMainView = (isUserLoggedIn = false) => {
        let isFromWelcome = false;
        AsyncStorage.setItem('isNewOpen', "true");
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
            isLogin = (isPasscode) && 'getPasscode' || "rootTabNavigation";
            if (isLogin === "rootTabNavigation") {
                return AsyncStorage.getItem('isUserDetailSet');
            } else {
                return Promise.reject(false);
            }
        }).then(isUserDetail => {
            if (isUserDetail) {
                return Promise.reject(false);
            } else {
                isLogin = "beforeBeginToday";
                return Promise.reject(false);
            }
        }).catch(err => {
            if(!this.state.isAppLoading) {
                this.setState({isAppLoading: true});
                this.manageAppListener();
                this.props.setDateforTodayOpen(false, true, true);
                // if (err.status) {
                // showNoInternetAlert();
                // }
                AsyncStorage.getItem("AppInstallationDate").then(res => {
                    if (!res) {
                        AndroidNativeModule.getInstallDate((err) => {
                        }, (val) => {
                            try {
                                let date = new Date(parseInt(val));
                                if (date !== "Invalid Date") {
                                    let installedDate = moment(date).format("YYYY-MM-DD");
                                    AsyncStorage.setItem("AppInstallationDate", installedDate);
                                }
                            } catch (e) {
                            }
                        });
                    }
                });

                this.props.setAskedForCheckupPopup(false);
                this.props.startLoading(false);

                this.props.managePopupQueue({checkup: null, streakGoal: null, rewired: null, monthlyChallenge: null});
                let showStreakGoalPopUp = this.props.showStreakGoalPopUp;
                showStreakGoalPopUp.isShow = false;
                showStreakGoalPopUp.inProcess = false;
                this.props.manageStreakAchievedPopup(showStreakGoalPopUp);
                // AndroidNativeModule.isAppInDebug((err)=>{
                //     // alert(err)
                // }, (val)=>{
                //     // alert(val);
                // });
                if (!isLogin.includes("welcome")) {
                    //Set Replies to your posts Notification True by Default
                    this.setNotificationRepliesToPost();
                }
                if (this.props.navigation.state.params.fromNotification) {
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
        });
    };

    setNotificationRepliesToPost = () => {
        AsyncStorage.getItem("ReplyToPostsNotification").then(res => {
            if (!res) {
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

    //App State change - background to forground
    _handleAppStateChange = (nextAppState) => {
        if(this.state.isNeedToCheckReachability){
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
            }else{
                callAppGoesToBackground();
            }
        }else{
            this.setState({isNeedToCheckReachability: true});
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
    loginUser,
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