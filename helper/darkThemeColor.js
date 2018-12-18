import Constant from "./constant";
import {Platform} from "react-native";

const achievementiconY = {
    "1": {uri: 'achievement_icon_success_1'},
    "3": {uri: 'achievement_icon_success_3'},
    "7": {uri: 'achievement_icon_success_7'},
    "14": {uri: 'achievement_icon_success_14'},
    "30": {uri: 'achievement_icon_success_30'},
    "90": {uri: 'achievement_icon_success_90'},
    "180": {uri: 'achievement_icon_success_180'},
    "365": {uri: 'achievement_icon_success_365'},
};
const achievementiconL = {
    "1": {uri: 'achievement_icon_success_1'},
    "3": {uri: 'achievement_icon_success_3'},
    "7": {uri: 'achievement_icon_success_7'},
    "14": {uri: 'achievement_icon_success_14'},
    "30": {uri: 'achievement_icon_success_30'},
    "90": {uri: 'achievement_icon_success_90'},
    "180": {uri: 'achievement_icon_success_180'},
    "365": {uri: 'achievement_icon_success_365'},
};
const achievementiconB = {
    "1": {uri: 'achievement_icon_empty_1'},
    "3": {uri: 'achievement_icon_empty_3'},
    "7": {uri: 'achievement_icon_empty_7'},
    "14": {uri: 'achievement_icon_empty_14'},
    "30": {uri: 'achievement_icon_empty_30'},
    "90": {uri: 'achievement_icon_empty_90'},
    "180": {uri: 'achievement_icon_empty_180'},
    "365": {uri: 'achievement_icon_empty_365'},
};

const improvementiconY = {
    alive: {uri: 'improvement_alive_success'},
    attraction: {uri: 'improvement_attraction_success'},
    confidence: {uri: 'improvement_confidence_success'},
    energy: {uri: 'improvement_energy_success'},
    health: {uri: 'improvement_health_success'},
    mind: {uri: 'improvement_zen_success'},
    sleep: {uri: 'improvement_sleep_success'},
    voice: {uri: 'improvement_voice_success'},
};
const improvementiconB = {
    alive: {uri: 'improvement_alive_empty'},
    attraction: {uri: 'improvement_attraction_empty'},
    confidence: {uri: 'improvement_confidence_empty'},
    energy: {uri: 'improvement_energy_empty'},
    health: {uri: 'improvement_health_empty'},
    mind: {uri: 'improvement_zen_empty'},
    sleep: {uri: 'improvement_sleep_empty'},
    voice: {uri: 'improvement_voice_empty'},
};

const teamAchievementicomY = {
    "10": {uri: 'achievement_team_success_10'},
    "30": {uri: 'achievement_team_success_30'},
    "50": {uri: 'achievement_team_success_50'},
    "100": {uri: 'achievement_team_success_100'},
    "180": {uri: 'achievement_team_success_180'},
    "365": {uri: 'achievement_team_success_365'},
    "500": {uri: 'achievement_team_success_500'},
    "1000": {uri: 'achievement_team_success_1000'},
};
const teamAchievementicomB = {
    "10": {uri: 'achievement_team_empty_10'},
    "30": {uri: 'achievement_team_empty_30'},
    "50": {uri: 'achievement_team_empty_50'},
    "100": {uri: 'achievement_team_empty_100'},
    "180": {uri: 'achievement_team_empty_180'},
    "365": {uri: 'achievement_team_empty_365'},
    "500": {uri: 'achievement_team_empty_500'},
    "1000": {uri: 'achievement_team_empty_1000'},
};

const specialAchievementIcon = {
    "0": {uri: 'special_achievement_jan'},
    "1": {uri: 'special_achievement_feb'},
    "2": {uri: 'special_achievement_mar'},
    "3": {uri: 'special_achievement_apr'},
    "4": {uri: 'special_achievement_may'},
    "5": {uri: 'special_achievement_jun'},
    "6": {uri: 'special_achievement_jul'},
    "7": {uri: 'special_achievement_aug'},
    "8": {uri: 'special_achievement_sep'},
    "9": {uri: 'special_achievement_oct'},
    "10": {uri: 'special_achievement_nov'},
    "11": {uri: 'special_achievement_dec'},
};
const specialAchievementEmptyIcon = {
    "0": {uri: 'special_achievement_jan_empty'},
    "1": {uri: 'special_achievement_feb_empty'},
    "2": {uri: 'special_achievement_mar_empty'},
    "3": {uri: 'special_achievement_apr_empty'},
    "4": {uri: 'special_achievement_may_empty'},
    "5": {uri: 'special_achievement_jun_empty'},
    "6": {uri: 'special_achievement_jul_empty'},
    "7": {uri: 'special_achievement_aug_empty'},
    "8": {uri: 'special_achievement_sep_empty'},
    "9": {uri: 'special_achievement_oct_empty'},
    "10": {uri: 'special_achievement_nov_empty'},
    "11": {uri: 'special_achievement_dec_empty'},
};

const commnityClock = {uri:'community_time_icon'}

module.exports = {
    appBackground: "#003e53",
    appLighBackground: "#01536d",
    statusBarStyle: "light-content",

    circularBarOtherColor: "#00536e",

    //Font colors
    defaultFont : '#fff',
    subTitile :'rgb(184,198,205)',
    cardSubTitle: '#aec8d1',
    headerTitle: '#a4b6bf',
    topTodayRemainig: "#b8bfcf",

    cardBack: "#5d879b",
    cardSubSection: "#386980",
    pogressBarOtherColor: "#00536e",
    replayMorningRoutine: {uri:'icon_replay_exercise'},

    viewCompletedBtn: '#003e53',
    viewCompletedText: '#dee1e3',

    scrollableBack: '#003e53',
    customInactiveFont: 'rgba(255,255,255,0.6)',
    scrollableActiveFont: '#fff',
    scrollableInactiveFont: 'rgb(42,111,134)',
    scrollableViewBack: '#01536d',
    scrollableBorderBottom: '#01536d',
    scrollableBorderBottomHeight: 0,
    progressBarTitle:"rgb(184,198,205)",
    rewiredprogressBarOtherColor: '#026485',

    verProgressBottomTitle: 'rgb(153,186,196)',

    streackCountText: '#0F0',
    senderBubble: '#0b99de',
    selectedSenderBubble: '#247FCB',
    receiverBubble: '#1b657c',
    selectedReceiverBubble: '#1C4A61',
    bottomChatInner: '#003e53',
    bottomChatPlaceholder: "rgba(255,255,255,0.8)",
    bottomChatText: "#FFF",
    chatUsername: '#fff',
    chatDateTime: '#a0b8bc',

    postAdviceRowBottomText: '#76c0bb',
    postAdviceRowBottomIcon: '#709baa',
    comunityPornDayCount: '#76c0bb',
    commentReplyIcon: null,

    editPostBack: '#003e53',
    editPostText: 'rgb(171,187,182)',

    poastButton: '#003e53',
    selectedSortBtn: '#003e53',
    unselectedSortBtn: '#709baa',
    createPostBtn: '#1b657c',

    createPostCancel: '#709baa',

    commentViewBack: '#01536d',
    commentHeader: '#1c475d',
    commentView: '#01536d',

    leaderBoradRank: '#fff',
    leaderBoardClose: null,
    leaderBoardFooter: '#7f93a0',

    moreRow: '#01536d',
    pressInMoreRow: '#003e53',
    moreSeparator: '#0a4c62',

    settingEmail: "rgb(184,198,205)",
    settingBtn: "#01536d",
    settingBtnText: "#fff",
    verProgressbarBack: '#1a7181',
    verProgressbarOrangeBack: '#b48578',

    yesDate:[{startingDay: true, color: 'rgb(139,232,145)',textAlign:'center',textColor:'white'},
        {endingDay: true,textAlign:'center', color: 'rgb(139,232,145)',textColor:'white'}],

    noDate: [{startingDay: true, color: 'rgb(242,104,71)',textAlign:'center',textColor:'white'},
        {endingDay: true,textAlign:'center', color: 'rgb(242,104,71)',textColor:'white'}],

    //Leaderboard current user
    leaderboardRowBackColor: '#5d879b',

    //Tabbar
    tabbarBack: '#01536d',
    tabbarTopBorder: '#026485',

    tabIcon: {
        Today: 'tab_nav_icon_1',
        Statistic: 'tab_nav_icon_2',
        Team: 'tab_nav_icon_3',
        Milestone: 'tab_nav_icon_4',
        More: 'tab_nav_icon_5',
    },
    selectedTabIcon: {
        Today: 'tab_nav_icon_1_selected',
        Statistic: 'tab_nav_icon_2_selected',
        Team: 'tab_nav_icon_3_selected',
        Milestone: 'tab_nav_icon_4_selected',
        More: 'tab_nav_icon_5_selected',
    },

    achievementImages: {
        Y: achievementiconY,
        L: achievementiconL,
        B: achievementiconB
    },

    improvementIcon: {
        "Y" : improvementiconY,
        "B" : improvementiconB
    },

    teamAchievementImages: {
        Y: teamAchievementicomY,
        B: teamAchievementicomB
    },

    specialAchievementIcon: {
        Y: specialAchievementIcon,
        B: specialAchievementEmptyIcon
    },
    iconYearText: {
        Y: '#fff',
        B: "#8caebe"
    },
    popUp:{
        B:{
            backColor: 'rgb(237,194,115)',
            progressColor: 'rgba(255,255,255, 0.3)',
            textColor: '#f7e4c5'
        },
        Y:{
            backColor: 'rgb(90,194,189)',
            progressColor: '#9dd1cf',
            textColor: '#dfecec',
        },
    },

    appRefreshControl: '#FFF',

    statisticCalendar: {
        calendarBackground: "transparent",
        textSectionTitleColor: '#7ca6b4',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#03c3f9',
        dayTextColor: '#fff',
        textDisabledColor: '#466e83',
        monthTextColor: '#fff',
        yearTextColor: '#a9b6be',
        textMonthFontSize: 24,
        textMonthFontFamily: Constant.font300,
        default: 'transparent',
        textDayHeaderFontFamily: Constant.font300,
        editButton:{
            fontSize:14,
            color:'#7a99a7',
            fontFamily: Constant.font500
        }
    },
    arrowColor: '#709baa',

    //Popup
    todayPopupBackgroundColor: '#173d51',
    todayPopupBackOpacity: 0.8,
    aboutYouPopupBack: 'rgba(0,0,0,0.55)',

    //Navigation bar
    navDefaultColor: '#003e53',
    navBorderColor: '#003e53',
    navTextColor: '#FFF',
    navBackArrow: 'rgba(255,255,255,0.8)',
    navSettingFillingTempted: 'rgb(231,72,24)',
    navSettingFillingTemptedBorder: 'rgb(231,72,24)',
    navSettingAudioActivity: 'rgb(49,165,159)',
    navSettingAudioActivityBorder: 'rgb(49,165,159)',

    navDoneBtn: '#a7b0b6',

    activityIndicator: '#fff',

    teamDetailsRow: '#396881',
    profileColor: '#a3b6bf',
    rowSeperator: '#036383',
    textInputBackColor: '#01536d',
    textColor: '#fff',
    streakHelpBtn:'#0f3244',
    streakHelpText:'#a6adb2',

    communityClock: commnityClock

}