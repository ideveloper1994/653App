import {StyleSheet, Dimensions} from 'react-native';
import * as defaultStyle from '../style';

let width = Dimensions.get('window').width * 0.9;
width = (width > 600) && 600 || width;
export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      // flex: 1,
      // backgroundColor: appStyle.calendarBackground,
      width: width,
    },
    week: {
      marginTop: 7,
      marginBottom: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
  });
}

