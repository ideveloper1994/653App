import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import CalendarComponet from './component/calendar';
import CalendarComponetLight from './component/calendarLight';
import CleanDayComponent from  './component/cleanDays';
import WhyRelapseComponent from './component/whyRelapse';
import WhenRelapseComponent from './component/whenRelapse';
import WhatDayRelapseComponent from './component/whatDayRelapse';
import WhyStress from './component/whyStress';
import TotalCleanDayComponent from './component/totalCleanDays';
import moment from 'moment';
import _ from 'lodash';
import {setTeamChatNotification} from "../../../../actions/userActions";

class PornTab extends React.PureComponent {

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

    componentDidMount() {
        this.setMidNight();

        /*
        //call if lazy = true
        if(!this.state.isShowData && this.props.visibleTab == "statistic"){
            setTimeout(()=>{
                this.setState({
                    isShowData: true
                })
            },300);
        }
        */
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.visibleTab == "statistic"){
            this.setMidNight();
            if(!this.state.isShowData){
                setTimeout(()=>{
                    this.setState({
                        isShowData: true
                    })
                },100)
            }
        }
    }

    setMidNight = () =>{
        try{
            let topText =  "";
            let isMidnight = false;
            let backColor = 'transparent';
            let todayDate = moment().format("YYYY-MM-DD");
            if(this.props.last_checkup_at === todayDate){
                let obj = _.find(this.props.p_array,{ occurred_at: todayDate });
                if(obj !== undefined) {
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
            console.log(e)
        }
    };

    leaderBoardClicked = () => {
        this.props.navigation.navigate('leaderboard', { selectedTab: 0, transition: "myCustomSlideUpTransition"});
    };

    onEditButton = () => {
        this.props.navigation.navigate("editPornCalendarCard",
            {transition: "myCustomSlideRightTransition"});
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];

        let markDateObj = {};
        this.props.p_yes_array.map((obj)=>{
            markDateObj[obj]= appColor.yesDate;
        });
        this.props.p_no_array.map((obj)=>{
            markDateObj[obj]= appColor.noDate;
        });
        return (
            !this.state.isShowData &&
            <View/>
            ||
            <ScrollView style={[styles.container,{backgroundColor:appColor.scrollableViewBack}]}>
                <TotalCleanDayComponent backColor="rgb(91,196,189)"
                                        isBtnLeadeBoard={true}
                                        topPopup={this.state.topPopup}
                                        no_of_porn_clean_day={this.props.total_p_clean_days}
                                        current_clean_streak={this.props.current_p_clean_days}
                                        best_clean_streak={this.props.best_p_clean_days}
                                        leaderBoardClicked={this.leaderBoardClicked}
                                        appTheme={this.props.appTheme}/>
                <View style={{maxWidth:600, alignSelf:'center', width: '100%'}}>
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
                    <CleanDayComponent clean_days_per_month={this.props.clean_p_days_per_month}
                                       appTheme={this.props.appTheme}/>
                    <WhyRelapseComponent isRemoveTempted={true}
                                         whyIRelapse={this.props.pornWhyIRelapse}
                                         appTheme={this.props.appTheme}/>
                    <WhenRelapseComponent whenIRelapse={this.props.pornWhenIRelapse}
                                          appTheme={this.props.appTheme}/>
                    <WhatDayRelapseComponent relapsed_days_per_weekdays={this.props.relapsed_p_days_per_weekdays}
                                             appTheme={this.props.appTheme}/>
                    <WhyStress whenStressed={this.props.pornWhenIStressed}
                               appTheme={this.props.appTheme}/>
                    <View style={{height:50}}/>
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
        p_array: state.statistic.pornDetail.p_array,
        p_yes_array: state.statistic.pornDetail.p_yes_array,
        p_no_array: state.statistic.pornDetail.p_no_array,
        total_p_clean_days:state.statistic.pornDetail.total_p_clean_days,
        current_p_clean_days:state.statistic.pornDetail.current_p_clean_days,
        best_p_clean_days:state.statistic.pornDetail.best_p_clean_days,
        clean_p_days_per_month:state.statistic.pornDetail.clean_p_days_per_month,
        relapsed_p_days_per_weekdays:state.statistic.pornDetail.relapsed_p_days_per_weekdays,
        pornWhyIRelapse:state.statistic.pornWhyIRelapse,
        pornWhenIStressed:state.statistic.pornWhenIStressed,
        pornWhenIRelapse:state.statistic.pornWhenIRelapse,
        visibleTab: state.user.visibleTab,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
})(PornTab);