import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    AsyncStorage, BackHandler,
    DatePickerIOS,
    Picker
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import OptionRowText from '../../components/optionRowWithText';
import {showNoInternetAlert, getTimeFromDate, getTimeString} from "../../../../../../../helper/appHelper";
import DoNotDisturbTime from '../../components/doNotDisturbTime';
import moment from 'moment';
import {updateMetaDataNoCalculation} from "../../../../../../../actions/metadataActions";
import PickerAndroid from '../../../../../../commonComponent/pickerAndroid';

class DoNotDisturb extends React.PureComponent {

    constructor(props){
        super(props);
           this.state = {
               selectedType:'From',
               fromTime: props.do_not_disturb_start,
               toTime: props.do_not_disturb_end,
               strFromTime: getTimeString(props.do_not_disturb_start),
               strToTime: getTimeString(props.do_not_disturb_end),
               hoursVal: [1,2,3,4,5,6,7,8,9,10,11,12],
               meridiem: (props.do_not_disturb_start >= 12 || props.do_not_disturb_start == 0) && 'PM' || 'AM',
               selectedHours: (props.do_not_disturb_start > 12) && (props.do_not_disturb_start - 12) || (props.do_not_disturb_start == 0) &&
               12 || props.do_not_disturb_start
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount() {
        this.props.updateMetaDataNoCalculation({
            do_not_disturb_start: this.state.fromTime,
            do_not_disturb_end: this.state.toTime
        })
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onSelectTime = (type) => {
        if(type == "To"){
            this.setState({
                meridiem: (this.state.toTime >= 12 || this.state.toTime == 0) && "PM" || "AM",
                selectedHours: (this.state.toTime > 12) && (this.state.toTime - 12) || (this.state.toTime == 0) &&
                12 || this.state.toTime,
                selectedType: type,
            });
        }else{
            this.setState({
                meridiem: (this.state.fromTime >= 12 || this.state.fromTime == 0) && "PM" || "AM",
                selectedHours: (this.state.fromTime > 12) && (this.state.fromTime - 12) || (this.state.fromTime == 0) &&
                12 || this.state.fromTime,
                selectedType: type,
            });
        }
    }

    onTimeChange = (newDate) => {
        if(this.state.selectedType == "To"){
            this.setState({
                toTime: newDate.getHours(),
                strToTime: getTimeFromDate(newDate)
            });
        }else{
            this.setState({
                fromTime: newDate.getHours(),
                strFromTime: getTimeFromDate(newDate)
            });
        }
    }

    onSelectHours = (hours, meridiemVal = null) => {
        let apiHours = hours;
        let meridiem = meridiemVal;
        if(meridiem == null){
            meridiem = this.state.meridiem
        }
        if(meridiem == "PM"){
            apiHours = apiHours + 12;
        }
        if(apiHours > 23){
            apiHours = 0;
        }
        if(this.state.selectedType == "To"){
            this.setState({
                selectedHours: hours,
                toTime: apiHours,
                strToTime: getTimeString(apiHours),
                meridiem: meridiem
            })
        }else{
            this.setState({
                selectedHours: hours,
                fromTime: apiHours,
                strFromTime: getTimeString(apiHours),
                meridiem: meridiem
            })
        }
    }

    onSelectmeridiem = (meridiem) => {
        if(this.state.selectedType == "To"){
            let hours = this.state.toTime > 12 && (this.state.toTime - 12) || this.state.toTime;
            this.onSelectHours(hours, meridiem);
        }else{
            let hours = this.state.fromTime > 12 && (this.state.fromTime - 12) || this.state.fromTime;
            this.onSelectHours(hours, meridiem);
        }
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress}
                               top={this.props.safeAreaInsetsData.top}
                               title='Do not disturb'/>
                <View style={{justifyContent:'center',flex:1}}>
                    <DoNotDisturbTime selectedType={this.state.selectedType}
                                      type={"From"}
                                      onSelectTime={this.onSelectTime}
                                      displayTime={this.state.strFromTime}/>
                    <DoNotDisturbTime selectedType={this.state.selectedType}
                                      type={"To"}
                                      onSelectTime={this.onSelectTime}
                                      displayTime={this.state.strToTime}/>
                </View>
                {
                    (Constant.isIOS) &&
                        <View style={{flexDirection:'row', width:'80%', alignSelf:'center'}}>
                            <Picker style={{flex:1}}
                                    itemStyle={{color: '#000',fontFamily: Constant.font500}}
                                    selectedValue={this.state.selectedHours}
                                    onValueChange={(itemValue, itemIndex) => this.onSelectHours(itemValue, null)}>
                                {
                                    this.state.hoursVal.map(val=>{
                                        return <Picker.Item label={val.toString()} value={val}/>
                                    })
                                }
                            </Picker>
                            <Picker style={{flex:1}}
                                    itemStyle={{color: '#000',fontFamily: Constant.font500}}
                                    selectedValue={this.state.meridiem}
                                    onValueChange={(itemValue, itemIndex) => this.onSelectmeridiem(itemValue)}>
                                <Picker.Item label={"AM"} value={"AM"}/>
                                <Picker.Item label={"PM"} value={"PM"}/>
                            </Picker>
                        </View>
                    ||

                    <View style={{flexDirection:'row', width:'80%', alignSelf:'center'}}>
                        <PickerAndroid pickerStyle={{width:'50%'}}
                                       itemStyle={{color: '#000',fontFamily: Constant.font500}}
                                       selectedValue={this.state.selectedHours}
                                       onValueChange={(itemValue, itemIndex) => {
                                           this.onSelectHours(itemValue,null)}}>
                            {
                                this.state.hoursVal.map(val=>{
                                    return <PickerAndroid.Item label={val+""} value={val}/>
                                })
                            }
                        </PickerAndroid>

                        <PickerAndroid pickerStyle={{width:'50%'}}
                                       itemStyle={{color: '#000',fontFamily: Constant.font500}}
                                       selectedValue={this.state.meridiem}
                                       onValueChange={(itemValue, itemIndex) => {
                                           this.onSelectmeridiem(itemValue)}}>
                            <PickerAndroid.Item label={"AM"} value={"AM"}/>
                            <PickerAndroid.Item label={"PM"} value={"PM"}/>
                        </PickerAndroid>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        isConnected: state.user.isConnected,
        do_not_disturb_start: (state.metaData.metaData.do_not_disturb_start == null) && 22 || state.metaData.metaData.do_not_disturb_start,
        do_not_disturb_end: (state.metaData.metaData.do_not_disturb_end == null) && 7 || state.metaData.metaData.do_not_disturb_end,
    };
};

export default connect(mapStateToProps, {
    updateMetaDataNoCalculation
})(DoNotDisturb);
