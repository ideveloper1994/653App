import {
    Dimensions,
    Platform
} from 'react-native';
// import Device from './device';
import LightThemeColor from './lightThemeColor';
import DarkThemeColor from './darkThemeColor';

function getContainer(backColor) {
    return {
        flex: 1,
        backgroundColor: backColor,
        paddingBottom: (Platform.OS === 'ios') && 0 || 12
    }
}
module.exports = {
    screen: Dimensions.get('window'),
    screenHeight:  Platform.OS === 'ios' && Dimensions.get('window').height || Dimensions.get('window').height - 24,
    screenWidth:  Dimensions.get('window').width,
    fullScreenHeight:  Dimensions.get('window').height,

    isIphoneX:  Platform.OS === 'ios' && Dimensions.get('window').height === 812,

    isIOS: Platform.OS === 'ios',
    isiPAD: ((Dimensions.get('window').height/Dimensions.get('window').width) < 1.6),
    // isiPad: Device.isIpad(),
    isANDROID: Platform.OS === 'android',

    alertTitle: "Brain Buddy",

    font300: (Platform.OS === 'android') ? 'MuseoSans_300': 'MuseoSans-300',
    font500: (Platform.OS === 'android') ? 'MuseoSans_500': 'MuseoSans-500',
    font700: (Platform.OS === 'android') ? 'MuseoSans_700': 'MuseoSans-700',

    backColor: '#003e53', //003e53 //old Back 01536d //
    lightTheamColor: '#709baa',
    transparent: 'transparent',
    lightBlueColor: '#05c3f9',

    orangeProgressBarColor: '#f26747',
    orangeBackProgressBarColor: 'rgb(179,132,120)',

    blueProgressBarColor: '#5bc4bd',
    orangeColor: '#fbb043',
    greenColor: '#77e26d',
    transparentBackColor: '#1b657c',

    verColor:'#55c1bc',
    darkVerColor:'#1a7181', //147585

    darkVerOrange:'#b48578',
    verOrangeColor:'#f46b46',

    backColor2: 'rgb(26,100,125)',
    activeColor:'rgb(37,215,76)',
    backProgressBarColor: '#01536d',
    grayBackground: '#efeff4',//'rgb(239,239,244)',
    heartColor:'rgb(242,103,71)',
    commentColor: '#58c0f4',

    settingHeaderColor: 'rgb(239,239,244)',
    settingGrayColor: '#efeff4',

    settingRowPressIn: '#dcdbdb',

    lightYesDate:[{startingDay: true, color: 'rgb(139,232,145)',textAlign:'center',textColor:'white'},
        {endingDay: true,textAlign:'center', color: 'rgb(139,232,145)',textColor:'#000'}],

    lightNoDate: [{startingDay: true, color: 'rgb(242,104,71)',textAlign:'center',textColor:'white'},
        {endingDay: true,textAlign:'center', color: 'rgb(242,104,71)',textColor:'#000'}],

    yesEditDate:[{startingDay: true, color: 'rgb(139,232,145)',textAlign:'center',textColor:'#4b4b4b'},
        {endingDay: true,textAlign:'center', color: 'rgb(139,232,145)',textColor:'#4b4b4b'}],

    noEditDate: [{startingDay: true, color: 'rgb(242,104,71)',textAlign:'center',textColor:'#4b4b4b'},
        {endingDay: true,textAlign:'center', color: 'rgb(242,104,71)',textColor:'#4b4b4b'}],

    darkTheme: "DARK",
    lightTheme: "LIGHT",

    DARK: DarkThemeColor,

    getContainer,

    LIGHT: LightThemeColor,

    NO_RELIGIOUS: "NO_RELIGIOUS",
    RELIGIOUS: "RELIGIOUS",
    ASK_RELIGIOUS_ALERT: "ASK_RELIGIOUS_ALERT",

    NOT_REACHABLE_BACKEND: "NOT_REACHABLE_BACKEND",
    NOT_REACHABLE: "NOT_REACHABLE",
    REACHABLE: "REACHABLE",
    CANCEL_TOKEN: "CANCEL_TOKEN",

    selectionColor: '#4596d8',
    cancelTokenError: "Operation canceled by cancelToken"

};