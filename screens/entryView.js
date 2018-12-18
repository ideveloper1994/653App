import React from 'react';
import {
    StatusBar, AppState,
    PushNotificationIOS,
    NativeModules
} from 'react-native';
import Constant from '../helper/constant';
import InitialSplashView from '../screens/commonComponent/initialSplashScreen';
import {connect} from 'react-redux';
import {
    manageAppBadgeCount
} from '../actions/userActions';
import {NavigationActions, StackActions} from "react-navigation";
import OneSignal from 'react-native-onesignal';
import {getEventsDetails, getMemberDetail, getTeamChat, manageActivityEventBadgeCount} from '../actions/teamAction'
import {updateMetaDataNoCalculation} from '../actions/metadataActions';

let setBadgeValue = NativeModules.checkBundle;
let getDeviceName = NativeModules.checkBundle;
let isInitialView = true;

let lastState = "";

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lastState: ''
        }
    }

    componentWillMount() {
        StatusBar.setHidden(false);
        OneSignal.setLocationShared(false);
        OneSignal.inFocusDisplaying(2);
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        this.props.navigation.navigate('initialPage',{fromNotification: false});
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        lastState = nextAppState;
    }

    onReceived = (notification) => {
        if (Constant.isIOS) {
            if (JSON.stringify(notification.payload).includes('team_chat')) {
                // let count = this.props.appBadgeCount + 1;
                // this.props.manageAppBadgeCount(count);
                this.props.getTeamChat(null,true);
                // PushNotificationIOS.setApplicationIconBadgeNumber(count + this.props.eventBadgeCount);
                // setBadgeValue.setBadgeCountInAppGroup(count, (error, events) => {
                //     console.log("call");
                // });
            } else if (JSON.stringify(notification.payload).includes('community_content.reply_received')) {
                // let count = this.props.eventBadgeCount + 1;
                // this.props.manageActivityEventBadgeCount(count);
                // PushNotificationIOS.setApplicationIconBadgeNumber(count + this.props.appBadgeCount);
                if (this.props.userId) {
                    this.props.getEventsDetails(this.props.userId, null, true);
                }
            }
        } else {
            console.log("Notification received: ", notification);
            if (JSON.stringify(notification.payload).includes('7af8ca91-f892-4fc2-b3b9-20f4f4996944')) {
                // let count = this.props.eventBadgeCount + 1;
                if (this.props.userId) {
                    this.props.getEventsDetails(this.props.userId, null, true);
                }
            }else{
                // let count = this.props.appBadgeCount + 1;
                // this.props.manageAppBadgeCount(count);
                this.props.getTeamChat(null, true);
            }
        }
    }

    onOpened = (openResult) => {
        try {
            if (Constant.isIOS) {
                if (JSON.stringify(openResult.notification.payload).includes('team_chat')) {
                    if (lastState == "" && !openResult.notification.isAppInFocus) {
                        this.props.navigation.push('initialPage', {
                            goToTeamChat: true,
                            fromNotification: true
                        });
                    } else {
                        this.props.navigation.navigate('Team', {
                            transition: "fadeIn",
                            goToTeamChat: true,
                            fromNotification: true,
                            selectedTab: 1
                        });
                    }
                } else if (JSON.stringify(openResult.notification.payload).includes('community_content.reply_received')) {
                    let postId = (openResult.notification.payload.additionalData) && openResult.notification.payload.additionalData.id || null;
                    // alert(JSON.stringify(openResult.notification.payload.additionalData.id))
                    if (lastState == "" && !openResult.notification.isAppInFocus) {
                        this.props.navigation.push('initialPage', {
                            goToCommunity: true,
                            fromNotification: true, postId: postId
                        });
                    } else {
                        if (this.props.userId) {
                            let instance = null;
                            if (this.props.userCommunity) {
                                instance = this.props.userCommunity;
                            }
                            this.props.navigation.navigate("communityProfile" + "Card", {
                                transition: "myCustomSlideRightTransition",
                                isCurrentUser: true,
                                memberDetail: instance
                            });
                            this.props.getMemberDetail(this.props.userId, true).then(res => {
                                this.props.getEventsDetails(this.props.userId, null, true, true, postId);
                            });
                        }
                    }
                }
            }else{
                if(JSON.stringify(openResult.notification).includes("7af8ca91-f892-4fc2-b3b9-20f4f4996944")){
                    let postId = (openResult.notification.payload.additionalData) && openResult.notification.payload.additionalData.id || null;
                    if (lastState == "active") {
                        this.props.navigation.push('initialPage', {
                            goToCommunity: true,
                            fromNotification: true, postId: postId
                        });
                    } else {
                        if (this.props.userId) {
                            let instance = null;
                            if (this.props.userCommunity) {
                                instance = this.props.userCommunity;
                            }
                            this.props.navigation.navigate("communityProfile" + "Card", {
                                transition: "myCustomSlideRightTransition",
                                isCurrentUser: true,
                                memberDetail: instance
                            });
                            this.props.getMemberDetail(this.props.userId, true).then(res => {
                                this.props.getEventsDetails(this.props.userId, null, true, true, postId);
                            });
                        }
                    }
                }else{
                    if (lastState == "active") {
                        this.props.navigation.push('initialPage', {
                            goToTeamChat: true,
                            fromNotification: true
                        });
                    } else {
                        this.props.navigation.navigate('Team', {
                            transition: "fadeIn",
                            goToTeamChat: true,
                            fromNotification: true,
                            selectedTab: 1
                        });
                    }

                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    onIds = (device) => {
        // console.log('Device info: ', device);
    }

    render() {
        return (
            <InitialSplashView/>
        );
    }
}

const mapStateToProps = state => {
    return {
        isConnected: state.user.isConnected,
        appBadgeCount: state.user.appBadgeCount,
        eventBadgeCount: state.team.eventBadgeCount || 0,
        userDetails: state.user.userDetails,
        userId: (state.user.userDetails && state.user.userDetails.id) && state.user.userDetails.id || 0,
        userCommunity: state.user.userCommunity || null,
    };
};

export default connect(mapStateToProps, {
    manageAppBadgeCount,
    manageActivityEventBadgeCount,
    getTeamChat,
    getEventsDetails,
    getMemberDetail
})(Main);