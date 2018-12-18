import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import moment from 'moment';
import _ from 'lodash';
import CalendarComponet from './component/calendar';
import CalendarComponetLight from './component/calendarLight';
import CleanDayComponent from  './component/cleanDays';
import WhenRelapseComponent from './component/whenRelapse';
import WhatDayRelapseComponent from './component/whatDayRelapse';
import TotalCleanDayComponent from './component/totalCleanDays';

class MasturbatinTab extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            topPopup: {
                isMidNight: false,
                backColor: "transparent",
                topText: "",
                isShowData: false
            }
        };
    }

    componentDidMount(){
        this.setMidNight();

        //call if lay = true
        /*
        if(!this.state.isShowData){
            setTimeout(()=>{
                this.setState({
                    isShowData: true
                })
            },500);
        }
        */
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.visibleTab == "statistic") {
            this.setMidNight();
            if (!this.state.isShowData) {
                setTimeout(()=>{
                    this.setState({
                        isShowData: true
                    })
                },120)
            }
        }
    }

    setMidNight = () =>{
        try{
            let topText =  "";
            let isMidnight = false;
            let backColor = 'transparent';
            let todayDate = moment().format("YYYY-MM-DD");
            if(this.props.last_checkup_at == todayDate){
                let obj = _.find(this.props.m_array,{ occurred_at: todayDate });
                if(obj != undefined) {
                    if(obj.is_relapse) {
                        isMidnight = true;
                        topText = "TOMORROW IS A NEW DAY";
                        backColor = "#58c0f4"
                    }else{
                        isMidnight = true;
                        topText = "UPDATES AT MIDNIGHT";
                        backColor = "rgb(156,239,147)"
                    }
                    this.setState({
                        backColor: backColor,
                        topText: topText
                    });
                }
            }else{
                isMidnight = false;
            }
            this.setState({
                topPopup: {
                    isMidNight: isMidnight,
                    backColor: backColor,
                    topText: topText
                }
            });
        }catch (e){
            console.log(e);
        }
    };

    onEditButton = () => {
        this.props.navigation.navigate("editMasturbationCalendarCard",
            {transition: "myCustomSlideRightTransition"});
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        let markDateObj = {};
        this.props.m_yes_array.map((obj)=>{
            markDateObj[obj]= appColor.yesDate;
        });
        this.props.m_no_array.map((obj)=>{
            markDateObj[obj]= appColor.noDate;
        });
        return (
            !this.state.isShowData &&
            <View/>
            ||
            <ScrollView style={[styles.container,{backgroundColor:appColor.scrollableViewBack}]}>
                <TotalCleanDayComponent
                    backColor="#7970ff"
                    topPopup={this.state.topPopup}
                    no_of_porn_clean_day={this.props.total_m_clean_days}
                    current_clean_streak={this.props.current_m_clean_days}
                    best_clean_streak={this.props.best_m_clean_days}
                    appTheme={this.props.appTheme}/>
                <View style={{maxWidth: 600, alignSelf: 'center', width: '100%'}}>
                    {
                        (this.props.appTheme === Constant.darkTheme) &&
                        <CalendarComponet markedDates={markDateObj}
                                          onEditButton={this.onEditButton}
                                          visibleTab={this.props.visibleTab}
                                          appTheme={this.props.appTheme}/>
                        ||
                        <CalendarComponetLight markedDates={markDateObj}
                                               onEditButton={this.onEditButton}
                                               visibleTab={this.props.visibleTab}
                                               appTheme={this.props.appTheme}/>

                    }

                    <CleanDayComponent clean_days_per_month={this.props.clean_m_days_per_month}
                                       appTheme={this.props.appTheme}/>
                    <WhenRelapseComponent whenIRelapse={this.props.masturbationWhenIRelapse}
                                          appTheme={this.props.appTheme}/>
                    <WhatDayRelapseComponent relapsed_days_per_weekdays={this.props.relapsed_m_days_per_weekdays}
                                             appTheme={this.props.appTheme}/>
                    <View style={{height: 50}}/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
});

const mapStateToProps = state => {
    return {
        m_array: state.statistic.mosturbutionDetail.m_array,
        m_yes_array: state.statistic.mosturbutionDetail.m_yes_array,
        m_no_array: state.statistic.mosturbutionDetail.m_no_array,
        total_m_clean_days: state.statistic.mosturbutionDetail.total_m_clean_days,
        current_m_clean_days: state.statistic.mosturbutionDetail.current_m_clean_days,
        best_m_clean_days: state.statistic.mosturbutionDetail.best_m_clean_days,
        clean_m_days_per_month: state.statistic.mosturbutionDetail.clean_m_days_per_month,
        relapsed_m_days_per_weekdays: state.statistic.mosturbutionDetail.relapsed_m_days_per_weekdays,
        masturbationWhenIRelapse: state.statistic.masturbationWhenIRelapse,
        visibleTab: state.user.visibleTab,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
})(MasturbatinTab);