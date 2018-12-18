import Constant from "./constant";

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
    "1": {uri: 'light/achievement_icon_empty_1_white'},
    "3": {uri: 'light/achievement_icon_empty_3_white'},
    "7": {uri: 'light/achievement_icon_empty_7_white'},
    "14": {uri: 'light/achievement_icon_empty_14_white'},
    "30": {uri: 'light/achievement_icon_empty_30_white'},
    "90": {uri: 'light/achievement_icon_empty_90_white'},
    "180": {uri: 'light/achievement_icon_empty_180_white'},
    "365": {uri: 'light/achievement_icon_empty_365_white'},
};

const improvementIcon = {
    alive: {uri: 'improvement_alive_empty_white'},
    attraction: {uri: 'improvement_attraction_empty_white'},
    confidence: {uri: 'improvement_confidence_empty_white'},
    energy: {uri: 'improvement_energy_empty_white'},
    health: {uri: 'improvement_health_empty_white'},
    mind: {uri: 'improvement_zen_empty_white'},
    sleep: {uri: 'improvement_sleep_empty_white'},
    voice: {uri: 'improvement_voice_empty_white'},
};

const temaAchievementIcon = {
    "10": {uri: 'achievement_team_empty_10_white'},
    "30": {uri: 'achievement_team_empty_30_white'},
    "50": {uri: 'achievement_team_empty_50_white'},
    "100": {uri: 'achievement_team_empty_100_white'},
    "180": {uri: 'achievement_team_empty_180_white'},
    "365": {uri: 'achievement_team_empty_365_white'},
    "500": {uri: 'achievement_team_empty_500_white'},
    "1000": {uri: 'achievement_team_empty_1000_white'},
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

const commnityClock = {uri:'community_time_icon_white'}

module.exports = {
    appBackground: "#FFF",
    appLighBackground: "#f0f0f0",
    statusBarStyle: "dark-content",
    circularBarOtherColor: "#f2f2f2",

    defaultFont : '#000',
    subTitile :'#707078',
    cardSubTitle: '#707078',
    headerTitle: '#707078',
    topTodayRemainig: "#707078",

    cardBack: "#FFF",
    cardSubSection: "#f9f9f9",
    pogressBarOtherColor: "#f2f2f2",
    replayMorningRoutine: {uri:'icon_replay_exercise_light'},

    viewCompletedBtn: '#03c3f9',
    viewCompletedText: '#FFF',

    scrollableBack: '#FFF',
    scrollableActiveFont: '#000',
    customInactiveFont: '#707078',
    scrollableInactiveFont: '#707078',
    scrollableViewBack: '#FFF',
    scrollableBorderBottom: '#e4e4e4',
    scrollableBorderBottomHeight: 1,
    progressBarTitle:"#707078",
    chatUsername: '#000',
    chatDateTime: '#acb7bd',
    rewiredprogressBarOtherColor: '#f2f2f2',
    verProgressBottomTitle: '#707078',

    streackCountText: '#77e26d',

    senderBubble: '#f0f0f0',
    selectedSenderBubble: '#f0f0f0',
    receiverBubble: '#f0f0f0',
    selectedReceiverBubble: '#dcdcdc',
    bottomChatInner: '#f0f0f0',
    bottomChatPlaceholder: "#707078",
    bottomChatText: "#000",

    postAdviceRowBottomText: '#707078',
    postAdviceRowBottomIcon: '#707078',
    comunityPornDayCount: '#5ac2bc',
    commentReplyIcon: '#707078',
    commentReplyIcon: '#707078',

    editPostBack: '#f0f0f0',
    editPostText: '#000',

    poastButton: '#03c3f9',//'#58c0f4',

    selectedSortBtn: '#03c3f9',
    unselectedSortBtn: '#68dbfb',
    createPostBtn: '#03c3f9',

    createPostCancel: '#707078',

    commentViewBack: '#FFF',
    commentHeader: '#f0f0f0',
    commentView: '#FFF',

    leaderBoradRank: '#707078',

    moreRow: '#FFF',
    pressInMoreRow: '#d9d8d8',
    moreSeparator: '#e4e4e4',

    settingEmail: "#707078",
    settingBtn: "#f0f0f0",
    settingBtnText: "#707078",

    verProgressbarBack: '#d8f4f3',
    verProgressbarOrangeBack: '#ffddd4',

    yesDate:[{startingDay: true, color: 'rgb(139,232,145)',textAlign:'center',textColor:'#000'},
        {endingDay: true,textAlign:'center', color: 'rgb(139,232,145)',textColor:'#000'}],

    noDate: [{startingDay: true, color: 'rgb(242,104,71)',textAlign:'center',textColor:'#000'},
        {endingDay: true,textAlign:'center', color: 'rgb(242,104,71)',textColor:'#000'}],

    //Leaderboard current user
    leaderboardRowBackColor: '#f0f0f0',
    leaderBoardClose: '#e4e4e4',
    leaderBoardFooter: '#707078',

    //Tabbar
    tabbarBack: '#fff',
    tabbarTopBorder: '#e4e4e4',
    tabIcon: {
        Today: 'tab_nav_icon_1_light',
        Statistic: 'tab_nav_icon_2_light',
        Team: 'tab_nav_icon_3_light',
        Milestone: 'tab_nav_icon_4_light',
        More: 'tab_nav_icon_5_light',
    },
    selectedTabIcon: {
        Today: 'tab_nav_icon_1_selected_light',
        Statistic: 'tab_nav_icon_2_selected_light',
        Team: 'tab_nav_icon_3_selected_light',
        Milestone: 'tab_nav_icon_4_selected_light',
        More: 'tab_nav_icon_5_selected_light',
    },

    achievementImages: {
        Y: achievementiconY,
        L: achievementiconL,
        B: achievementiconB
    },

    improvementIcon: {
        Y: improvementIcon,
        B: improvementIcon
    },

    teamAchievementImages: {
        Y: teamAchievementicomY,
        B: temaAchievementIcon
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
    appRefreshControl: '#707078',

    statisticCalendar: {
        calendarBackground: "transparent",
        textSectionTitleColor: '#707078',
        selectedDayTextColor: '#000',
        todayTextColor: '#03c3f9',
        dayTextColor: '#000',
        textDisabledColor: '#c6c6c9',
        monthTextColor: '#000',
        yearTextColor: '#707078',
        textMonthFontSize: 24,
        textMonthFontFamily: Constant.font300,
        default: 'transparent',
        textDayHeaderFontFamily: Constant.font300,
        editButton:{
            fontSize:14,
            color:'#707078',
            fontFamily: Constant.font500,
        }
    },
    arrowColor: '#707078',

    //Popup
    todayPopupBackgroundColor: '#FFF',
    todayPopupBackOpacity: 0.5,
    aboutYouPopupBack: 'rgba(255,255,255,0.7)',

    //Navigation bar
    navDefaultColor: '#FFF',
    navBorderColor: '#e4e4e4',
    navTextColor: '#000',
    navBackArrow: 'rgba(0,0,0,0.8)',
    navSettingFillingTempted: '#FFF',
    navSettingFillingTemptedBorder: '#e4e4e4',
    navSettingAudioActivity: '#FFF',
    navSettingAudioActivityBorder: '#e4e4e4',

    navDoneBtn: 'rgba(0,0,0,0.8)',

    activityIndicator: '#707078',

    teamDetailsRow: '#e2f8ff',
    profileColor: '#707078',
    rowSeperator: '#e4e4e4',
    textInputBackColor: '#fff',
    textColor: '#4e4e4e',
    streakHelpBtn:'#707078',
    streakHelpText:'#fff',

    communityClock: commnityClock
}