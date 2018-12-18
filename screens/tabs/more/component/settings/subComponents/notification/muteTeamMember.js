import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    AsyncStorage, BackHandler
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import OptionRowText from '../../components/optionRowWithText';
import {muteTeamMember, unMuteTeamMember} from "../../../../../../../actions/teamAction";
import _ from 'lodash';
import {showNoInternetAlert} from "../../../../../../../helper/appHelper";
let userIds = [];

class MuteTeamMember extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            todayScreenExercise: props.todayScreenExercise,
            memberArray: props.memberArray
        };
        userIds=[];
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
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onRowSelect = (rowData) => {
        if(this.props.isConnected){
            if(userIds.indexOf(rowData.id < 0)){
                userIds.push(rowData.id);
                if(rowData.current_user_has_muted){
                    this.props.unMuteTeamMember(rowData.id).then(res=>{
                        let indexOfId = userIds.indexOf(rowData.id);
                        userIds.splice(indexOfId,1);
                    }).catch(err=>{
                        let indexOfId = userIds.indexOf(rowData.id);
                        userIds.splice(indexOfId,1);
                    });
                }else {
                    //Mute
                    this.props.muteTeamMember(rowData.id).then(res=>{
                        let indexOfId = userIds.indexOf(rowData.id);
                        userIds.splice(indexOfId,1);
                    }).catch(err=>{
                        let indexOfId = userIds.indexOf(rowData.id);
                        userIds.splice(indexOfId,1);
                    });
                }
            }
        }else{
            showNoInternetAlert();
        }
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Mute team members'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>

                    <SettingHeader headerTitle={"TAP TO MUTE"}/>
                    {
                        this.props.memberArray.map((obj,index)=>{
                            let rowText = "";
                            if((obj.mute && obj.mute.current_user_has_muted) || obj.current_user_has_muted) {
                                rowText = "Muted"
                            }
                            return (!obj.is_current_user) &&
                                <OptionRowText onSelectOption={this.onRowSelect}
                                               title={obj.name}
                                               key={index}
                                               rowData={obj}
                                               displayText={rowText} />
                                || null
                        })
                    }

                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        memberArray:state.team.memberArray,
        isConnected: state.user.isConnected,
    };
};

export default connect(mapStateToProps, {
    muteTeamMember, unMuteTeamMember
})(MuteTeamMember);
