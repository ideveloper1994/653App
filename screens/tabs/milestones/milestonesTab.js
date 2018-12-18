import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import Constant from '../../../helper/constant';
import PostAdvice from './postAdvice';
import HelpOthers from './helpOthers';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import {getHelpPostDetail} from "../../../actions/helpPostActions";
import {getAdviceDetail} from "../../../actions/postAdviceAction";
import {getEventsDetails,getMemberDetail} from "../../../actions/teamAction";
import CustomTabbar from '../../commonComponent/customTabBar';
let isGoToCommunity = false;
import {find} from 'lodash';
import {EventRegister} from "react-native-event-listeners";

class MilstoneTab extends Component {

    constructor(props){
        super(props);
        this.state={
            isLoad: false
        };
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.navigation.state.params && nextProps.navigation.state.params.goToCommunity && !isGoToCommunity){
            isGoToCommunity = true;
            this.onPressCommunityProfileIcon(true);
        }
        // if(nextProps.visibleTab == "milestone"){
        //     this.loadThisScreen();
        // }
    }

    componentWillMount () {
        // console.log("-----------milestoneTab-----------");
        // EventRegister.removeEventListener(this.milestoneTab);
        // this.milestoneTab = EventRegister.addEventListener('milestoneTab', (data) => {
        //     this.loadThisScreen();
        // });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.milestoneTab);
    }

    loadThisScreen = () => {
        if(this.state.isLoad)
            return;
        this.setState({
            isLoad: true
        });
        console.log("-----------milestoneTab Load-----------");
    }

    renderTabBar = () => {
        if(this.props.appTheme === Constant.darkTheme){
            return <CustomTabbar {...this.props} style={{ borderBottomWidth: 0,height:(Constant.isIOS) ? 80 : 60}} showCommunity={true}
                                 onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}/>
        }
        return <CustomTabbar {...this.props} style={{ height:(Constant.isIOS) ? 80 : 60, borderBottomWidth:1,
            borderColor:"#e4e4e4" }} showCommunity={true} onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}/>
    }

    onPressCommunityProfileIcon = (isFromNotification=false) => {
        let instance = null;
        if(this.props.userId){
            if(this.props.userCommunity){
                instance = this.props.userCommunity;
            }else{
                let data = find(this.props.memberArray,{id:this.props.userId});
                if(data && data.name && data.name.includes("You (")){
                    data.name = data.name.substring(5,data.name.length-1);
                }
                if(data){
                    instance = data;
                    instance.hearts_count = 0;
                    instance.biography = "";
                }
            }
            this.props.navigation.navigate("communityProfile"+"Card",{transition: "myCustomSlideRightTransition", isCurrentUser:true,
                memberDetail: instance});
            this.props.getMemberDetail(this.props.userId,true).then(res=>{
                this.props.getEventsDetails(this.props.userId,null,true);
            });
        }
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{paddingTop:this.props.safeAreaInsetsData.top, backgroundColor: appColor.appBackground}]}>
                <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                   style={{backgroundColor: appColor.scrollableViewBack}}
                                   tabBarUnderlineStyle={{backgroundColor: Constant.lightBlueColor}}
                                   renderTabBar={this.renderTabBar}
                                   tabBarActiveTextColor={appColor.scrollableActiveFont}
                                   tabBarTextStyle={{
                                       fontFamily: Constant.font500, fontSize: 14, alignSelf: 'center',
                                       paddingTop: (Constant.isIOS) ? 30 : 15
                                   }}
                                   tabBarInactiveTextColor={appColor.scrollableInactiveFont}
                                   prerenderingSiblingsNumber={Infinity}>
                    <PostAdvice tabLabel="Share advice" {...this.props}/>
                    <HelpOthers tabLabel="Help others" {...this.props}/>
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Constant.backColor,
    },
});
const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme,
        userId: state.user.userDetails && state.user.userDetails.id || 0,
        // visibleTab: state.user.visibleTab,
        memberArray:state.team.memberArray,
        userCommunity: state.user.userCommunity || null,
    };
};

export default connect(mapStateToProps, {
    getHelpPostDetail,
    getAdviceDetail,
    getEventsDetails,
    getMemberDetail
})(MilstoneTab);