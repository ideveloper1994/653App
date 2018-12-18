import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    Image,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import LeaderboardIndividualTab from './leaderboardIndividualTab';
import LeaderboardTeamTab from './leaderboardTeamTab';
import { connect } from 'react-redux';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

//const renderTabBar = props => (<DefaultTabBar {...props} style={{ borderBottomWidth: 0,height:(Constant.isIOS) ? 80 : 60 }} />);
import CustomTabbar from '../../../commonComponent/customTabBar';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";

const renderTabBar = props => (<CustomTabbar {...props} style={{ borderBottomWidth: 0,height:(Constant.isIOS) ? 80 : 60}}/>);
const renderLightTabBar = props => (<CustomTabbar {...props} style={{ height:(Constant.isIOS) ? 80 : 60, borderBottomWidth:1,
    borderColor:"#e4e4e4" }} />);

class Leaderboard extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
     }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{backgroundColor: appColor.appBackground}]}>
                <View style={[styles.container,{paddingTop:this.props.safeAreaInsetsData.top}]}>
                    <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                       style={{backgroundColor:appColor.scrollableViewBack}}
                                       tabBarUnderlineStyle={{backgroundColor:Constant.lightBlueColor}}
                                       renderTabBar={this.props.appTheme === Constant.darkTheme && renderTabBar || renderLightTabBar}
                                       tabBarActiveTextColor={appColor.scrollableActiveFont}
                                       tabBarTextStyle={{fontFamily:Constant.font500,fontSize:14, alignSelf: 'center',
                                           paddingTop: (Constant.isIOS) ? 30 : 15}}
                                       tabBarInactiveTextColor={appColor.scrollableInactiveFont}
                                       initialPage={this.props.navigation.state.params.selectedTab || 0}
                                       prerenderingSiblingsNumber={Infinity}>
                        <LeaderboardIndividualTab tabLabel="Individual" {...this.props}/>
                        <LeaderboardTeamTab tabLabel="Team" {...this.props}/>
                    </ScrollableTabView>
                </View>

                <TouchableHighlight onPress={() => this.props.navigation.goBack()}
                                    style={{height:40,width:40,bottom: 20,alignSelf: 'center',position: 'absolute'}}
                                    underlayColor={Constant.transparent}>
                    <Image source={{uri:'leaderboard_close'}}
                           style={[styles.closeImg, {tintColor:appColor.leaderBoardClose}]}
                           resizeMode={"contain"}/>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeImg:{
        height:40,
        width:40,
        alignSelf: 'center',
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {

})(Leaderboard);