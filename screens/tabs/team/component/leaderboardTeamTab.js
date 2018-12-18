import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import LeaderBoardRow from '../subcomponent/leaderBoard/leaderBoardRow'
import _ from 'lodash';
import TopBarComponent from "./teamTopBar";
import { getleaderboardTeamList,getLeaderBoardTeamFilterData } from '../../../../actions/teamAction';

class LeaderboardTeamTab extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            countshow:'Overall',
            leaderBoardTeamList: props.teamLeaderBoard.overall
        }
    }

    componentDidMount(){
        if(this.props.navigation.state.params.selectedTab == 1){
            setTimeout(()=>{
                this.props.getleaderboardTeamList(true);
            },1000);
        }else{
            setTimeout(()=>{
                this.props.getleaderboardTeamList(true);
            },2000);
        }
    }

    labelClicked = (stateLabel) => {
        if(stateLabel != "") {
            this.setState({
                countshow:stateLabel,
                // leaderBoardTeamList: sortList
            });
            this.props.getLeaderBoardTeamFilterData(stateLabel).then((res) => {
                // this.setListData(stateLabel)
            }).catch((err) => {
                // this.setListData(stateLabel)
            })

        }
    };

    setListData = (stateLabel) => {
        let allList = _.cloneDeep(this.props.teamLeaderBoard);
        let sortList = [];
        this.setState({
            countshow:stateLabel,
        });

    }
    onSwipeLeft = (gestureState) => {
        switch (this.state.countshow)
        {
            case "Overall":
                this.labelClicked("This year");
                break;
            case "This year":
                this.labelClicked("This month");
                break;
            case "This month":
                this.labelClicked("This week");
                break;
            case "This week":
                break;
        }
    };

    onSwipeRight = (gestureState) => {
        switch (this.state.countshow)
        {
            case "Overall":
                break;
            case "This year":
                this.labelClicked("Overall");
                break;
            case "This month":
                this.labelClicked("This year");
                break;
            case "This week":
                this.labelClicked("This month");
                break;
        }
    };

    renderItems = ({item, index}) => {
        if('ranking' in item) {
            let teamName = "";
            item.name.trim().split(' ').forEach(str=>{
                teamName = teamName + str.charAt(0);
            });
            return(
                <LeaderBoardRow
                    is_current_user={item.is_current_users_team}
                    key={index}
                    index={(index+1).toString()}
                    rank={item.ranking}
                    isTeam={true}
                    teamProfile={teamName}
                    appTheme={this.props.appTheme}
                    name={(item.is_current_users_team)?"Your Team":item.name}
                    count={(this.state.countshow=="Overall")?item.porn_free_days.total:
                        (this.state.countshow=="This year")?item.porn_free_days.current_year:
                            (this.state.countshow=="This month")?item.porn_free_days.current_month:
                                (this.state.countshow=="This week")?item.porn_free_days.current_week:""}/>
            );
        }
        return null;
    };

    renderHeader = (isLoader = false) => {
        let loader = null;
        if(isLoader){
            let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
            loader = <ActivityIndicator
                animating={true}
                style={{marginTop:30}}
                size="small"
                color={appColor.activityIndicator}/>
        }
        return <View>
            <TopBarComponent onSwipeLeft={this.onSwipeLeft}
                             labelClicked={this.labelClicked}
                             countshow={this.state.countshow}
                             appTheme={this.props.appTheme}
                             onSwipeRight={this.onSwipeRight}/>
            {loader}
        </View>
    };

    footerView = () => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <View style={{marginBottom:90, marginTop:20}}>
                <Text style={{color:appColor.leaderBoardFooter, fontFamily:Constant.font500, fontSize:12, lineHeight:18,
                    textAlign:'center',marginLeft: 15, marginRight:15}}>
                    {"Results limited to the top 100 rankings (or less if multiple teams share the same ranking)."}
                </Text>
            </View>
        )
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const listData = (this.state.countshow=="Overall")?this.props.teamLeaderBoard.overall:
            (this.state.countshow=="This year")?this.props.teamLeaderBoard.year:
                (this.state.countshow=="This month")?this.props.teamLeaderBoard.month:
                    (this.state.countshow=="This week")?this.props.teamLeaderBoard.week:[];
        return (
            <View style={[styles.container,{backgroundColor: appColor.scrollableViewBack}]}>
                <FlatList removeClippedSubviews={false}
                          data={listData}
                          automaticallyAdjustContentInsets={false}
                          ListFooterComponent={this.footerView}
                          ListHeaderComponent={this.renderHeader(listData.length == 0)}
                          renderItem={this.renderItems}
                          keyExtractor={(item, index) => {
                              return index+""
                          }}
                          initialNumToRender={10}
                          windowSize={5}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
    content: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: Constant.font500,
    },
});

const mapStateToProps = state => {
    return {
        teamLeaderBoard:state.team.teamLeaderBoard,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    getleaderboardTeamList,getLeaderBoardTeamFilterData
})(LeaderboardTeamTab);