import {StyleSheet,Platform, Dimensions} from 'react-native';
import * as defaultStyle from '../../../style';

const FILLER_HEIGHT = 36;
let width = (Dimensions.get('window').width * 0.9);
width = (width > 600) && 600 || width
let circle = (width/7)*0.9;

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent:'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginLeft: -1,
      // borderWidth:1,
      // borderColor:'#fff'
    },
    base: {
      //borderWidth: 1,
      width: circle < 36 && circle || 36,
      height: circle < 36 && circle || 36,
      alignItems: 'center',
      justifyContent:'center',
      alignSelf: 'center',

    },
    fillers: {
      position: 'absolute',
      height: FILLER_HEIGHT,
      flexDirection: 'row',
      left: 0,
      right: 0
    },
    leftFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    rightFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    text: {
      //marginTop: 5,
      fontSize: appStyle.textDayFontSize,
      fontFamily:  (Platform.OS === 'android') ? 'MuseoSans_300': 'MuseoSans-300',
      fontWeight: '300',
      color: appStyle.dayTextColor || '#2d4150',
      textAlign:'center',
    },
    todayText: {
      fontWeight: '500',
      color: theme.todayTextColor || appStyle.dayTextColor,
      //color: appStyle.textLinkColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    quickAction: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#c1e4fe'
    },
    quickActionText: {
      marginTop: 6,
      color: appStyle.textColor
    },
    firstQuickAction: {
      backgroundColor: appStyle.textLinkColor
    },
    firstQuickActionText: {
      color: 'white'
    },
    naText: {
      color: '#b6c1cd'
    }
  });
}
