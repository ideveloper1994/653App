import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import TeamDetail from '../subcomponent/myTeam/teamDetail';
import TeamDetailRow from '../subcomponent/myTeam/teamDetailRow';
import TeamAchievementProgress from './teamAchievementProgress';
import CommunityStatistics from './communityStatistics';
import { calculateTeamAchievements, getMemberDetail, getEventsDetails } from '../../../../actions/teamAction';
import { manageEncouragePopup, manageCongatulatePopup, manageTeamAchievementPopup } from '../../../../actions/userActions';
import _, {find} from 'lodash';
import moment from 'moment';

let teamAchievements = [
    { icon: "B", val: "10"},
    { icon: "B", val: "30"},
    { icon: "B", val: "50"},
    { icon: "B", val: "100"},
    { icon: "B", val: "180"},
    { icon: "B", val: "365"},
    { icon: "B", val: "500"},
    { icon: "B", val: "1000"},
];


class MyTeam extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            pre:0,
            achievements: teamAchievements,
        };
    }

    componentWillMount () {
        this.props.calculateTeamAchievements().then(res => {
            this.setState({
                achievements: res.teamAchievements
            })
        });
    }

    componentDidMount(){
    }

    componentWillReceiveProps (props) {
        this.props.calculateTeamAchievements().then(res => {
            this.setState({
                achievements: res.teamAchievements
            })
        });
    }

    renderAllTeam = (item) => {
        return(
            <TeamDetailRow/>
        );
    };

    handleScroll = (event)=>{
        if(this.state.pre <=0 && event.nativeEvent.contentOffset.y <= 0) {
            //this.props.onButtonPress(0);
        }
        this.setState({pre:event.nativeEvent.contentOffset.y});
    };

    navigateToLeaderBoard = () => {
        this.props.navigation.navigate('leaderboard', { selectedTab: 1, transition: "myCustomSlideUpTransition"});
    };

    onPressEncourage = (obj) => {
        let encourageObj = _.cloneDeep(this.props.encouragePopup);
        encourageObj.isShow = true;
        encourageObj.detail = {
            name: obj.name,
            id: obj.id
        };
        this.props.manageEncouragePopup(encourageObj);
    };

    onPressCongratulate = (objMember, achievements) => {
        let congratulateObj = _.cloneDeep(this.props.congratulatePopup);
        congratulateObj.isShow = true;
        congratulateObj.detail = achievements;
        this.props.manageCongatulatePopup(congratulateObj);
    };

    onPressAchievements = (obj) => {
        try{
            let progressPer = "100%";
            let bottomTitle = "100%";
            if(obj.icon == "B"){
                let teamCleanDay = 0;
                let data = this.props.teamDetail.porn_free_days || null;
                if (data) {
                    if('counts' in data){
                        teamCleanDay = data.counts.total || 0;
                    }else{
                        teamCleanDay = data.total || 0;
                    }
                }
                let currentIcon = parseInt(obj.val);
                let p = Math.round(teamCleanDay/currentIcon*100);
                let remainingDays = currentIcon - teamCleanDay;
                progressPer = p + "%"
                if(p == 0){
                    progressPer = "4%"
                }
                bottomTitle = p + "% - " + remainingDays + " days remaining"
            }
            let teamAchievementDetail = {
                objIcon: obj,
                title: obj.val + " days porn-free",
                processTitle: (obj.icon == "Y") && "Achievement unlocked" || "In progress",
                progressPer: progressPer,
                remainingProgress: bottomTitle
            }
            this.props.manageTeamAchievementPopup({
                isShow: true,
                teamAchievementDetail: teamAchievementDetail
            })
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    }

    //show Community Profile
    onPressCommunityProfileIcon = (memberDetail) => {
        if(memberDetail){
            let instance = memberDetail;
            if(memberDetail.is_current_user && this.props.userCommunity){
                instance = this.props.userCommunity;
            }else{
                let data = find(this.props.memberArray,{id:this.props.userId});
                if(data.name.includes("You (")){
                    data.name = data.name.substring(5,data.name.length-1);
                }
                instance.hearts_count = 0;
                instance.biography = "";
            }
            this.props.navigation.navigate("communityProfile"+"Card",{transition: "myCustomSlideRightTransition",
                isCurrentUser:memberDetail.is_current_user, memberDetail: instance});
            this.props.getMemberDetail(memberDetail.id, memberDetail.is_current_user).then(res=>{
                this.props.getEventsDetails(memberDetail.id,null, memberDetail.is_current_user);
            });
        }
    }

    render() {
        //rankings
        let currentUser = _.find(this.props.teamLeaderBoard,{is_current_users_team: true});
        let rank = 0;
        if('rankings' in this.props.teamDetail){
            rank = (this.props.teamDetail && this.props.teamDetail.rankings) && this.props.teamDetail.rankings.porn_free_days || 0;
        }
        if(rank == 0  && currentUser !== undefined){
            rank = currentUser.rank;
        }
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <ScrollView style={[styles.container,{backgroundColor:appColor.scrollableViewBack}]}
                        scrollEventThrottle={0}>
                <TeamDetail teamData={this.props.teamDetail}
                            rank={rank}
                            appTheme={this.props.appTheme}
                            navigateToLeaderBoard={this.navigateToLeaderBoard}/>

                <View style={{paddingTop:15,backgroundColor:appColor.scrollableViewBack}}>
                    <View style={styles.titleView}>
                        <Text style={[styles.titleText,{color: appColor.defaultFont}]}>
                            Team statistics
                        </Text>
                    </View>
                </View>
                <View style={{width:Constant.screenWidth, alignSelf:'center'}}>
                    {
                        (this.props.memberArray.map((teamMember, index) => {
                            let isAlreadySend = false;
                            let objCongratulate = null;
                            let type = "";
                            if(teamMember.is_current_user){
                                teamMember.name = (this.props.userName) ? "You (" + this.props.userName + ")" : "You (null)"
                            }else{
                                var checkupDate = moment(teamMember.midnight_of_last_checkup_at, 'YYYY-MM-DD HH:mm:ss');
                                const rightNow = moment().format('YYYY-MM-DD HH:mm:ss')
                                var duration = moment(rightNow).diff(checkupDate, 'hours');
                                if(duration > 48){
                                    let encourageObj = _.find(this.props.encouragePopup.encourageDetail, {id:teamMember.id});
                                    if(encourageObj == undefined){
                                        type="Encourage";
                                        // let messageDate = moment(encourageObj.dateTime, 'YYYY-MM-DD HH:mm:ss');
                                        // duration = moment(rightNow).diff(messageDate, 'hours');
                                        // if(duration < 48) {
                                        //     isAlreadySend = true;
                                        // }
                                    }
                                }else{
                                    let achievementsData = _.filter(this.props.teamAchievements, (item) => {return item.member.id === teamMember.id});
                                    achievementsData.forEach(obj=>{
                                        if(_.find(this.props.congratulatePopup.congratulateDetail,{id:obj.id}) == undefined) {
                                            var occurredDate = moment(obj.occurred_at, 'YYYY-MM-DD HH:mm:ss');
                                            const rightNow = moment().format('YYYY-MM-DD HH:mm:ss')
                                            var duration = moment(rightNow).diff(occurredDate, 'hours');
                                            if (duration < 24) {
                                                isShowCongratulate = true;
                                                objCongratulate = obj;
                                                type = "Congratulate"
                                            }
                                        }
                                    })
                                }
                            }
                            return(
                                <TeamDetailRow memberDetail={teamMember}
                                               gender = {this.props.gender}
                                               avatar_id = {this.props.avatar_id}
                                               total_p_clean_days={this.props.total_p_clean_days}
                                               current_p_clean_days={this.props.current_p_clean_days}
                                               best_p_clean_days={this.props.best_p_clean_days}
                                               appTheme={this.props.appTheme}
                                               onPressEncourage={this.onPressEncourage}
                                               isAlreadySend={isAlreadySend}
                                               objCongratulate={objCongratulate}
                                               onPressCongratulate={this.onPressCongratulate}
                                               type={type}
                                               onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}
                                               key={index}/>
                            );
                        }))
                    }
                </View>
                <View style={{marginTop:35}}>
                    <TeamAchievementProgress achievements = {this.state.achievements}
                                             appTheme={this.props.appTheme}
                                             onIconPress={this.onPressAchievements}/>
                </View>

                <View style={{marginTop:35, marginBottom:50}}>
                    <CommunityStatistics appTheme={this.props.appTheme}
                                         teamGlobalStatistic={this.props.teamGlobalStatistic}/>
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
    titleView:{
        paddingTop:10,
        justifyContent:'center',
        alignItems:'center',
    },
    titleText:{
        color: '#FFFFFF',
        fontSize: 15,
        alignSelf:'center',
        fontFamily: Constant.font500,
    }
});

const mapStateToProps = state => {
    return {
        teamDetail:state.team.teamDetail,
        memberArray:state.team.memberArray,
        gender:state.user.userDetails.gender || 'male',
        avatar_id:state.user.userDetails && state.user.userDetails.avatar_id || 1,
        userName:state.user.userDetails.name || "",
        teamLeaderBoard: state.team.teamLeaderBoard.overall,
        total_p_clean_days:state.statistic.pornDetail.total_p_clean_days,
        current_p_clean_days:state.statistic.pornDetail.current_p_clean_days,
        best_p_clean_days:state.statistic.pornDetail.best_p_clean_days,
        isConnected: state.user.isConnected,
        appTheme: state.user.appTheme,
        encouragePopup: state.user.encouragePopup,
        congratulatePopup: state.user.congratulatePopup,
        teamAchievements: state.team.teamAchievements || [],
        userId: state.user.userDetails && state.user.userDetails.id || 0,
        teamGlobalStatistic:state.team.teamGlobalStatistic || null,
        userCommunity: state.user.userCommunity || null,
    };
};

export default connect(mapStateToProps, {
    calculateTeamAchievements,
    manageEncouragePopup,
    manageCongatulatePopup,
    manageTeamAchievementPopup,
    getMemberDetail,
    getEventsDetails
})(MyTeam);