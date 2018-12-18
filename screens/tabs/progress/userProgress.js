import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import Constant from '../../../helper/constant';
import RewiringProgress from './component/rewiringProgress';
import AchievementProgress from './component/achievementProgress';
import ImprovementProgress from './component/improvementProgress';
import MonthlyChallenge from './component/monthlyChallenge';
import { connect } from 'react-redux';
import { calculationYellowAchievements } from '../../../actions/statisticAction';
import { calculateRewiringProgress } from '../../../actions/metadataActions';
import { manageRewiringPopup, manageMonthlyChallengePopup } from '../../../actions/userActions';
import _ from 'lodash';
import {getCurrentMonth, getSexualityTitle} from "../../../helper/appHelper";


let achievements = [
    { icon: "B", val: "1", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - goal starts at midnight"},
    { icon: "B", val: "3", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - 3 days remaining"},
    { icon: "B", val: "7", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - 7 days remaining"},
    { icon: "B", val: "14", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - 14 days remaining"},
    { icon: "B", val: "30", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - 30 days remaining"},
    { icon: "B", val: "90", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - 90 days remaining"},
    { icon: "B", val: "180", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - 180 days remaining"},
    { icon: "B", val: "365", progressPer: "4%", actualProgress: "0%", remainingProgress: "0% - 365 days remaining"}];

class UserProgress extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            dismiss:false,
            pre:0,
            achievements: achievements,
            renderCurrentMonth: false
        };
    }

    componentWillMount () {
        this.props.calculationYellowAchievements().then(res => {
            this.setState({
                achievements: res.achievements
            })
        });
    }

    componentWillReceiveProps (props) {
        this.props.calculationYellowAchievements().then(res => {
            this.setState({
                achievements: res.achievements
            })
        });
        if(props.visibleTab == "statistic") {
            this.isRenderCurrentMonth()
        }
    }

    onAchievementIconPress = (objIcon) => {
        try{
            let title = objIcon.val == "1" && "24 hours clean" || objIcon.val + " days porn-free";
            let processTitle = "";
            if (objIcon.icon == "L"){
                processTitle = "Achievement previously reached";
            }else if (objIcon.icon == "Y"){
                processTitle = "Achievement unlocked";
            }else{
                processTitle = "In progress";
            }
            objIcon.isAchievement = true;
            objIcon.processTitle = processTitle;
            objIcon.title = title;
            objIcon.bottomTitle="";
            this.props.manageRewiringPopup({isShow: true,rewiringDetail:objIcon});
        }catch (e){
            console.log(e);
        }
    };

    onImprovementIconPress = (iconDetail) => {
        try{
            let processTitle = "In progress";
            if (iconDetail.icon == "Y") {
                processTitle = "Achievement unlocked";
            }
            iconDetail.title =  this.getText(iconDetail.val);
            iconDetail.isAchievement = false;
            iconDetail.opacity = false;
            iconDetail.processTitle = processTitle;
            iconDetail.actualPer = iconDetail.actualPer || "0%";
            iconDetail.progressBottom = (iconDetail.icon == "Y") && "Progress - 100%" || "Progress - " + iconDetail.actualPer || "0%";
            this.props.manageRewiringPopup({isShow: true,
                rewiringDetail:iconDetail});

        }catch (e){
            console.log(e);
        }
    };

    onMonthlyChallenge = (year, month, percentage, iconType) => {
        try{
            let obj = {
                isShow: true,
                monthlyDetail: {
                    year: year,
                    month: month,
                    iconType: iconType,
                    progressPer: percentage + "%",
                    actualProgress: "Progress - " + percentage + "%",
                }
            };
            if(iconType == "Y"){
                obj.monthlyDetail.description = "Challenge won";
                obj.monthlyDetail.title = "Clean " + getCurrentMonth(month);
                obj.monthlyDetail.type = "rewiring";
            }else{
                obj.monthlyDetail.description = "Report a clean day every day this month to win this achievement.";
                obj.monthlyDetail.title = getCurrentMonth() + " challenge";
                obj.monthlyDetail.type = "today";
            }
            this.props.manageMonthlyChallengePopup(obj);
        }catch (e){
            console.log(e);
        }
    };

    getText = (type) => {
        switch (type) {
            case "mind":
                return "Sharper mind and memory";
            case "energy":
                return "More energy and motivation";
            case "attraction":
                let title = getSexualityTitle(this.props.userDetails)
                return title;
            case "sleep":
                return "Improved sleeping habits";
            case "voice":
                return "Stronger voice";
            case "health":
                return "Healthier appearance";
            case "confidence":
                return "Improved self-confidence";
            case "alive":
                return "Improved libido and sex life";
            default:
                return "";
        }
    };

    isRenderCurrentMonth = () => {
        try{
            let currentYear = new Date().getFullYear().toString()
            let currentMonth = new Date().getMonth()
            let groupbyYear = _.groupBy(this.props.p_array, function (el) {
                return (new Date(el.occurred_at).getFullYear());
            });
            let temp = _.groupBy(groupbyYear[currentYear], function (el) {
                return (new Date(el.occurred_at).getMonth());
            });
            let arrCurrentMonth = temp[currentMonth+""];
            let replapseObj = _.filter(arrCurrentMonth, {is_relapse: true});
            if(replapseObj.length <= 0) {
                let date = new Date().getDate();
                let otherData = _.filter(arrCurrentMonth, {is_relapse: false});
                if (otherData.length == date || (otherData.length == date - 1)) {
                    this.setState({
                        renderCurrentMonth: true
                    });
                    return;
                }
            }
            this.setState({
                renderCurrentMonth: false
            });
        }catch (e){
            console.log(e);
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.mainContainer,{backgroundColor: appColor.scrollableViewBack}]}>
                <ScrollView style={[styles.container,{backgroundColor: appColor.scrollableViewBack}]}>
                    <View style={{paddingBottom:50}}>
                        <RewiringProgress rewiringProgress={this.props.rewiringProgress}
                                          appTheme={this.props.appTheme}/>
                        <AchievementProgress onIconPress={this.onAchievementIconPress}
                                             achievements={this.state.achievements}
                                             appTheme={this.props.appTheme}/>
                        <ImprovementProgress onIconPress={this.onImprovementIconPress}
                                             improvement={this.props.improvementPercentage}
                                             appTheme={this.props.appTheme}/>
                        <MonthlyChallenge onIconPress={this.onMonthlyChallenge}
                                          cleanDayPerMonth={this.props.clean_p_days_per_month}
                                          isRenderCurrentMonth={this.state.renderCurrentMonth}
                                          appTheme={this.props.appTheme}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:Constant.backProgressBarColor,
    },
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
});

const mapStateToProps = state => {
    return {
        total_p_clean_days: state.statistic.pornDetail.total_p_clean_days,
        improvementPercentage: state.metaData.improvementPercentage,
        rewiringProgress: state.metaData.rewiringProgress,
        clean_p_days_per_month:state.statistic.pornDetail.clean_p_days_per_month,
        p_array:state.statistic.pornDetail.p_array,
        appTheme: state.user.appTheme,
        visibleTab: state.user.visibleTab,
        userDetails:state.user.userDetails,
    };
};

export default connect(mapStateToProps, {
    calculationYellowAchievements,
    calculateRewiringProgress,
    manageRewiringPopup,
    manageMonthlyChallengePopup
})(UserProgress);