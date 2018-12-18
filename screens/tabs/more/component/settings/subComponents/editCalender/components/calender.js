import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    AppState
} from 'react-native';
import Constant from '../../../../../../../../helper/constant';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const today = moment().format("YYYY-MM-DD");

export default  class CalendarComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            todayDate:new Date(),
            appState: AppState.currentState
        }
    }

    onSelectDay = (day) => {
        this.props.onSelectDay(day);
        ReactNativeHapticFeedback.trigger('impactHeavy');
    };

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }


    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.setState({
                todayDate:new Date()
            })

        }
        this.setState({appState: nextAppState});
    }

    render() {
        return (
            <View style={styles.container}>
                <Calendar
                    ref="cal"
                    theme={{
                        calendarBackground: '#efeff4',
                        textSectionTitleColor: '#c9d3db', //7ca6b4
                        todayTextColor: '#4b4b4b',
                        dayTextColor: '#4b4b4b',
                        textDisabledColor: '#bebec1',
                        default: '#c9d3db',
                        monthTextColor: '#4b4b4b',
                        yearTextColor: '#4b4b4b',
                        textMonthFontSize: 24,
                        textMonthFontFamily: Constant.font300,
                        arrowColor: 'red',
                        textDayHeaderFontFamily: Constant.font300,
                    }}
                    onDayPress={(day) => this.onSelectDay(day)}
                    monthFormat={'MMMM yyyy'}
                    onMonthChange={(month) => {}}
                    hideArrows={false}
                    renderArrow={(direction) => (
                        <Ionicons name={(direction === 'left') ? 'ios-arrow-back' : 'ios-arrow-forward'}
                                  size={30}
                                  color={'#c9d3db'}/>
                    )}
                    maxDate={this.state.todayDate}
                    hideExtraDays={true}
                    firstDay={1}
                    markedDates={this.props.markedDates}
                    markingType={'interactive'}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeff4',
        alignItems:'center',
        alignSelf:'center',
        width:'90%'
    },
});