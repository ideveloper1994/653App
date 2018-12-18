import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../../../../../helper/constant';
import CalendarComponent from '../components/calender';
import NavigationBar from '../../../../../../../commonComponent/navBar';
import { addMasturbationDays,
    updateMasturbationDay,
    deleteMasturbationDay,
    calculatePornDay,
    calculateMosturbationDay,
    calculateJournal,
} from '../../../../../../../../actions/statisticAction';
import { getTeamDetail,
    getleaderboardTeamList,
    getleaderboardIndividualList } from '../../../../../../../../actions/teamAction';
import { showNoInternetAlert } from '../../../../../../../../helper/appHelper';

import _ from 'lodash';
import moment from "moment/moment";
let isCalendarUpdates = false;
let isAPICalls = false;
let inProcessObject = [];

class MasturbatinCalender extends React.PureComponent {

    constructor(props){
        super(props);
        let markDateObj = {};
        props.m_yes_array.map((obj)=>{
            // let tempDate = moment(moment(obj,"DD-MM-YYYY")).format("YYYY-MM-DD");
            markDateObj[obj]=Constant.yesEditDate;
        });
        props.m_no_array.map((obj)=>{
            // let tempDate = moment(moment(obj,"DD-MM-YYYY")).format("YYYY-MM-DD");
            markDateObj[obj]=Constant.noEditDate;
        });
        this.state={
            markedDates: markDateObj
        };
    }

    componentWillMount() {
        isCalendarUpdates = false;
        isAPICalls = false;
        inProcessObject=[];
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    onSelectDay = (day) => {
        try{
            if(inProcessObject.indexOf(day.dateString) < 0) {
                inProcessObject.push(day.dateString);
                if(this.props.isConnected) {
                    let allDates = _.cloneDeep(this.state.markedDates);
                    let selectedDates = Object.keys(allDates);
                    if(selectedDates.indexOf(day.dateString) >= 0) {
                        let obj = allDates[day.dateString];
                        let selectedObj = _.find(this.props.m_array, { occurred_at: day.dateString });
                        if(obj[0].color == Constant.yesEditDate[0].color) {
                            //Yes style
                            allDates[day.dateString] = Constant.noEditDate;
                            if(selectedObj != undefined) {
                                let masturbationObj = { is_relapse: !selectedDates.is_relapse, id: selectedObj.id };
                                this.props.updateMasturbationDay(masturbationObj).then(res => {
                                    let indexOfDate = inProcessObject.indexOf(res.occurred_at)
                                    if (indexOfDate >= 0) {
                                        inProcessObject.splice(indexOfDate, 1);
                                    }
                                }).catch(err => {
                                    inProcessObject = [];
                                });
                                isCalendarUpdates = true;
                            }
                        }else {
                            //no style
                            allDates = _.omit(allDates, day.dateString);
                            if(selectedObj != undefined) {
                                this.props.deleteMasturbationDay(selectedObj.id).then(res => {
                                    let indexOfDate = inProcessObject.indexOf(res.occurred_at)
                                    if (indexOfDate >= 0) {
                                        inProcessObject.splice(indexOfDate, 1);
                                    }
                                }).catch(err => {
                                    inProcessObject = [];
                                });
                                isCalendarUpdates = true;
                            }
                        }
                    }else{
                        if(day.dateString === moment(this.state.todayDate).format("YYYY-MM-DD")){
                            let selectedObj = _.find(this.props.m_array, { occurred_at: day.dateString });
                            if(selectedObj !== undefined){
                                allDates[day.dateString] = Constant.noEditDate;
                                let masturbationObj = { is_relapse: true, id: selectedObj.id };
                                this.props.updateMasturbationDay(masturbationObj).then(res => {
                                    let indexOfDate = inProcessObject.indexOf(res.occurred_at)
                                    if (indexOfDate >= 0) {
                                        inProcessObject.splice(indexOfDate, 1);
                                    }
                                }).catch(err => {
                                    inProcessObject = [];
                                });
                                isCalendarUpdates = true;
                            }else{
                                allDates[day.dateString] = Constant.noEditDate;
                                let masturbationObj = {
                                    is_relapse: true,
                                    occurred_at: day.dateString
                                };
                                this.props.addMasturbationDays(masturbationObj).then(res => {
                                    let indexOfDate = inProcessObject.indexOf(res.occurred_at)
                                    if (indexOfDate >= 0) {
                                        inProcessObject.splice(indexOfDate, 1);
                                    }
                                }).catch(err => {
                                    inProcessObject = [];
                                });
                                isCalendarUpdates = true;
                            }
                        }else {
                            allDates[day.dateString] = Constant.yesEditDate;
                            let masturbationObj = {
                                is_relapse: false,
                                occurred_at: day.dateString
                            };
                            this.props.addMasturbationDays(masturbationObj).then(res => {
                                let indexOfDate = inProcessObject.indexOf(res.occurred_at)
                                if (indexOfDate >= 0) {
                                    inProcessObject.splice(indexOfDate, 1);
                                }
                            }).catch(err => {
                                inProcessObject = [];
                            });
                            isCalendarUpdates = true;
                        }
                    }
                    this.setState({
                        markedDates:allDates
                    });
                }else{
                    showNoInternetAlert();
                }
            }
        }catch (e){
            inProcessObject = [];
            console.log("Catch block main", e)
        }
    };

    onBackButtonPress = () => {
        if(isCalendarUpdates && !isAPICalls) {
            isAPICalls = true;
            this.props.calculateMosturbationDay(this.props.masturbationData);
            // this.props.getTeamDetail();
            // this.props.getleaderboardTeamList(true);
            // this.props.getleaderboardIndividualList(true);
        }
        this.props.navigation.goBack();
    };

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title="Calendar - Masturbation"/>
                <ScrollView style={styles.container}>
                    <CalendarComponent markedDates={this.state.markedDates}
                                       onSelectDay={this.onSelectDay}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeff4',
    },
});

const mapStateToProps = state => {

    return {
        m_yes_array: state.statistic.mosturbutionDetail.m_yes_array,
        m_no_array: state.statistic.mosturbutionDetail.m_no_array,
        m_array: state.statistic.mosturbutionDetail.m_array,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        pornData : state.statistic.pornDetail.p_array,
        masturbationData : state.statistic.mosturbutionDetail.m_array,
        journalData : state.statistic.j_array,
        isConnected: state.user.isConnected,
        appTheme: state.user.appTheme,
    };
};

export default connect(mapStateToProps, {
    addMasturbationDays, updateMasturbationDay, deleteMasturbationDay,
    calculatePornDay,
    calculateMosturbationDay,
    calculateJournal,
    getTeamDetail,
    getleaderboardTeamList,
    getleaderboardIndividualList
})(MasturbatinCalender);
