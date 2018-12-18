import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Keyboard, NativeModules
} from 'react-native';
import Constant from '../../../helper/constant';
import MyTeam from './component/myTeam';
import TeamChat from './component/teamChat';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import { getTeamDetail, getTeamChat } from '../../../actions/teamAction';
import { tabChanged } from '../../../actions/userActions';
import CustomTabbar from '../../commonComponent/customTabBar';
import {EventRegister} from "react-native-event-listeners";

const renderTabBar = props => (<CustomTabbar {...props} style={{ borderBottomWidth: 0,height:(Constant.isIOS) ? 80 : 60}}/>);
const renderLightTabBar = props => (<CustomTabbar {...props} style={{ height:(Constant.isIOS) ? 80 : 60, borderBottomWidth:1,
    borderColor:"#e4e4e4" }} />);

let nativeCall = (Constant.isIOS) && NativeModules.checkBundle || null;

class ShowTeam extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            changes: 0,
            selectedTab: 0,
            isLoad:false
        }
    }

    componentWillMount () {
        // console.log("-----------teamTab-----------");
        // EventRegister.removeEventListener(this.teamTab);
        // this.teamTab = EventRegister.addEventListener('teamTab', (data) => {
        //     this.loadThisScreen();
        // });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.teamTab);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.navigation.state && nextProps.navigation.state.params && nextProps.navigation.state.params.selectedTab){
            this.setState({
                selectedTab: 1
            })
            setTimeout(()=>{
                this.props.tabChanged("team");
                this.tabView.goToPage(1);
            },500);
            this.loadThisScreen();
        }
        // else if(nextProps.visibleTab == "team"){
        //     this.loadThisScreen();
        // }
    }

    loadThisScreen = () => {
        if(this.state.isLoad)
            return;
        this.setState({
            isLoad: true
        });
        console.log("-----------teamTab Load-----------");
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{paddingTop:this.props.safeAreaInsetsData.top,flex:1,backgroundColor:appColor.appBackground}}>

                <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                   style={{backgroundColor: appColor.scrollableViewBack}}
                                   tabBarUnderlineStyle={{backgroundColor: Constant.lightBlueColor}}
                                   renderTabBar={this.props.appTheme === Constant.darkTheme && renderTabBar || renderLightTabBar}
                                   tabBarActiveTextColor={appColor.scrollableActiveFont}
                                   tabBarTextStyle={{
                                       fontFamily: Constant.font500, fontSize: 14, alignSelf: 'center',
                                       paddingTop: (Constant.isIOS) ? 30 : 15
                                   }}
                                   tabBarInactiveTextColor={appColor.scrollableInactiveFont}
                                   prerenderingSiblingsNumber={Infinity}
                                   initialPage={this.state.selectedTab}
                                   onChangeTab={(tab) => {
                                       if (Constant.isIOS) {
                                           nativeCall.manageKeyboard(true);
                                       }
                                       if (tab.i === 1) {
                                           this.setState({
                                               changes: Math.random()
                                           });
                                       } else {
                                           Keyboard.dismiss()
                                           if (Constant.isIOS) {
                                               nativeCall.manageKeyboard(false);
                                           }
                                           this.setState({
                                               changes: 0
                                           });
                                       }
                                   }}
                                   ref={(tabView) => {
                                       if (tabView != null) {
                                           this.tabView = tabView;
                                       }
                                   }}>
                    <MyTeam tabLabel="My team" {...this.props}/>
                    <TeamChat tabLabel="Team chat" {...this.props} labelText={this.state.changes}/>
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
        appBadgeCount: state.user.appBadgeCount,
        appTheme: state.user.appTheme,
        // visibleTab: state.user.visibleTab,
    };
};

export default connect(mapStateToProps, {
    getTeamDetail, getTeamChat, tabChanged
})(ShowTeam);