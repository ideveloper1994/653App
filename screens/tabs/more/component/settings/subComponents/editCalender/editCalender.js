import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import PornCalender from './subComponents/pornCalender';
import MasturbationCalender from './subComponents/masturbationCalender';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { calculatePornDay,calculateMosturbationDay,calculateJournal } from '../../../../../../../actions/statisticAction';
import { getTeamDetail, getleaderboardTeamList, getleaderboardIndividualList } from '../../../../../../../actions/teamAction';

const renderTabBar = props => (<DefaultTabBar {...props} style={{ borderBottomWidth: 0,height:80 }} />);

class EditCalender extends React.PureComponent {

    constructor(props){
        super(props);
    }

    componentWillUnmount(){
        // this.props.getTeamDetail();
        // this.props.getleaderboardTeamList(true);
        // this.props.getleaderboardIndividualList(true);
    }

    render() {
        let appColor = Constant[this.props.appTheme];
        return (
            <View style={{flex:1}}>
                    <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                       style={{backgroundColor:appColor.scrollableViewBack}}
                                       tabBarUnderlineStyle={{backgroundColor:Constant.lightBlueColor}}
                                       renderTabBar={renderTabBar}
                                       tabBarActiveTextColor={appColor.scrollableActiveFont}
                                       tabBarTextStyle={{fontFamily:Constant.font500,fontSize:14, alignSelf: 'center',
                                           paddingTop: (Constant.isIOS) ? 30 : 15}}
                                       tabBarInactiveTextColor={appColor.scrollableInactiveFont}
                                       prerenderingSiblingsNumber={Infinity}>
                    <PornCalender tabLabel="Porn" {...this.props}/>
                    <MasturbationCalender tabLabel="Masturbation" {...this.props}/>
                </ScrollableTabView>
                <TouchableHighlight underlayColor={'transparent'}
                                    onPress={()=>{
                                        this.props.navigation.goBack();
                                        this.props.calculatePornDay(this.props.pornData);
                                        this.props.calculateMosturbationDay(this.props.masturbationData);
                                        this.props.calculateJournal(this.props.journalData);

                                    }}
                                    style={{position:'absolute',left:0,top:32,paddingRight:10, paddingLeft: 10}}>
                    <Ionicons name='ios-arrow-back'
                              size={35}
                              color="rgba(255,255,255,0.8)"/>
                </TouchableHighlight>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#efeff4',
        marginBottom: 10
    },
    titleStyle:{
        color:'#FFF',
        fontSize:13,paddingTop:15,
        alignSelf:'center',
        fontFamily: Constant.font500,
    },
    titleView:{
        padding:0,
        justifyContent:'center',
        alignItems:'center',

    },
    titleText:{
        color: '#FFFFFF',
        fontSize: 15,
        alignSelf:'center',
        fontFamily: Constant.font700,
    },
    outerView:{
        alignSelf:'center',
        justifyContent:'center',
        height:Constant.screenWidth/4,
        width:Constant.screenWidth/4,
        borderRadius:Constant.screenWidth/5,
        backgroundColor:Constant.backColor2
    },
});


const mapStateToProps = state => {
    return {
        pornData : state.statistic.pornDetail.p_array,
        masturbationData : state.statistic.mosturbutionDetail.m_array,
        journalData : state.statistic.j_array,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    calculatePornDay,
    calculateMosturbationDay,
    calculateJournal,
    getTeamDetail,
    getleaderboardTeamList, getleaderboardIndividualList
})(EditCalender);