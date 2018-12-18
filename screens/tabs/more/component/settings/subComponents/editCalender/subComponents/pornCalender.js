import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../../../../../helper/constant';
import moment from 'moment';
import NavigationBar from '../../../../../../../commonComponent/navBar';
import CalendarComponent from '../components/calender';
import _ from 'lodash';
import { addPornDays, updatePornDay, deletePornDay,
    calculatePornDay,
    calculateMosturbationDay,
    calculateJournal,
} from '../../../../../../../../actions/statisticAction';
import { getTeamDetail,
    getleaderboardTeamList,
    getleaderboardIndividualList } from '../../../../../../../../actions/teamAction';
import {
    setUpLocalNotificationAlerts,
    removeSafeArea,
    managePopupQueue
} from '../../../../../../../../actions/userActions';
import { showNoInternetAlert } from '../../../../../../../../helper/appHelper';
import {updateMetaData} from "../../../../../../../../actions/metadataActions";

let isCalendarUpdates = false;
let isAPICalls = false;

let inProcessObject = [];

class PornCalender extends React.PureComponent {

    constructor(props){
        super(props);
        let markDateObj = {};
        this.props.p_yes_array.map((obj)=> {
            // let tempDate = moment(moment(obj,"DD-MM-YYYY")).format("YYYY-MM-DD");
            markDateObj[obj]=Constant.yesEditDate;
        });
        this.props.p_no_array.map((obj)=>{
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
        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.isFromToday){
                this.props.removeSafeArea(true);
                let obj = this.props.popupQueue;
                obj.checkup = null;
                this.props.managePopupQueue(obj);
            }
        }
    }

    onSelectDay = (day) => {
        try{
            if(inProcessObject.indexOf(day.dateString) < 0) {
                inProcessObject.push(day.dateString);
                if (this.props.isConnected) {
                    let allDates = _.cloneDeep(this.state.markedDates);
                    let selectedDates = Object.keys(allDates);
                    if (selectedDates.indexOf(day.dateString) >= 0) {
                        let obj = allDates[day.dateString];
                        let selectedObj = _.find(this.props.p_array, {occurred_at: day.dateString});
                        if (obj[0].color == Constant.yesEditDate[0].color) {
                            //Yes style
                            allDates[day.dateString] = Constant.noEditDate;
                            if (selectedObj != undefined) {
                                let pornObj = {is_relapse: !selectedDates.is_relapse, id: selectedObj.id};
                                this.props.updatePornDay(pornObj).then(res => {
                                    let indexOfDate = inProcessObject.indexOf(res.occurred_at)
                                    if (indexOfDate >= 0) {
                                        inProcessObject.splice(indexOfDate, 1);
                                    }
                                }).catch(err => {
                                    inProcessObject = [];
                                });
                                isCalendarUpdates = true;
                            }
                        } else {
                            //no style
                            allDates = _.omit(allDates, day.dateString);
                            if (selectedObj != undefined) {
                                this.props.deletePornDay(selectedObj.id).then(res => {
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
                    } else {
                        if(day.dateString === moment(this.state.todayDate).format("YYYY-MM-DD")){
                            let selectedObj = _.find(this.props.p_array, {occurred_at: day.dateString});
                            if(selectedObj !== undefined){
                                allDates[day.dateString] = Constant.noEditDate;
                                let pornObj = {is_relapse: true, id: selectedObj.id};
                                this.props.updatePornDay(pornObj).then(res => {
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
                                let pornObj = {
                                    is_relapse: true,
                                    occurred_at: day.dateString
                                };
                                this.props.addPornDays(pornObj).then(res => {
                                    let indexOfDate = inProcessObject.indexOf(res.occurred_at)
                                    if (indexOfDate >= 0) {
                                        inProcessObject.splice(indexOfDate, 1);
                                    }
                                }).catch(err => {
                                    inProcessObject = [];
                                });
                                isCalendarUpdates = true;
                            }
                        }else{
                            //Create porn day
                            allDates[day.dateString] = Constant.yesEditDate;
                            let pornObj = {
                                is_relapse: false,
                                occurred_at: day.dateString
                            };
                            this.props.addPornDays(pornObj).then(res => {
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
                        markedDates: allDates
                    });
                } else {
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
            this.props.calculatePornDay(this.props.pornData);
            // this.props.calculateJournal(this.props.journalData);
            // this.props.getTeamDetail();
            // this.props.getleaderboardTeamList(true);
            // this.props.getleaderboardIndividualList(true);
            this.manageCheckupDate();
        }
        this.props.navigation.goBack();
        if(this.props.navigation.state.params && this.props.navigation.state.params.onBackToTabView){
            this.props.navigation.state.params.onBackToTabView()
        }
    };

    manageCheckupDate = () => {
        let todayDate = moment().format("YYYY-MM-DD");
        let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        if(this.props.last_checkup_at != todayDate && this.props.last_checkup_at != yesterdayDate) {
            let selectedObj = _.find(this.props.p_array, {occurred_at: todayDate});
            // if(selectedObj !== undefined){
            //     this.props.updateMetaData({
            //         last_checkup_at: todayDate,
            //     });
            // }else{
            this.props.updateMetaData({
                last_checkup_at: yesterdayDate,
            });
            // }
        }else{
            // let selectedObj = _.find(this.props.p_array, {occurred_at: todayDate});
            // if(selectedObj !== undefined && this.props.last_checkup_at != todayDate){
            //     this.props.updateMetaData({
            //         last_checkup_at: todayDate,
            //     });
            // }
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title="Calendar - Porn"/>
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
        p_yes_array: state.statistic.pornDetail.p_yes_array,
        p_no_array: state.statistic.pornDetail.p_no_array,
        p_array: state.statistic.pornDetail.p_array,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        pornData : state.statistic.pornDetail.p_array,
        masturbationData : state.statistic.mosturbutionDetail.m_array,
        journalData : state.statistic.j_array,
        isConnected: state.user.isConnected,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        popupQueue: state.user.popupQueue,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    addPornDays,
    updatePornDay,
    deletePornDay,
    calculatePornDay,
    calculateMosturbationDay,
    calculateJournal,
    getTeamDetail,
    getleaderboardTeamList,
    getleaderboardIndividualList,
    setUpLocalNotificationAlerts,
    updateMetaData,
    removeSafeArea,
    managePopupQueue
})(PornCalender);
