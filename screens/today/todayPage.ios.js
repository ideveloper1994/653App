import React from 'react';
import {
    Alert,
    AppState,
    AsyncStorage,
    Linking,
    NativeModules,
    NetInfo,
    PushNotificationIOS,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import TotalProgress from '../tabs/progress/component/totalProgress'
import Constant from '../../helper/constant';
import TodaysTitle from './component/todaysTitle';
import Routine from './component/routineComponent';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {
    onCompletedMorningRoutine,
    setCompletedMorningRoutine,
    setMorningRoutine,
    updateMetaData
} from '../../actions/metadataActions';
import {getCurrentClean, goalCalculation} from '../../actions/statisticAction';
import {
    activeAppManagedTab,
    loadDataOnAppOpen,
    manageAchievedPopup,
    manageCheckupPopup,
    managedLetterAPI,
    manageMonthlyChallengeAchieved,
    manageMonthlyChallengePopup,
    managePopupQueue,
    manageRewiredProgressPopup,
    manageRewiringPopup,
    manageStreakAchievedPopup,
    manageTodayInstances,
    removeSafeArea,
    resetStoreData,
    sendTagOneSignal,
    setAskedForCheckupPopup,
    setCompletedExercises,
    setDateforTodayOpen,
    setDoneAPICallForToday,
    setIsNetworkAvailable,
    setRewiringPlayer,
    setSubscriptionInProcess,
    setUpLocalNotificationAlerts,
    tabChanged
} from '../../actions/userActions';
import {getEventsDetails, getMemberDetail} from "../../actions/teamAction";
import CheckupTime from './component/checkupTime';
import LifeTree from './component/lifeTree';
import * as Animatable from 'react-native-animatable';
import {cloneDeep, find} from 'lodash';
import moment from 'moment';
import {checkForValidation, loadAllProducts, restoreAllData} from '../../helper/inAppPurchase';
import * as StoreReview from 'react-native-store-review';
import {EventRegister} from 'react-native-event-listeners'
import {getCurrentMonth, resetAllAsyncStorageData, showThemeAlert} from "../../helper/appHelper";
import CleanDaysView from './../commonComponent/cleanButton';

const iconImage = {
    exercise: 'today_card_icon_exercise',
    audioExercise: 'today_card_icon_audio',
    letterIcon: 'today_card_icon_letter',
    thoughtIcon: 'today_card_icon_thought_control',
    protectIcon: 'today_card_icon_filter',
    BrainIcon: 'today_card_icon_brain_training',
    pathIcon: 'today_card_icon_choice',
    storyCardIcon: 'today_card_icon_story',
    videoIcon: 'today_card_icon_video',
    visualizationIcon: 'today_card_icon_imagine',
    activityIcon: 'today_card_icon_activity',
    DidyouknowIcon: 'today_card_icon_fact',
    BreathingIcon: 'today_card_icon_breathing',
    StressIcon: 'today_card_icon_zen',
    KegalIcon: 'today_card_icon_kegals',
    morningIcon: 'today_card_icon_morning',
    EmotionalIcon: 'today_card_icon_emotion',
    MeditationIcon: 'today_card_icon_meditation',
    FaithIcon: 'today_card_icon_faith',
    JournalIcon: 'today_card_icon_journal',
    rThoughtControl: 'today_icon_circle_thought_control',
    rChoosePath: 'today_icon_circle_choose',
    rVisualize: 'today_icon_circle_visualize',
    rMeditation: 'today_icon_circle_meditation',
    rStress: 'today_icon_circle_stress_relief',
    rStory: 'today_icon_circle_story',
    rEmotional: 'today_icon_circle_emotion',
    rBrainTraining: 'today_icon_circle_brain_training',
    rAboutYou: 'today_card_icon_profile',
    notificationIcon: 'today_card_icon_notifications',
    monthlyIcons: [
        'today_challenge_card_icon_jan',
        'today_challenge_card_icon_feb',
        'today_challenge_card_icon_mar',
        'today_challenge_card_icon_apr',
        'today_challenge_card_icon_may',
        'today_challenge_card_icon_jun',
        'today_challenge_card_icon_jul',
        'today_challenge_card_icon_aug',
        'today_challenge_card_icon_sep',
        'today_challenge_card_icon_oct',
        'today_challenge_card_icon_nov',
        'today_challenge_card_icon_dec'],
};

const allOptionalExercies = {
    lettersToYourSelf: {
        Icon: iconImage.letterIcon,
        title: "Write Your Letter",
        desc: "",
        pageName: 'lettersToYourSelf',
        improve: [{"Wisdom": 1}]
    },
    stressRelief: {
        Icon: iconImage.StressIcon,
        title: "Stress Relief",
        desc: "Stay calm and in control",
        pageName: 'stressRelief',
        improve: [{"Stress": 1}]
    },
    chooseYourPathActivity: {
        Icon: iconImage.pathIcon,
        title: "Choose your path",
        desc: "Remember what you want",
        pageName: 'chooseYourPathActivity',
        improve: [{"Wisdom": 1}]
    },
    visualizationActivity: {
        Icon: iconImage.visualizationIcon,
        title: "Visualize",
        desc: "Imagine a porn-free day",
        pageName: 'visualizationActivity',
        improve: [{"Dopamine": 1}]
    },
    thoughtActivity: {
        Icon: iconImage.thoughtIcon,
        title: "Thought Control",
        desc: "Master your mind",
        pageName: 'thoughtActivity',
        improve: [{"Hypofrontality": 1}]
    },
    protectDeviceActivity: {
        Icon: iconImage.protectIcon,
        title: "Protect your devices",
        desc: "Safeguard your phone",
        isIcon: false,
        pageName: '',
        improve: []
    },
    audioActivity: {
        Icon: iconImage.audioExercise,
        title: "Audio Exercise",
        desc: "Rewire your brain",
        pageName: 'audioActivity',
        improve: [{"Wisdom": 1}]
    },
    brainActivity: {
        Icon: iconImage.BrainIcon,
        title: "Brain Training",
        desc: "Reprogram your brain",
        pageName: 'brainActivity',
        improve: [{"Dopamine": 1}]
    },
    storyDetail: {
        Icon: iconImage.storyCardIcon,
        title: "Story",
        desc: "How life can change",
        pageName: 'storyDetail',
        improve: [{"Wisdom": 1}]
    },
    healthyActivity: {
        Icon: iconImage.activityIcon,
        title: "Healthy Activity",
        desc: "Positive dopamine release",
        pageName: 'healthyActivity',
        improve: [{"Dopamine": 1}]
    },
    didYouKnow: {
        Icon: iconImage.DidyouknowIcon,
        title: "Did you know?",
        desc: "The downside of pornography",
        pageName: 'didYouKnow',
        improve: [{"Wisdom": 1}]
    },
    breathingActivity: {
        Icon: iconImage.BreathingIcon,
        title: "Breathing Practice",
        desc: "Awareness and self-control",
        pageName: "breathingActivity",
        improve: [{"Stress": 1}]
    },
    kegalsActivity: {
        Icon: iconImage.KegalIcon,
        title: "Kegal Exercise",
        desc: "Improve erection quality",
        pageName: "kegalsActivity",
        improve: []
    },
    emotionalActivity: {
        Icon: iconImage.EmotionalIcon,
        title: "Emotional Growth",
        desc: "Focus on real love",
        pageName: "emotionalActivity",
        improve: [{"Dopamine": 1}]
    },
    medicationActivity: {
        Icon: iconImage.MeditationIcon,
        title: "Meditation",
        desc: "Improve hypofrontality and self-control",
        pageName: "medicationActivity",
        improve: [{"Hypofrontality": 3}, {"Stress": 1}]
    },
    faithActivity: {
        Icon: iconImage.FaithIcon,
        title: "Scripture",
        desc: "Faith and trust",
        pageName: "faithActivity",
        improve: []
    },
    journalActivity: {
        Icon: iconImage.JournalIcon,
        title: "Write in your journal",
        desc: "Externalize your thoughts",
        pageName: "journalActivity",
        improve: []
    },
    aboutYouActivity: {
        Icon: iconImage.rAboutYou,
        title: "About You",
        desc: "Complete your psychology profile",
        pageName: "aboutYouActivity",
        improve: []
    },
    internetFilterActivity: {
        Icon: iconImage.protectIcon,
        title: "Setup internet filter",
        desc: "Restrict adult websites",
        pageName: "internetFilterActivity",
        improve: []
    },
    notificationActivity: {
        Icon: iconImage.notificationIcon,
        title: "Enable Notifications",
        desc: "Team chat and milestones",
        pageName: "notificationsReminder",
        improve: []
    },
    monthlyChallenge: {
        Icon: iconImage.monthlyIcons[new Date().getMonth()],
        title: "Challenge",
        desc: "Go clean every day this month",
        pageName: "monthlyChallenge",
        improve: [],
    }
};

const allMorningRoutine = {
    rThoughtControl: {
        icon: iconImage.rThoughtControl,
        name: "Thought control",
        endicon: '',
        pageName: 'thoughtActivity',
        activityTime: 2,
        improve: [{"Hypofrontality": 1}]
    },
    rChoosePath: {
        icon: iconImage.rChoosePath,
        name: "Choose your path",
        endicon: '',
        pageName: 'chooseYourPathActivity',
        activityTime: 1,
        improve: [{"Wisdom": 1}]
    },
    rVisualize: {
        icon: iconImage.rVisualize,
        name: "Visualize",
        endicon: '',
        pageName: 'visualizationActivity',
        activityTime: 2,
        improve: [{"Dopamine": 1}]
    },
    rMeditation: {
        icon: iconImage.rMeditation,
        name: "Meditation",
        endicon: '',
        pageName: 'medicationActivity',
        activityTime: 10,
        improve: [{"Hypofrontality": 3}, {"Stress": 1}]
    },
    rStress: {
        icon: iconImage.rStress,
        name: "Stress relief",
        endicon: '',
        pageName: 'stressRelief',
        activityTime: 2,
        improve: [{"Stress": 1}]
    },
    rStory: {
        icon: iconImage.rStory,
        name: "Story",
        endicon: '',
        pageName: 'storyDetail',
        activityTime: 3,
        improve: [{"Wisdom": 1}]
    },
    rEmotional: {
        icon: iconImage.rEmotional,
        name: "Emotional growth",
        endicon: '',
        pageName: 'emotionalActivity',
        activityTime: 2,
        improve: [{"Dopamine": 1}]
    },
    rBrainTraining: {
        icon: iconImage.rBrainTraining,
        name: "Brain training",
        endicon: '',
        pageName: 'brainActivity',
        activityTime: 3,
        improve: [{"Dopamine": 1}]
    },
};

let isActivityPushed = false;
let NativeInternetFilter = NativeModules.InternetFilter;
let NativeCallback = NativeModules.checkBundle;
let isPopupInProcess = false;
let isRedirectToLogin = false;

class TodayPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkUpFlag: 1, // 1 means now
            checkUpTime: '6pm',
            todayTitle: "TODAY",
            morningRoutine: [],
            optionalExercies: [],
            checkupTimeMessage: "",
            visibleTab: props.visibleTab || "today",
            totalMorningRoutineTimes: "",
            gender: props.gender,
            isAllMorningRoutineDone: false,
            isAudioActivity: false,
            viewCompleted: false,
            appState: AppState.currentState,
            queue: props.popupQueue,
            isTodayTab: true,
            streakData: null,
            monthlyChallenge: allOptionalExercies.monthlyChallenge || {},
            isShowMonthlyChallenge: false,
            isAskForUpdateCalendar: false
        };
        isPopupInProcess = false;
    };

    componentWillMount() {
        if(this.props.navigation.state.params){
            if (this.props.navigation.state.params.goToTeamChat) {
                this.props.tabChanged("team");
                this.props.navigation.navigate('Team', {selectedTab: 1});
            } else if (this.props.navigation.state.params.goToCommunity) {
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
                        this.props.getEventsDetails(this.props.userId, null, true, true, this.props.navigation.state.params.postId);
                    });
                }
                this.props.tabChanged("milestone");
                this.props.navigation.navigate('Milestone', {goToCommunity: true});
            }
        }
        isRedirectToLogin = false;
        StatusBar.setHidden(false);
        this.setMorningRoutine();
        this.props.setSubscriptionInProcess(false);
        this.props.removeSafeArea(true);
        AppState.removeEventListener('change', this._handleAppStateChange);
        isPopupInProcess = false;
        isActivityPushed = false;
        this.manageMonthlyChalange();
    }

    componentDidMount() {
        AsyncStorage.setItem('isCheckupClicked', "false");
        AppState.addEventListener('change', this._handleAppStateChange);
        AsyncStorage.getItem('isNewOpen').then((isNewOpen) => {
            if (isNewOpen) {
                if (isNewOpen === "true") {
                    // if (!__DEV__) {
                    this.checkForSubscription();  // While release
                    // }
                }
                AsyncStorage.setItem('isNewOpen', "false");
            }
        });
        this.setWhenComponentMount(false, null, null, false);
        this.props.getCurrentClean().then(res => {
            this.managePopup(true, null, null, res, this.props);
        });
        EventRegister.removeEventListener(this.listener);
        this.listener = EventRegister.addEventListener('isTodayEventListener', (data) => {
            this.setState({
                isTodayTab: data
            }, () => {
                if (data) {
                    this.managePopup(true, 'today', true, null, this.props);
                }
            });
        });
        EventRegister.removeEventListener(this.redirectToLogin);
        this.redirectToLogin = EventRegister.addEventListener('RedirectToLogin', () => {
            if (!isRedirectToLogin) {
                isRedirectToLogin = true;
                this.props.resetStoreData();
                resetAllAsyncStorageData();
                this.props.navigation.navigate('login');
            }
        });
        this.props.sendTagOneSignal();
        this.setLastCheckupDate();
        this.setTimezone();
        this.setWidgetData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.visibleTab !== nextProps.visibleTab) {
            this.setState({
                visibleTab: nextProps.visibleTab
            });
        }
        AsyncStorage.getItem('isTodayActivityChanged').then((isChanged) => {
            if (isChanged) {
                if (isChanged === "true") {
                    this.setOptionalActivities();
                    this.setMorningRoutine();
                }
                AsyncStorage.setItem('isTodayActivityChanged', "false");
            }
        });
        this.setCheckupView();
        this.setDayTitle();
        if (this.state.gender !== nextProps.gender) {
            this.setState({
                gender: nextProps.gender,
            });
        }
        this.setMorningRoutineLabel();

        let insideIf = false;
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            if (nextProps.userId) {
                this.setWidgetData();
            }
            if (this.props.last_checkup_at !== nextProps.last_checkup_at ||
                JSON.stringify(this.state.queue) !== JSON.stringify(nextProps.popupQueue) ||
                JSON.stringify(this.props.p_array) !== JSON.stringify(nextProps.p_array) ||
                JSON.stringify(this.props.showStreakGoalPopUp) !== JSON.stringify(nextProps.showStreakGoalPopUp) ||
                JSON.stringify(this.props.showRewindProgressPopUp) !== JSON.stringify(nextProps.showRewindProgressPopUp) ||
                JSON.stringify(this.props.currentGoal) !== JSON.stringify(nextProps.currentGoal) ||
                (this.state.visibleTab !== "today" && nextProps.visibleTab === "today")) {
                insideIf = true;
                setTimeout(() => {
                    this.managePopup(false, nextProps.visibleTab, null,
                        {cleanDays: nextProps.current_p_clean_days, goal: nextProps.currentGoal.goalDays}, nextProps);
                }, 100);
                this.manageMonthlyChalange();
            }
        }
        if (JSON.stringify(this.state.queue) !== JSON.stringify(nextProps.popupQueue)) {
            this.setState({
                queue: nextProps.popupQueue
            });
            if (!insideIf) {
                // setTimeout(()=>{
                //     this.managePopup(false, nextProps.visibleTab);
                // },300);
            }
        }
        //Ask for rate popup
        AsyncStorage.getItem('isTodayCheckUpDone').then((isDone) => {
            if (isDone && isDone === "true") {
                this.askForRatePopup();
                AsyncStorage.setItem('isTodayCheckUpDone', "false");
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        try{
            if(JSON.stringify(nextProps) !== JSON.stringify(this.props) || JSON.stringify(nextState) !== JSON.stringify(this.nextState)){
                return true;
            }
            return false;
        }catch (e){
            console.log(e);
        }
        return true;
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        EventRegister.removeEventListener(this.redirectToLogin);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return this.state.isTodayTab
    //     }else {
    //         return isActivityPushed;
    //     }
    // }

    _handleAppStateChange = (nextAppState) => {
        isPopupInProcess = false;
        if (this.state.appState.match(/background/) && nextAppState === 'active') {
            this.props.getCurrentClean().then(res => {
                this.checkIsNeedToShowPopup(res.cleanDays, res.goal);
            }).catch(err => {
                this.setWhenComponentMount(true);
            });
            this.props.activeAppManagedTab();
            this.props.managedLetterAPI();
            // this.props.goalCalculation();
            this.props.sendTagOneSignal();
            this.manageMonthlyChalange();
            this.setState({
                isAskForUpdateCalendar: false
            });
        } else {
            if (nextAppState === "background" && this.state.appState === "inactive") {
                //app is in background
                this.setState({
                    streakData: this.props.showStreakGoalPopUp
                });
                this.props.setAskedForCheckupPopup(false);
                this.hideAlltodaysPopup();
            }
        }
        if (nextAppState === 'active') {
            this.props.goalCalculation();
            AsyncStorage.setItem('isCheckupClicked', "false");
        }
        this.setState({appState: nextAppState});
    };

    //Hide all open popup while app will enter in background or go to getStarted
    hideAlltodaysPopup = () => {
        this.props.setDateforTodayOpen(false, true, true);
        let objStreak = {
            isShow: false,
            achivedGoal: this.props.showStreakGoalPopUp.achivedGoal,
            displayDate: this.props.showStreakGoalPopUp.displayDate,
            whileGoal: this.props.showStreakGoalPopUp.whileGoal,
            inProcess: false
        }
        this.props.manageStreakAchievedPopup(objStreak);
        this.props.manageRewiredProgressPopup(false, true);
        this.props.managePopupQueue({checkup: null, streakGoal: null, rewired: null, monthlyChallenge: null});
        this.props.manageCheckupPopup({
            isShow: false,
            checkUpDetail: {}
        });
        isPopupInProcess = false;
    };

    setWidgetData = () => {
        let goalDays = (this.props.currentGoal.goalDays === 1) ? "24 hours clean"
            : this.props.currentGoal.goalDays + " days clean";
        let data = JSON.stringify({
            totalDays: (this.props.total_p_clean_days + "").toString(),
            currentClean: (this.props.current_p_clean_days + "").toString(),
            bestStreak: (this.props.best_p_clean_days + "").toString(),
            currentPer: this.props.currentGoal.per,
            goalDescription: "Current goal - " + goalDays,
            isLogin: "YES"
        })
        NativeCallback.setTodayWidget(data);
    }

    //Rate popup -> call is says today is porn free day
    askForRatePopup = () => {
        if (this.props.current_p_clean_days > 30) {
            AsyncStorage.getItem("AppInstallationDate").then(res => {
                if (res) {
                    let iDate = moment(res, 'YYYY-MM-DD').toDate();
                    let diff = moment().diff(iDate, 'days');
                    if (diff >= 2) {
                        AsyncStorage.getItem("isAskToGiveRate").then(isAsk => {
                            if (isAsk === null || isAsk !== "true") {
                                // alert("Ask for rate popup")
                                if (Constant.isIOS) {
                                    if (StoreReview.isAvailable) {
                                        StoreReview.requestReview();
                                        AsyncStorage.setItem("isAskToGiveRate", "true");
                                    }
                                }
                            }
                        }).catch(err => {
                            if (__DEV__) {
                                alert(err)
                            }
                        });
                    }
                }
            }).catch(err => {
                if (__DEV__) {
                    alert(err)
                }
            });
        }
    }

    //connection change
    manageConnectionChangeListener = () => {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
        NetInfo.isConnected.fetch().then(isConnected => {
            this.handleFirstConnectivityChange(isConnected)
        });
    };

    handleFirstConnectivityChange = (isConnected) => {
        this.props.setIsNetworkAvailable(isConnected);
    };


    setWhenComponentMount = (isActive = false, visibleTab = null, isTodayTab = null, isCallPopup = true) => {
        this.manageConnectionChangeListener();
        this.props.setSubscriptionInProcess(false);
        this.setCheckupView();
        this.setDayTitle();
        this.setMorningRoutine();
        this.setOptionalActivities();
        if (this.props.navigation.state.params) {
            if (this.props.navigation.state.params.isFadeToday) {
                if (!isActive) {
                    this.makeFadeInAnimation();
                }
            }
        } else {
            if (this.props.navigation.state) {
                if (this.props.navigation.state.isFadeToday) {
                    if (!isActive) {
                        this.makeFadeInAnimation();
                    }
                }
            }
        }
        this.props.setUpLocalNotificationAlerts();
        if (isCallPopup) {
            setTimeout(() => {
                this.managePopup(isActive, visibleTab, isTodayTab, null, this.props);
            }, 100);
        }

        this.setAllUpdatedData();
    };

    makeFadeInAnimation = () => {

        console.log("fade---")

        // this.props.removeSafeArea(true);
        // if (this.refs.mainView) {
        //     this.refs.mainView.fadeIn(200);
        // }
    };

    checkIsNeedToShowPopup = (cleanDays, goal) => {
        //Streak goal
        let showStreakGoalPopUp = this.state.streakData;
        let currentClean = cleanDays;
        if (currentClean != 0 && !showStreakGoalPopUp.inProcess && !showStreakGoalPopUp.isShow) {
            if (currentClean == 1 || currentClean == 3 || currentClean == 7 || currentClean == 14 ||
                currentClean == 30 || currentClean == 90 || currentClean == 365) {
                let today = new Date().toDateString();
                if (showStreakGoalPopUp.achivedGoal != currentClean) {
                    if (showStreakGoalPopUp.displayDate === today && showStreakGoalPopUp.whileGoal === goal) {
                        //do nothing
                    } else {
                        this.props.navigation.navigate('Today');
                        this.props.tabChanged("today");
                        this.setWhenComponentMount(true, 'today', true);
                        this.setState({
                            isTodayTab: true
                        });
                        return;
                    }
                }
            }
        }

        //Rewired
        let obj = this.props.showRewindProgressPopUp;
        let diff = obj.rewindDetail.totalRewiringPercentage - obj.rewindDetail.prevProgress;
        if (diff !== 0 && (diff % 10 === 0) && !obj.isShow) {
            this.props.navigation.navigate('Today');
            this.props.tabChanged("today");
            this.setWhenComponentMount(true, 'today', true);
            this.setState({
                isTodayTab: true
            })
            return;
        }

        let currentHour = new Date().getHours();
        let checkupHour = this.props.checkupTime;
        if (currentHour >= checkupHour && this.props.last_checkup_at !== moment().format("YYYY-MM-DD")) {
            this.props.navigation.navigate('Today');
            this.props.tabChanged("today");
            this.setWhenComponentMount(true, 'today', true);
            this.setState({
                isTodayTab: true
            })
            return;
        }
        this.setWhenComponentMount(true);
    }

    managePopup = (isActive = false, visibleTab = null, isTodayTab = null, goalData = null, nextProps = null) => {
        try{
            if (nextProps == null) {
                nextProps = this.props;
            }
            if (!isPopupInProcess) {
                isPopupInProcess = true;
                if (visibleTab == null) {
                    visibleTab = nextProps.visibleTab;
                }
                if (isTodayTab === null) {
                    isTodayTab = this.state.isTodayTab;
                }
                if ((this.state.appState === 'active' || isActive) && visibleTab === "today" && nextProps.popupQueue.checkup === null &&
                    nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.rewired === null
                    && (nextProps.popupQueue.monthlyChallenge === undefined || nextProps.popupQueue.monthlyChallenge === null) && isTodayTab) {
                    let checkupDate = nextProps.last_checkup_at;
                    let date = new Date().toDateString();
                    let objFirstAsk = nextProps.isOpenFirstTime;
                    let currentHour = new Date().getHours();
                    let checkupHour = nextProps.checkupTime;
                    let todayDate = moment().format("YYYY-MM-DD");
                    let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                    let dayBeforeYesterdayDate = moment().subtract(2, 'days').format('YYYY-MM-DD');

                    if (objFirstAsk.isNewOpen || isActive) {
                        // if (currentHour < checkupHour) {
                        if (nextProps.last_checkup_at === yesterdayDate
                            || nextProps.last_checkup_at === todayDate || nextProps.last_checkup_at === ""
                            || nextProps.last_checkup_at === null) {
                        } else {
                            if (nextProps.last_checkup_at === dayBeforeYesterdayDate) {
                                if (find(nextProps.p_array, {occurred_at: yesterdayDate}) === undefined
                                    && nextProps.popupQueue.checkup == null) {
                                    nextProps.manageCheckupPopup({
                                        isShow: true,
                                        checkUpDetail: {
                                            title: this.getGreetingMessage() + nextProps.userName,
                                            alertMessage: "You missed your checkup yesterday.",
                                            buttonTitle: "Complete now",
                                            closeText: "",
                                            pageName: "checkUp",
                                            scrollToTopToday: this.scrollToTopToday,
                                            isYesterday: true
                                        }
                                    });
                                    nextProps.setDateforTodayOpen(false, false);
                                    isPopupInProcess = false;
                                    return;
                                }
                                nextProps.setDateforTodayOpen(false, false);
                            } else {
                                if (objFirstAsk.date === date && objFirstAsk.isAskForUpdateCalendar) {
                                    // if(isActive){
                                    //     if (find(nextProps.p_array, {occurred_at: todayDate}) === undefined &&
                                    //         find(nextProps.p_array, {occurred_at: yesterdayDate}) === undefined &&
                                    //         find(nextProps.p_array, {occurred_at: dayBeforeYesterdayDate}) === undefined) {
                                    //         nextProps.manageCheckupPopup({
                                    //             isShow: true,
                                    //             checkUpDetail: {
                                    //                 title: "Welcome back " + nextProps.userName,
                                    //                 alertMessage: "Take a moment to update your calendar.",
                                    //                 buttonTitle: "Update calendar",
                                    //                 closeText: "Update later",
                                    //                 pageName: "editPornCalendar"
                                    //             }
                                    //         });
                                    //     }
                                    //     nextProps.setDateforTodayOpen(true, false);
                                    //     return;
                                    // }
                                } else {
                                    //All time here
                                    if(!this.state.isAskForUpdateCalendar){
                                        if (find(nextProps.p_array, {occurred_at: todayDate}) === undefined &&
                                            find(nextProps.p_array, {occurred_at: yesterdayDate}) === undefined &&
                                            find(nextProps.p_array, {occurred_at: dayBeforeYesterdayDate}) === undefined &&
                                            nextProps.popupQueue.checkup == null) {
                                            nextProps.manageCheckupPopup({
                                                isShow: true,
                                                checkUpDetail: {
                                                    title: "Welcome back " + nextProps.userName,
                                                    alertMessage: "Take a moment to update your calendar.",
                                                    buttonTitle: "Update calendar",
                                                    closeText: "Update later",
                                                    pageName: "editPornCalendar"
                                                }
                                            });
                                            this.setState({
                                                isAskForUpdateCalendar: true
                                            })
                                        }
                                        nextProps.setDateforTodayOpen(true, false);
                                        isPopupInProcess = false;
                                        return;
                                    }
                                }
                            }
                        }
                        // }
                        //nextProps.setDateforTodayOpen(objFirstAsk.isAskForUpdateCalendar, false);
                    }

                    //Streak goal
                    if (nextProps.popupQueue.checkup === null) {
                        let showStreakGoalPopUp = nextProps.showStreakGoalPopUp;
                        let currentClean = nextProps.current_p_clean_days;
                        let goalDays = nextProps.currentGoal.goalDays;
                        if (goalData !== null) {
                            currentClean = goalData.cleanDays;
                            goalDays = goalData.goal;
                        }
                        if (currentClean != 0 && !showStreakGoalPopUp.inProcess && !showStreakGoalPopUp.isShow) {
                            if (currentClean == 1 || currentClean == 3 || currentClean == 7 || currentClean == 14 ||
                                currentClean == 30 || currentClean == 90 || currentClean == 365) {
                                let today = new Date().toDateString();
                                if (showStreakGoalPopUp.achivedGoal != currentClean) {
                                    if (showStreakGoalPopUp.displayDate === today && showStreakGoalPopUp.whileGoal === goalDays) {
                                        //do nothing
                                    } else {
                                        let displayObj = {};
                                        let popupQueueObj = nextProps.popupQueue;
                                        popupQueueObj.streakGoal = true;
                                        nextProps.managePopupQueue(popupQueueObj);
                                        let obj = {
                                            isShow: true,
                                            achivedGoal: currentClean,
                                            displayDate: today,
                                            inProcess: true,
                                            whileGoal: goalDays
                                        }
                                        nextProps.manageStreakAchievedPopup(obj);
                                        isPopupInProcess = false;
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    //Rewired
                    if (nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null) {
                        let obj = nextProps.showRewindProgressPopUp;
                        let diff = obj.rewindDetail.totalRewiringPercentage - obj.rewindDetail.prevProgress;
                        if (diff !== 0 && (diff % 10 === 0) && !obj.isShow) {
                            nextProps.manageRewiredProgressPopup(true);
                            isPopupInProcess = false;
                            return;
                        }
                    }

                    //Monthly Challenge
                    let currentDate = new Date().getDate();
                    if (currentDate == 1) {
                        if (nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null
                            && (nextProps.popupQueue.monthlyChallenge === undefined || nextProps.popupQueue.monthlyChallenge === null)) {

                            let currentMonth = new Date().getMonth();
                            let currentYear = new Date().getFullYear();
                            let prevMonth = currentMonth - 1;
                            if (currentMonth == 0) {
                                prevMonth = 11;  //December
                                currentYear = currentYear - 1;
                            }
                            if (nextProps.clean_p_days_per_month && nextProps.clean_p_days_per_month[currentYear.toString()] &&
                                nextProps.clean_p_days_per_month[currentYear.toString()]["monthArr"]) {
                                let lastMonth = nextProps.clean_p_days_per_month[currentYear.toString()]["monthArr"][prevMonth];
                                if (lastMonth == 100) {
                                    if (nextProps.monthlyChallengeAchived && nextProps.monthlyChallengeAchived.month != prevMonth &&
                                        nextProps.monthlyChallengeAchived.year != currentYear) {
                                        nextProps.manageMonthlyChallengeAchieved({
                                            month: prevMonth,
                                            year: currentYear,
                                            showDate: moment().format("YYYY-MM-DD")
                                        });
                                        nextProps.manageMonthlyChallengePopup({
                                            isShow: true,
                                            monthlyDetail: {
                                                year: currentYear,
                                                month: prevMonth,
                                                description: "Challenge won",
                                                title: "Clean " + getCurrentMonth(prevMonth),
                                                iconType: "Y",
                                                progressPer: "100%",
                                                actualProgress: "Progress - 100%",
                                                type: 'rewiring',
                                                isAchieved: true
                                            }
                                        });
                                        isPopupInProcess = false;
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    if (currentHour >= checkupHour) {
                        if (!nextProps.isAskForCheckup && nextProps.popupQueue.streakGoal === null && nextProps.popupQueue.checkup === null
                            && (nextProps.popupQueue.monthlyChallenge === undefined || nextProps.popupQueue.monthlyChallenge === null)) {
                            if (nextProps.last_checkup_at !== todayDate) {
                                nextProps.manageCheckupPopup({
                                    isShow: true,
                                    checkUpDetail: {
                                        title: this.getGreetingMessage() + nextProps.userName,
                                        alertMessage: "It's time for your checkup.",
                                        buttonTitle: "Begin",
                                        closeText: "Checkup later",
                                        pageName: "checkUp",
                                        scrollToTopToday: this.scrollToTopToday,
                                    }
                                });
                                nextProps.setAskedForCheckupPopup(true);
                                isPopupInProcess = false;
                                return;
                            }
                        }
                    }
                }
                isPopupInProcess = false;
            }
        }catch (e){
            isPopupInProcess = false;
            console.log(e)
        }
    }

    setAllUpdatedData = () => {
        if (this.props.todayViewInstance !== null) {
            clearInterval(this.props.todayViewInstance);
        }
        let instance = setInterval(() => {
            let currentHour = new Date().getHours();
            if (currentHour === 0) {
                let today = new Date().toDateString();
                if (this.props.dateForAPICall !== today) {
                    this.props.setDoneAPICallForToday().then(res => {
                        this.props.loadDataOnAppOpen().then((res) => {
                            this.props.setUpLocalNotificationAlerts();
                            setTimeout(() => {
                                this.managePopup();
                            }, 400);
                        }).catch((err) => {
                        });
                        this.setMorningRoutine();
                        this.setOptionalActivities();
                    })
                }
                this.props.goalCalculation(true);
            } else {
                this.props.goalCalculation();
            }
            this.managePopup();
        }, 10000);
        this.props.manageTodayInstances(instance);
    };

    setDayTitle = () => {
        let todayDate = moment().format("YYYY-MM-DD");
        let today = new Date().getDay();
        this.setState({
            todayTitle: (today === 0) ? (this.props.registered_at === todayDate) ? "SUNDAY" : "REST DAY" : "TODAY"
        });
    };

    manageMonthlyChalange = () => {
        let todayDate = new Date().getDate();
        if (todayDate == 1) {
            let todayDate = moment().format("YYYY-MM-DD");
            let todayObj = find(this.props.p_array, {occurred_at: todayDate});
            if (todayObj != undefined && todayObj.is_relapse) {
                this.setState({
                    isShowMonthlyChallenge: false,
                });
            } else {
                let objMonthlyChallenge = this.state.monthlyChallenge;
                objMonthlyChallenge.title = getCurrentMonth() + " challenge";
                objMonthlyChallenge.Icon = iconImage.monthlyIcons[new Date().getMonth()];
                this.setState({
                    monthlyChallenge: objMonthlyChallenge,
                    isShowMonthlyChallenge: true,
                });
            }
        }else{
            this.setState({
                isShowMonthlyChallenge: false
            });
        }
    }

    onSelectMonthlyChallenge = (obj) => {
        this.props.manageMonthlyChallengePopup({
            isShow: true,
            monthlyDetail: {
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                description: "Report a clean day every day this month to win this achievement.",
                title: getCurrentMonth() + " challenge",
                iconType: "Y",
                progressPer: "4%",
                actualProgress: "Progress - 0%",
                type: 'today',
            }
        });
    }

    setMorningRoutine = () => {
        try{
            let today = new Date().getDay();
            let morningRoutine = [];
            let todayDate = moment().format("YYYY-MM-DD");
            if (this.props.registered_at === todayDate) {
                morningRoutine = [
                    allMorningRoutine.rChoosePath,
                    allMorningRoutine.rBrainTraining,
                    allMorningRoutine.rStory,
                    allMorningRoutine.rEmotional,
                    allMorningRoutine.rMeditation
                ];
            } else {
                switch (today) {
                    case 1 :
                        morningRoutine = [
                            allMorningRoutine.rThoughtControl,  //
                            allMorningRoutine.rChoosePath, //..
                            allMorningRoutine.rVisualize, //..
                            allMorningRoutine.rMeditation //..
                        ];
                        break;
                    case 2 :
                        morningRoutine = [
                            allMorningRoutine.rStress, //..
                            allMorningRoutine.rStory, //..
                            allMorningRoutine.rEmotional, //..
                            allMorningRoutine.rMeditation,
                        ];
                        break;
                    case 3 :
                        morningRoutine = [
                            allMorningRoutine.rChoosePath,
                            allMorningRoutine.rBrainTraining, //
                            allMorningRoutine.rMeditation,
                        ];
                        break;
                    case 4 :
                        morningRoutine = [
                            // allMorningRoutine.rMeditation,
                            allMorningRoutine.rVisualize,
                            allMorningRoutine.rStory,
                            allMorningRoutine.rMeditation
                        ];
                        break;
                    case 5 :
                        morningRoutine = [
                            allMorningRoutine.rThoughtControl,
                            allMorningRoutine.rEmotional,
                            allMorningRoutine.rChoosePath,
                            allMorningRoutine.rMeditation,
                        ];
                        break;
                    case 6 :
                        morningRoutine = [
                            allMorningRoutine.rStory,
                            allMorningRoutine.rBrainTraining,
                            allMorningRoutine.rMeditation,
                        ];
                        break;
                    case 0 :
                        morningRoutine = [
                            allMorningRoutine.rMeditation,
                        ];
                        break;
                }
            }

            let filteredMorning = [];
            morningRoutine.forEach(obj => {
                if (obj) {
                    if (find(this.props.todayScreenExercise, {pageName: obj.pageName}) === undefined
                        || find(this.props.todayScreenExercise, {pageName: obj.pageName, isSelected: true}) !== undefined) {
                        filteredMorning.push(obj);
                    }
                }
            });
            let totalTime = 0;
            filteredMorning.forEach(obj => {
                if (obj) {
                    totalTime += (obj.pageName === "medicationActivity") && this.props.meditationTime || obj.activityTime;
                }
            });
            this.setState({
                morningRoutine: filteredMorning,
                totalMorningRoutineTimes: totalTime + " minutes"
            });
            this.props.setMorningRoutine(filteredMorning);
        }catch (e){console.log(e)}
    };

    setMorningRoutineLabel = () => {
        let index = 0;
        let totalTime = 0;
        let today = new Date().toDateString();
        this.state.morningRoutine.forEach(obj => {
            totalTime += (obj.pageName === "medicationActivity") && this.props.meditationTime || obj.activityTime;
            if (this.isReplayActivity(obj.pageName)) {
                index += 1;
            }
        });
        if (index === this.state.morningRoutine.length || index === 0) {
            this.setState({
                totalMorningRoutineTimes: totalTime + " minutes",
                isAllMorningRoutineDone: index === this.state.morningRoutine.length
            });
        } else {
            this.setState({
                totalMorningRoutineTimes: "Tap to resume"
            });
        }
    };

    setOptionalActivities = () => {
        try{
            let isAudioActivity = false;
            let today = new Date().getDay();
            let optionalExercies = [];
            let todayDate = moment().format("YYYY-MM-DD");
            if (this.props.registered_at === todayDate) {
                isAudioActivity = true;
                optionalExercies = [
                    allOptionalExercies.didYouKnow, //..
                    allOptionalExercies.stressRelief]; //..
            } else {
                switch (today) {
                    case 1 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.stressRelief, //
                            allOptionalExercies.healthyActivity, //..
                        ];
                        break;
                    case 2 :
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.faithActivity, //..
                        ];
                        break;
                    case 3 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.healthyActivity,
                        ];
                        break;
                    case 4 :
                        optionalExercies = [
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.faithActivity,
                        ];
                        break;
                    case 5 :
                        isAudioActivity = true;
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.didYouKnow
                        ];
                        break;
                    case 6 :
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.kegalsActivity,
                            allOptionalExercies.healthyActivity,
                            allOptionalExercies.stressRelief,
                        ];
                        break;
                    case 0 :
                        optionalExercies = [
                            allOptionalExercies.lettersToYourSelf,
                            allOptionalExercies.breathingActivity,
                            allOptionalExercies.didYouKnow,
                            allOptionalExercies.faithActivity,
                        ];
                        break;
                }
            }
            // optionalExercies=[
            // allOptionalExercies.audioActivity,
            // allOptionalExercies.brainActivity,
            // allOptionalExercies.breathingActivity, //top
            // allOptionalExercies.chooseYourPathActivity,
            // allOptionalExercies.didYouKnow,
            // allOptionalExercies.emotionalActivity,
            // allOptionalExercies.faithActivity,
            // allOptionalExercies.healthyActivity,
            // allOptionalExercies.kegalsActivity,
            // allOptionalExercies.lettersToYourSelf,
            // allOptionalExercies.medicationActivity,
            // allOptionalExercies.storyDetail,
            // allOptionalExercies.stressRelief,
            // allOptionalExercies.thoughtActivity,
            // allOptionalExercies.visualizationActivity,
            // ];
            let filteredOptional = [];

            let cardPosition = 0;
            if (this.props.exercise_number_profile <= 9) {
                let description = ["", "psychology", "anxiety", "self-esteem", "stress", "relationship", "behavioural", "activity", "dietary", ""];
                if (this.isReplayActivity(allOptionalExercies.aboutYouActivity.pageName)) {
                    allOptionalExercies.aboutYouActivity.desc = "Complete your " + description[this.props.exercise_number_profile - 1] + " profile";

                } else {
                    allOptionalExercies.aboutYouActivity.desc = "Complete your " + description[this.props.exercise_number_profile] + " profile";
                }
                if (this.props.exercise_number_profile > 8) {
                    if (this.isReplayActivity(allOptionalExercies.aboutYouActivity.pageName)) {
                        optionalExercies.splice(0, 0, allOptionalExercies.aboutYouActivity);
                        cardPosition = 1;
                    }
                } else {
                    optionalExercies.splice(0, 0, allOptionalExercies.aboutYouActivity);
                    cardPosition = 1;
                }
            }

            PushNotificationIOS.checkPermissions(res => {
                if (res.alert == 1) {
                    //Allow
                } else {
                    //Show notification card
                    if (find(this.props.todayScreenExercise, {pageName: "notificationsReminder"}) === undefined
                        || find(this.props.todayScreenExercise, {
                            pageName: "notificationsReminder",
                            isSelected: true
                        }) !== undefined) {
                        optionalExercies.splice(cardPosition, 0, allOptionalExercies.notificationActivity);
                        cardPosition = cardPosition + 1;
                    }
                }

                AsyncStorage.getItem('isFilterOnToday').then((isFilterOnToday) => {
                    if (isFilterOnToday === null || this.isReplayActivity(allOptionalExercies.internetFilterActivity.pageName)) {
                        optionalExercies.splice(cardPosition, 0, allOptionalExercies.internetFilterActivity);
                    }
                    //If Did you know > 15 then not diaply card
                    if (this.props.exercise_number_learn > 15) {
                        if (this.props.exercise_number_learn == 16 && this.isReplayActivity(allOptionalExercies.didYouKnow.pageName)) {
                            //Do nothing
                        } else {
                            let index = optionalExercies.indexOf(allOptionalExercies.didYouKnow);
                            if (index >= 0) {
                                optionalExercies.splice(index, 1);
                            }
                        }
                    }

                    optionalExercies.forEach(obj => {
                        if (find(this.props.todayScreenExercise, {pageName: obj.pageName}) === undefined
                            || find(this.props.todayScreenExercise, {
                                pageName: obj.pageName,
                                isSelected: true
                            }) !== undefined) {
                            filteredOptional.push(obj);
                        }
                    });

                    if (find(this.props.todayScreenExercise, {
                            pageName: allOptionalExercies.audioActivity.pageName,
                            isSelected: false
                        }) !== undefined) {
                        isAudioActivity = false;
                    }
                    if (find(this.props.todayScreenExercise, {pageName: "journal", isSelected: true}) !== undefined) {
                        filteredOptional.push(allOptionalExercies.journalActivity);
                    }
                    this.setState({
                        optionalExercies: cloneDeep(filteredOptional),
                        isAudioActivity: isAudioActivity
                    });
                });
            });
        }catch (e){console.log(e)}
    };

    setCheckupView = () => {
        let currentHour = new Date().getHours();
        let checkupHour = this.props.checkupTime;
        let checkUpTime = this.state.checkUpTime;
        switch (checkupHour) {
            case 18:
                checkUpTime = "6pm";
                break;
            case 19:
                checkUpTime = "7pm";
                break;
            case 20:
                checkUpTime = "8pm";
                break;
            case 21:
                checkUpTime = "9pm";
                break;
            case 22:
                checkUpTime = "10pm";
                break;
            case 23:
                checkUpTime = "11pm";
                break;
        }
        let flag = 1;
        if (currentHour >= checkupHour) {
            flag = 2;
        }
        this.getCheckupMessage(flag, checkUpTime);
        this.setState({
            checkUpTime: checkUpTime,
            checkUpFlag: flag,
        });
    };

    getCheckupMessage = (flag, checkUpTime) => {
        try{
            let message = "Evening checkup";
            let todayDate = moment().format("YYYY-MM-DD");
            if (this.props.last_checkup_at === todayDate) {
                message = (Constant.screenWidth < 350) && "Checkup complete."
                    || "Checkup done. Tap to redo.";
            } else {
                if (flag === 1) {
                    if (Constant.screenWidth < 350) {
                        message = "Checkup set for " + checkUpTime;
                    } else {
                        message = "Checkup scheduled for " + checkUpTime;
                    }
                }
            }
            this.setState({
                checkupTimeMessage: message
            });
        }catch (e){console.log(e)}
    };

    getGreetingMessage = () => {
        let myDate = new Date();
        let hrs = myDate.getHours();
        if (hrs < 12)
            return "Good Morning ";
        else if (hrs >= 12 && hrs <= 17)
            return "Good Afternoon ";
        else if (hrs >= 17 && hrs <= 24)
            return "Good Evening ";
    };

    onLifeTreeSelect = () => {
        this.props.removeSafeArea();
        this.props.navigation.navigate("lifeTree", {
            makeFadeInAnimation: this.makeFadeInAnimation,
            scrollToTopToday: this.scrollToTopToday,
            isFromTodayScreen: true,
            onBackLifeTree: this.onBackLifeTree, transition: "myCustomSlideUpTransition"
        });
        isActivityPushed = true;
    };

    onCheckupCardClicked = () => {
        try{
            let todayDate = moment().format("YYYY-MM-DD");
            let currentHour = new Date().getHours();
            let checkupHour = this.props.checkupTime;
            if (currentHour < checkupHour) {
                if (this.props.last_checkup_at === todayDate) {
                    this.props.manageCheckupPopup({
                        isShow: true,
                        checkUpDetail: {
                            title: "Checkup done.",
                            alertMessage: "Would you like to redo your checkup?",
                            buttonTitle: "Redo checkup",
                            closeText: "Keep existing checkup",
                            pageName: "checkUp",
                            scrollToTopToday: this.scrollToTopToday,

                        }
                    });
                } else {
                    this.props.manageCheckupPopup({
                        isShow: true,
                        checkUpDetail: {
                            title: "Checkup set for " + this.state.checkUpTime,
                            alertMessage: "Would you like to checkup now?",
                            buttonTitle: "Begin",
                            closeText: "Checkup later",
                            pageName: "checkUp",
                            scrollToTopToday: this.scrollToTopToday,

                        }
                    });
                }
            } else {
                this.props.removeSafeArea();
                AsyncStorage.getItem('isCheckupClicked').then((isCheckupClicked) => {
                    AsyncStorage.setItem('isCheckupClicked',"true");
                    if (isCheckupClicked || isCheckupClicked === "false") {
                        this.props.navigation.navigate("checkUp", {
                            isYesterday: false,
                            isFromToday: true,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition"
                        });
                    }
                });
            }
        }catch (e){console.log(e)}
    };

    //Managed Pushnotification enable or disable card
    notificationCardPress = () => {
        try{
            NativeCallback.checkForNotification((error, events) => {
                if (events == "NotDetermined") {
                    PushNotificationIOS.requestPermissions().then(res => {
                        if (res.alert == 1) {
                            this.setOptionalActivities();
                            this.props.sendTagOneSignal();
                            //allow
                        } else {
                            //don't allow
                        }
                    }).catch(res => {
                    });
                } else {
                    showThemeAlert({
                        title: "App Permission Denied",
                        message: "To re-enable, please go to Settings and turn on Notification Service.",
                        leftBtn: "Cancel",
                        styleLeft: 'destructive',
                        leftPress: () => {
                        },
                        rightBtn: "Settings",
                        rightPress: () => {
                            Linking.canOpenURL('app-settings:').then(supported => {
                                Linking.openURL('app-settings:')
                            }).catch(error => {
                            })
                        },
                    });
                }
            })
        }catch (e){console.log(e)}
    }

    onSelectExercises = (page, isMornigRoutine = false) => {
        try {
            if (page === "morningRoutine") {
                this.manageMorningRoutine();
            } else {
                this.props.removeSafeArea();
                if (isMornigRoutine) {
                    let obj = find(this.state.morningRoutine, {pageName: page});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    let length = this.state.morningRoutine.length;
                    isActivityPushed = true;
                    this.props.navigation.navigate(page,
                        {
                            pageName: page,
                            isReplay: this.isReplayActivity(page),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            improve: obj.improve || [],
                            isOptional: false,
                            isLast: false,
                            introTitle: objIndex + " of " + length,
                            onCompleteExercises: this.onCompleteExercises,
                            makeFadeInAnimation: this.makeFadeInAnimation,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition"
                        });
                } else {
                    if (page === "notificationsReminder") {
                        this.notificationCardPress();
                    } else if (page === "journalActivity") {
                        this.onJournalActivityPress();
                    } else {
                        let obj = find(allOptionalExercies, {pageName: page});
                        if (page.includes("internetFilter")) {
                            NativeInternetFilter.checkIsFilterEnable((error, events) => {
                                if (events == "NULL") {
                                    this.props.navigation.navigate(page,
                                        {
                                            isReplay: this.isReplayActivity(page),
                                            pageName: page, setDoneMorningRoutine: this.setDoneMorningRoutine,
                                            isOptional: true,
                                            improve: obj.improve || [],
                                            onCompleteExercises: this.onCompleteExercises,
                                            makeFadeInAnimation: this.makeFadeInAnimation,
                                            scrollToTopToday: this.scrollToTopToday,
                                            transition: "myCustomSlideUpTransition"
                                        });
                                    isActivityPushed = true;
                                } else {
                                    this.props.navigation.navigate("internetFilter",
                                        {
                                            isReplay: this.isReplayActivity(page),
                                            pageName: page, setDoneMorningRoutine: this.setDoneMorningRoutine,
                                            isOptional: true,
                                            improve: obj.improve || [],
                                            onCompleteExercises: this.onCompleteExercises,
                                            makeFadeInAnimation: this.makeFadeInAnimation,
                                            scrollToTopToday: this.scrollToTopToday,
                                            transition: "myCustomSlideUpTransition"
                                        });
                                    isActivityPushed = true;
                                }
                            });
                        } else {
                            this.props.navigation.navigate(page,
                                {
                                    isReplay: this.isReplayActivity(page),
                                    pageName: page, setDoneMorningRoutine: this.setDoneMorningRoutine,
                                    isOptional: true,
                                    improve: obj.improve || [],
                                    onCompleteExercises: this.onCompleteExercises,
                                    makeFadeInAnimation: this.makeFadeInAnimation,
                                    scrollToTopToday: this.scrollToTopToday,
                                    transition: "myCustomSlideUpTransition"
                                });
                            isActivityPushed = true;
                        }
                    }
                }
            }
        } catch (e) {
            isActivityPushed = false;
            isToday = true;
            if (__DEV__) {
                alert("onSelectExercises - " + JSON.stringify(e))
            }
        }
    };

    manageMorningRoutine = () => {
        try {
            if (this.state.morningRoutine.length > 0) {
                let today = new Date().toDateString();
                let completedMorningRoutine = [];
                if (this.props.completedMorningRoutine.completedDate === today) {
                    completedMorningRoutine = this.props.completedMorningRoutine.routineActivities;
                } else {
                    if (this.props.completedMorningRoutine.routineActivities.length > 0) {
                        this.props.onCompletedMorningRoutine();
                    }
                }
                this.props.removeSafeArea();
                let morningRoutine = this.props.morningRoutine;
                let isLast = (morningRoutine.length === completedMorningRoutine.length + 1);
                let length = this.state.morningRoutine.length;
                if (morningRoutine.length === completedMorningRoutine.length) {
                    let obj = find(this.state.morningRoutine, {pageName: this.state.morningRoutine[0].pageName});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    this.props.navigation.navigate(this.state.morningRoutine[0].pageName,
                        {
                            pageName: this.state.morningRoutine[0].pageName,
                            isReplay: this.isReplayActivity(this.state.morningRoutine[0].pageName),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            isOptional: false,
                            isLast: isLast,
                            improve: this.state.morningRoutine[0].improve,
                            introTitle: objIndex + " of " + length,
                            onCompleteExercises: this.onCompleteExercises,
                            makeFadeInAnimation: this.makeFadeInAnimation,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition"
                        });
                    isActivityPushed = true;
                } else {
                    let obj = find(this.state.morningRoutine, {pageName: morningRoutine[completedMorningRoutine.length].pageName});
                    let objIndex = this.state.morningRoutine.indexOf(obj) + 1;
                    this.props.navigation.navigate(morningRoutine[completedMorningRoutine.length].pageName,
                        {
                            pageName: morningRoutine[completedMorningRoutine.length].pageName,
                            isReplay: this.isReplayActivity(morningRoutine[completedMorningRoutine.length].pageName),
                            setDoneMorningRoutine: this.setDoneMorningRoutine,
                            isLast: isLast,
                            isOptional: false,
                            introTitle: objIndex + " of " + length,
                            improve: morningRoutine[completedMorningRoutine.length].improve,
                            onCompleteExercises: this.onCompleteExercises,
                            makeFadeInAnimation: this.makeFadeInAnimation,
                            scrollToTopToday: this.scrollToTopToday,
                            transition: "myCustomSlideUpTransition"
                        });
                    isActivityPushed = true;
                }
            }
        } catch (err) {
            if (__DEV__) {
                alert(err)
            }
        }
    };

    onBackToTabView = () =>{

    }

    //Missed checkup do from why streak reset
    performYesterdayCheckup = () => {
        this.props.navigation.navigate("checkUp", {isYesterday: true, isFromToday: false,
            onBackToTabView: this.onBackToTabView,
            scrollToTopToday: this.scrollToTopToday,
            transition: "myCustomSlideUpTransition"});
    }

    setDoneMorningRoutine = (pageName) => {
        this.props.setCompletedMorningRoutine(pageName);
    };

    onCompleteExercises = (pageName) => {
        this.props.setCompletedExercises(pageName);
    };

    //Set Last checkup date
    setLastCheckupDate = () => {
        let todayDate = moment().format("YYYY-MM-DD");
        let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
        if (this.props.last_checkup_at === null || this.props.last_checkup_at === "") {
            if (find(this.props.p_array, {occurred_at: todayDate}) !== undefined) {
                this.props.updateMetaData({
                    last_checkup_at: todayDate
                });
            } else {
                this.props.updateMetaData({
                    last_checkup_at: moment().subtract(1, 'days').format('YYYY-MM-DD')
                });
            }
        }
    };

    //SetTimeZone
    setTimezone = () => {
        NativeCallback.getTimeZone((err, timeZone) => {
            if (timeZone && timeZone != "NULL" && this.props.timezone == null || this.props.timezone != timeZone) {
                this.props.updateMetaData({
                    timezone: timeZone
                });
            }
        })
    }

    onReadLetterPress = (page) => {
        let obj = find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
        let title = (this.props.currentGoal.previousAchieved === 1)
            ? "24 hours clean" : (this.props.currentGoal.previousAchieved === 365) ? "1 year clean"
                : this.props.currentGoal.previousAchieved + " days clean";
        if (obj !== undefined) {
            if (obj.content !== null) {
                // let title = this.props.currentGoal.previousMessage;
                // title.replace("clean", "success");
                this.props.removeSafeArea();
                this.props.navigation.navigate(page,{
                    letterContent: obj.content,
                    title: title,
                    isFromPopup: false,
                    previousAchieved: this.props.currentGoal.previousAchieved,
                    makeFadeInAnimation: this.makeFadeInAnimation,
                    scrollToTopToday: this.scrollToTopToday,
                    transition: "myCustomSlideUpTransition"
                });
                isActivityPushed = true;
            }
        }
    };

    isReplayActivity = (pageName) => {
        let today = new Date().toDateString();
        let objIndex = this.props.completedExercises.exercises.indexOf(pageName);
        return (objIndex >= 0 && this.props.completedExercises.date === today);
    };

    renderTodayList = () => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];

        let isRenderLatter = this.isReadLetter();
        let today = new Date().toDateString();
        if (!this.state.isAllMorningRoutineDone || isRenderLatter ||
            (this.state.isAudioActivity && !this.isReplayActivity(allOptionalExercies.audioActivity.pageName))) {
            return (
                <View>
                    <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                        {this.state.todayTitle}
                    </Text>
                    {
                        this.renderReadLetterCard()
                    }
                    {
                        (!this.state.isAllMorningRoutineDone) &&
                        this.renderMorningRoutine() || null
                    }
                    {
                        (this.state.isAudioActivity && !this.isReplayActivity(allOptionalExercies.audioActivity.pageName)) &&
                        <Routine title={allOptionalExercies.audioActivity.title}
                                 appTheme={this.props.appTheme}
                                 desc={allOptionalExercies.audioActivity.desc}
                                 Icon={allOptionalExercies.audioActivity.Icon}
                                 completedExercises={this.props.completedExercises}
                                 TodayItemList={null}
                                 isIcon={true}
                                 onSelectExercises={this.onSelectExercises}
                                 pageName={allOptionalExercies.audioActivity.pageName}/>
                        || null
                    }
                    {this.renderTopLifeTreeCard()}
                </View>)
        } else {
            return (
                <View>
                    {this.renderTopLifeTreeCard(false, false, true)}
                </View>
            )
        }
        return null
    };

    renderMorningRoutine = () => {
        return (
            <View>
                <Routine title="Morning routine"
                         appTheme={this.props.appTheme}
                         desc={this.state.totalMorningRoutineTimes}
                         Icon={iconImage.morningIcon}
                         TodayItemList={this.state.morningRoutine}
                         pageName="morningRoutine"
                         completedExercises={this.props.completedExercises}
                         onSelectExercises={this.onSelectExercises}/>
            </View>
        );
    };

    scrollToTopToday = () => {
        try {
            if (this.refs.todaysScroll) {
                this.refs.todaysScroll.scrollTo({x: 0, y: 0, animated: false})
            }
        } catch (err) {
            if (__DEV__) {
                alert(err)
            }
        }
    }

    onBackLifeTree = () => {
        this.setState({});
    }

    renderTopLifeTreeCard = (isCompleted = false, isTitle = false, isTopTitle = false, isFromNow = false) => {
        try{
            let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
            let isViewCompleted = false;
            let dateToday = new Date().toDateString();
            if (this.props.todayLifeTree.isCompleted && this.props.todayLifeTree.completedDate === dateToday) {
                isViewCompleted = true;
            }
            let todayDate = moment().format("YYYY-MM-DD");
            let todayObj = find(this.props.p_array, {occurred_at: todayDate});
            if (find(this.props.todayScreenExercise, {pageName: "lifeTree", isSelected: true}) !== undefined &&
                this.props.last_checkup_at === todayDate && todayObj != undefined && !todayObj.is_relapse) {
                let title = "Your life tree is growing!";
                if (this.props.current_p_clean_days > 53) {
                    title = "Your life tree is healthy!";
                }
                if (isCompleted) {
                    if (this.props.todayLifeTree.isShow && isViewCompleted) {
                        return (
                            <View>
                                {
                                    (isTitle) &&
                                    this.renderViewBtnCompleted()
                                    || null
                                }
                                {
                                    (this.state.viewCompleted) &&
                                    <LifeTree message={title}
                                              onPress={() => this.onLifeTreeSelect()}
                                              appTheme={this.props.appTheme}/>
                                    || null
                                }
                            </View>
                        )
                    }
                } else {
                    if (this.props.todayLifeTree.isShow && !isViewCompleted) {
                        if (isFromNow) {
                            return (
                                <View>
                                    {(isTopTitle) &&
                                    <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                        {"NOW"}
                                    </Text>
                                    || null}
                                    <LifeTree message={title}
                                              onPress={() => this.onLifeTreeSelect()}
                                              appTheme={this.props.appTheme}/>
                                </View>
                            )
                        }
                    }
                }
            }
        }catch (e){console.log(e); return null;}
        return null;
    };

    onJournalActivityPress = () => {
        try {
            this.props.removeSafeArea();
            let list = this.props.journal_date_wise_list;
            let month = moment().format("MMMM");
            let year = moment().format("YYYY");
            let key = month + "-" + year;
            let currentList = list[key];
            let todayDate = moment().format("YYYY-MM-DD");
            let rowData = currentList[todayDate] || null;
            if (rowData) {
                isActivityPushed = true;
                this.props.navigation.navigate('journalActivity', {
                    rowData: rowData,
                    onCompleteExercises: this.onCompleteExercises,
                    isReplay: this.isReplayActivity('journalActivity'),
                    isOptional: true,
                    makeFadeInAnimation: this.makeFadeInAnimation,
                    scrollToTopToday: this.scrollToTopToday,
                    onBackJournal: this.onBackLifeTree,
                    transition: "myCustomSlideUpTransition"
                });
            }
        } catch (e) {
            console.log(e)
        }
    };

    onViewShowHideclicked = () => {
        this.setState({
            viewCompleted: !this.state.viewCompleted
        });
    };

    renderViewBtnCompleted = () => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{marginTop: 25, marginBottom: 5}}>
                <TouchableOpacity delayPressIn={15}
                                  onPress={() => this.onViewShowHideclicked()}
                                  style={[styles.btnViewCompleted, {backgroundColor: appColor.viewCompletedBtn}]}>
                    <View>
                        <Text style={[styles.txtViewCompleted, {color: appColor.viewCompletedText}]}>
                            {this.state.viewCompleted && "Hide completed" || "View completed"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    //Read your letter and write letter
    renderReadLetterCard = (isCompleted = false) => {
        if (this.isLetterDataAvailable()) {
            if (isCompleted && this.isReadLetterCompleted() || this.isReadLetter()) {
                let subTitle = (this.props.currentGoal.previousAchieved === 1)
                    ? "24 hours clean" : this.props.currentGoal.previousAchieved + " days clean";
                return (
                    <Routine title={"Read Your Letter"}
                             appTheme={this.props.appTheme}
                             desc={"Goal achieved - " + subTitle}
                             Icon={iconImage.letterIcon}
                             TodayItemList={null}
                             isIcon={false}
                             improve={[]}
                             completedExercises={this.props.completedExercises}
                             onSelectExercises={this.onReadLetterPress}
                             pageName={"readLetter"}/>
                )
            }
        }
        return null;
    };

    //Read Data available or not
    isLetterDataAvailable = () => {
        let obj = find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
        if (obj !== undefined) {
            if (obj.content) {
                return true;
            }
        }
        return false;
    }

    isReadLetter = () => {
        if (this.isWriteLetterForPreviosGoal() && this.isLetterDataAvailable()) {
            return !this.isReadLetterCompleted();
        }
        return false;
    }

    isReadLetterCompleted = () => {
        if (this.isWriteLetterForPreviosGoal() && this.isLetterDataAvailable()) {
            //Render read  completed
            let readDate = this.props.readLatterDate.date;
            if (readDate != "") {
                let today = moment();
                let letterReadDate = moment(readDate);
                let goalDays = this.props.currentGoal.goalDays;
                if (goalDays != 0 && this.props.readLatterDate.previousAchieved === this.props.currentGoal.previousAchieved) {
                    let diff = today.diff(letterReadDate, 'days');
                    switch (goalDays) {
                        case 1:
                            if (diff == 0)
                                return true;
                            break
                        case 3:
                            if (diff <= 2)
                                return true;
                            break;
                        case 7:
                            if (diff <= 4)
                                return true;
                            break;
                        case 14:
                            if (diff <= 7)
                                return true;
                            break;
                        case 30:
                            if (diff <= 16)
                                return true;
                            break;
                        case 90:
                            if (diff <= 60)
                                return true;
                            break;
                        case 180:
                            if (diff <= 90)
                                return true;
                            break;
                        case 365:
                            if (diff <= 185)
                                return true;
                            break;
                    }
                    return false;
                }
            }
        }
    }

    //Is Write letter for previous streak
    isWriteLetterForPreviosGoal = () => {
        //Today and for current goal
        if (this.props.currentGoal.previousAchieved != 0) {
            let obj = find(this.props.letters, {day: this.props.currentGoal.previousAchieved});
            if (obj && obj.updateDate) {
                let updatedDate = obj.updateDate || null;
                let today = moment();
                let letterInsertedDate = moment(updatedDate);
                let goalDays = this.props.currentGoal.goalDays;
                if (goalDays != 0) {
                    let diff = today.diff(letterInsertedDate, 'days');
                    switch (this.props.currentGoal.goalDays) {
                        case 1:
                            if (diff <= 1)
                                return true;
                            break
                        case 3:
                            if (diff <= 2)
                                return true;
                            break;
                        case 7:
                            if (diff <= 4)
                                return true;
                            break;
                        case 14:
                            if (diff <= 7)
                                return true;
                            break;
                        case 30:
                            if (diff <= 16)
                                return true;
                            break;
                        case 90:
                            if (diff <= 60)
                                return true;
                            break;
                        case 180:
                            if (diff <= 90)
                                return true;
                            break;
                        case 365:
                            if (diff <= 185)
                                return true;
                            break;
                    }
                    return false;
                    // }
                }
            }
        }
        return false;
    }

    //For Write letter
    isWriteLetterCard = () => {
        let obj = find(this.props.letters, {day: this.props.currentGoal.goalDays});
        if(obj && obj.updateDate) {
            let insertedDate = obj.updateDate;
            let today = moment();
            let letterInsertedDate = moment(insertedDate);
            let diff = today.diff(letterInsertedDate,'days');
            switch (this.props.currentGoal.goalDays) {
                case 1:
                    if(diff !== 0)
                        return true;
                    break;
                case 3:
                    if(diff > 2)
                        return true;
                    break;
                case 7:
                    if(diff > 4)
                        return true;
                    break;
                case 14:
                    if(diff > 7)
                        return true;
                    break;
                case 30:
                    if(diff > 16)
                        return true;
                    break;
                case 90:
                    if(diff > 60)
                        return true;
                    break;
                case 180:
                    if(diff > 90)
                        return true;
                    break;
                case 365:
                    if(diff > 185)
                        return true;
                    break;
            }
            return false;
        }
        return true;
    }

    isDisplayWriteLetter = () => {
        if(this.isReadLetter()){
            if(this.isReadLetterCompleted()){
                return this.isWriteLetterCard();
            }else{
                return false;
            }
        }
        return this.isWriteLetterCard();
    }

    render() {
        let renderCompletedActivity = [];
        let renderOptionalActivity = [];
        let today = new Date().toDateString();
        let isReadCard = this.isReadLetterCompleted();
        this.state.optionalExercies.forEach(obj => {
            if (obj.pageName === "lettersToYourSelf") {
                if (this.isDisplayWriteLetter()) {
                    renderOptionalActivity.push(obj);
                }
            } else if (obj.pageName === "kegalsActivity" && (this.state.gender === 'female' || this.state.gender === 'transgender_female')) {
            } else {
                if (this.isReplayActivity(obj.pageName)) {
                    renderCompletedActivity.push(obj);
                } else {
                    renderOptionalActivity.push(obj);
                }
            }
        });
        if (this.state.isAudioActivity && this.isReplayActivity(allOptionalExercies.audioActivity.pageName)) {
            renderCompletedActivity.push(allOptionalExercies.audioActivity)
        }
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{flex: 1, backgroundColor: appColor.appBackground, overflow: 'hidden'}]}>
                <StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>
                <Animatable.View style={{flex: 1}} ref="mainView">
                    <LinearGradient colors={[appColor.appBackground, appColor.appLighBackground]}
                                    locations={[0.5, 0.5]}
                                    style={styles.linearGradient}>
                        <ScrollView automaticallyAdjustContentInsets={false}
                                    contentContainerStyle={{top: this.props.safeAreaInsetsDefault.top}}
                                    ref="todaysScroll">
                            <TotalProgress profileName={this.props.userName}
                                           profileGender={this.state.gender}
                                           avatar_id={this.props.avatar_id}
                                           percentage={this.props.totalRewiringPercentage}
                                           circularPercentage={this.props.circularRewiringPercentage}/>

                            <View style={{padding: 20, backgroundColor: appColor.appBackground}}>
                                <CleanDaysView total_p_clean_days={this.props.total_p_clean_days}/>
                            </View>

                            <TodaysTitle performYesterdayCheckup={this.performYesterdayCheckup}/>

                            <View style={{backgroundColor: appColor.appLighBackground, paddingBottom: 70}}>
                                {
                                    (this.state.isShowMonthlyChallenge) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            CHALLENGE</Text>
                                        <Routine title={this.state.monthlyChallenge.title}
                                                 appTheme={this.props.appTheme}
                                                 desc={this.state.monthlyChallenge.desc}
                                                 Icon={this.state.monthlyChallenge.Icon}
                                                 completedExercises={this.props.completedExercises}
                                                 TodayItemList={null}
                                                 isIcon={false}
                                                 onSelectExercises={this.onSelectMonthlyChallenge}
                                                 pageName={"monthlyChallenge"}/>
                                    </View>
                                }

                                {
                                    (this.state.checkUpFlag !== 2) &&
                                    this.renderTopLifeTreeCard(false, false, true, true)
                                    || null
                                }

                                {
                                    (this.state.checkUpFlag === 2) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            NOW</Text>
                                        {this.renderTopLifeTreeCard(false, false, false, true)}
                                        <CheckupTime message={this.state.checkupTimeMessage}
                                                     onPress={()=>this.onCheckupCardClicked()}
                                                     appTheme={this.props.appTheme}/>
                                    </View>
                                    || null
                                }

                                {
                                    (this.state.checkUpFlag === 1 && this.state.checkupTimeMessage.includes("redo")) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            TONIGHT</Text>
                                        <CheckupTime message={this.state.checkupTimeMessage}
                                                     onPress={()=>this.onCheckupCardClicked()}
                                                     appTheme={this.props.appTheme}/>
                                    </View>
                                    || null
                                }
                                {this.renderTodayList()}
                                {
                                    (this.state.checkUpFlag === 1 && !this.state.checkupTimeMessage.includes("redo")) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            TONIGHT</Text>
                                        <CheckupTime message={this.state.checkupTimeMessage}
                                                     onPress={()=>this.onCheckupCardClicked()}
                                                     appTheme={this.props.appTheme}/>
                                    </View>
                                    || null
                                }

                                {
                                    (renderOptionalActivity.length > 0) &&
                                    <View>
                                        <Text style={[styles.titleStyle, {color: appColor.headerTitle}]}>
                                            OPTIONAL</Text>
                                        {
                                            renderOptionalActivity.map((obj, index) => {
                                                return (
                                                    <Routine title={obj.title}
                                                             appTheme={this.props.appTheme}
                                                             desc={(obj.pageName === "lettersToYourSelf")
                                                                 ? (this.props.currentGoal.goalDays === 1) ? "24 hours clean"
                                                                     : this.props.currentGoal.goalDays + " days clean" : obj.desc}
                                                             Icon={obj.Icon}
                                                             completedExercises={this.props.completedExercises}
                                                             TodayItemList={null}
                                                             isIcon={(obj.isIcon !== undefined) ? obj.isIcon : true}
                                                             onSelectExercises={this.onSelectExercises}
                                                             pageName={(obj.pageName !== undefined) ? obj.pageName : "healthyActivity"}
                                                             key={index}/>
                                                )
                                            })
                                        }
                                    </View>
                                    || null
                                }
                                {
                                    ((renderCompletedActivity.length !== 0 || this.state.isAllMorningRoutineDone || isReadCard)
                                        && this.state.morningRoutine.length !== 0) &&
                                    <View>
                                        {this.renderViewBtnCompleted()}
                                        {(this.state.viewCompleted) &&
                                        <View>
                                            {
                                                (this.state.isAllMorningRoutineDone && this.state.morningRoutine.length !== 0) &&
                                                this.renderMorningRoutine() || null
                                            }
                                            {
                                                (isReadCard) &&
                                                this.renderReadLetterCard(true) || null
                                            }
                                            {
                                                renderCompletedActivity.map((obj, index) => {
                                                    return (
                                                        <Routine title={obj.title}
                                                                 appTheme={this.props.appTheme}
                                                                 desc={(obj.pageName === "lettersToYourSelf") ? (this.props.currentGoal.goalDays === 1) ? "24 hours clean"
                                                                     : this.props.currentGoal.goalDays + " days clean" : obj.desc}
                                                                 Icon={obj.Icon}
                                                                 completedExercises={this.props.completedExercises}
                                                                 TodayItemList={null}
                                                                 isIcon={(obj.isIcon !== undefined) ? obj.isIcon : true}
                                                                 onSelectExercises={this.onSelectExercises}
                                                                 pageName={(obj.pageName !== undefined) ? obj.pageName : "healthyActivity"}
                                                                 key={index}/>
                                                    )
                                                })
                                            }
                                            {this.renderTopLifeTreeCard(true, false)}
                                        </View>
                                        || null}

                                    </View>
                                    ||
                                    this.renderTopLifeTreeCard(true, true)
                                }
                            </View>
                        </ScrollView>
                    </LinearGradient>
                </Animatable.View>
            </View>
        );
    }

    //Manage subscription
    checkForSubscription = () => {
        if (this.props.isConnected) {
            if (!this.props.subscriptionInProcess) {
                this.props.setSubscriptionInProcess(true);
                loadAllProducts().then(res => {
                    restoreAllData()
                        .then(res => {
                            checkForValidation()
                                .then(res => {
                                    //alert("valid");
                                    //Valid subscription
                                    this.props.setSubscriptionInProcess(false);
                                }).catch(err => {
                                console.log(err);
                                this.props.setSubscriptionInProcess(false);
                                if(err === "Expired") {
                                    //alert("expired");
                                    this.props.manageCheckupPopup({
                                        isShow: false,
                                        checkUpDetail: {}
                                    });
                                    this.props.manageRewiringPopup({
                                        isShow: false,
                                        rewiringDetail: {}
                                    });
                                    Alert.alert("Subscription expired",
                                        "Please renew your subscription to continue using Brainbuddy",
                                        [
                                            {
                                                text: 'Continue', onPress: () => {
                                                    this.props.removeSafeArea();
                                                    this.hideAlltodaysPopup();
                                                    this.props.navigation.navigate("getStarted", {nextPage: "rootTabNavigation",isRestore: true});
                                                }
                                            },
                                        ],
                                    );
                                }else if(err === "latest_receipt_info_not_found") {
                                    this.props.manageCheckupPopup({
                                        isShow: false,
                                        checkUpDetail: {}
                                    });
                                    this.props.manageRewiringPopup({
                                        isShow: false,
                                        rewiringDetail: {}
                                    });
                                    Alert.alert("Unable to verify subscription",
                                        "Please verify your subscription to continue using Brainbuddy",
                                        [
                                            {
                                                text: 'Continue', onPress: () => {
                                                    this.props.removeSafeArea();
                                                    this.hideAlltodaysPopup();
                                                    this.props.navigation.navigate("getStarted", {nextPage: "rootTabNavigation", isRestore: true});
                                                }
                                            },
                                        ],
                                    );
                                }else{
                                    this.props.setSubscriptionInProcess(false);
                                    // Alert.alert("Failed to get receipt details, please try again.")
                                }
                            })
                        })
                        .catch(err => {
                            this.props.setSubscriptionInProcess(false);
                            try {
                                if (err === "receipt_not_found") {
                                    this.props.manageCheckupPopup({
                                        isShow: false,
                                        checkUpDetail: {}
                                    });
                                    this.props.manageRewiringPopup({
                                        isShow: false,
                                        rewiringDetail: {}
                                    });
                                    Alert.alert("Subscription required",
                                        "Please subscribe to continue using Brainbuddy",
                                        [
                                            {
                                                text: 'Continue', onPress: () => {
                                                    this.props.removeSafeArea();
                                                    this.hideAlltodaysPopup();
                                                    this.props.navigation.navigate("getStarted", {nextPage: "rootTabNavigation"});
                                                }
                                            },
                                        ],
                                    );
                                } else {
                                    this.checkForSubscription();
                                }
                            } catch (e) {
                            }
                        })
                }).catch(err => {
                    this.props.setSubscriptionInProcess(false);
                })
            }
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 0
    },
    titleStyle: {
        marginTop: 25,
        marginBottom: 3,
        color: '#a4b6bf',
        fontSize: 12,
        alignSelf: 'center',
        fontFamily: Constant.font700,
    },
    linearGradient: {
        flex: 1,
    },
    btnViewCompleted: {
        alignSelf: 'center',
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingRight: 20,
        paddingLeft: 20
    },
    txtViewCompleted: {
        fontSize: 12,
        fontFamily: Constant.font500,
        color: '#dee1e3'
    }
});

const mapStateToProps = state => {
    return {
        p_array: state.statistic.pornDetail.p_array,
        total_p_clean_days: state.statistic.pornDetail.total_p_clean_days,
        current_p_clean_days: state.statistic.pornDetail.current_p_clean_days,
        best_p_clean_days: state.statistic.pornDetail.best_p_clean_days,
        totalRewiringPercentage: state.statistic.totalRewiringPercentage,
        circularRewiringPercentage: state.statistic.circularRewiringPercentage,
        userName: state.user.userDetails.name,
        gender: state.user.userDetails.gender,
        avatar_id: state.user.userDetails.avatar_id,
        userId: state.user.userDetails && state.user.userDetails.id || 0,
        dateForAPICall: state.user.dateForAPICall,
        completedExercises: state.user.completedExercises,
        checkupTime: state.metaData.metaData.checkup_time || 18,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        registered_at: state.metaData.metaData.registered_at || "",
        morningRoutine: state.metaData.morningRoutine,
        completedMorningRoutine: state.metaData.completedMorningRoutine,
        currentGoal: state.statistic.currentGoal,
        letterInsertedDate: state.letters.letterInsertedDate,
        letters: state.letters.letters,
        visibleTab: state.user.visibleTab,
        readLatterDate: state.user.readLatterDate,
        todayViewInstance: state.user.todayViewInstance,
        isOpenFirstTime: state.user.isOpenFirstTime,
        isAskForCheckup: state.user.isAskForCheckup,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        subscriptionInProcess: state.user.subscriptionInProcess,
        isConnected: state.user.isConnected,
        meditationTime: state.metaData.meditationTime || 10,
        popupQueue: state.user.popupQueue,
        showRewindProgressPopUp: state.user.showRewindProgressPopUp,
        showStreakGoalPopUp: state.user.showStreakGoalPopUp,
        todayScreenExercise: state.metaData.todayScreenExercise || [],
        todayLifeTree: state.user.todayLifeTree || [],
        journal_date_wise_list: state.statistic.journal_date_wise_list,
        exercise_number_learn: state.metaData.metaData.exercise_number_learn || 1,
        exercise_number_profile: state.metaData.metaData.exercise_number_profile || 1,
        appBadgeCount: state.user.appBadgeCount,
        appTheme: state.user.appTheme,
        timezone: state.metaData.metaData.timezone || null,
        clean_p_days_per_month: state.statistic.pornDetail.clean_p_days_per_month,
        monthlyChallengeAchived: state.user.monthlyChallengeAchived,
        userCommunity: state.user.userCommunity || null,
    };
};

export default connect(mapStateToProps, {
    loadDataOnAppOpen,
    setRewiringPlayer,
    setMorningRoutine,
    setCompletedMorningRoutine,
    updateMetaData,
    setCompletedExercises,
    manageCheckupPopup,
    onCompletedMorningRoutine,
    setDoneAPICallForToday,
    setUpLocalNotificationAlerts,
    manageTodayInstances,
    goalCalculation,
    setDateforTodayOpen,
    setAskedForCheckupPopup,
    removeSafeArea,
    setSubscriptionInProcess,
    manageRewiringPopup,
    manageRewiredProgressPopup,
    manageAchievedPopup,
    activeAppManagedTab,
    managedLetterAPI,
    manageStreakAchievedPopup,
    managePopupQueue,
    setIsNetworkAvailable,
    resetStoreData,
    tabChanged,
    getCurrentClean,
    sendTagOneSignal,
    manageMonthlyChallengePopup,
    manageMonthlyChallengeAchieved,
    getEventsDetails, getMemberDetail
})(TodayPage);