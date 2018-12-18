import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    AsyncStorage,
    Modal
} from 'react-native';
import Constant from './../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import SettingRow from '../../components/mainSettingRow';
import OptionRow from '../../../../component/settings/components/optionRow';
import _ from 'lodash'
import moment from "moment/moment";
import PasscodeForBlock from './subComponent/passcodeForUnblock';

let subSettingsRow = [
    {title:'Block temporarily', dbValue:'temporary'},
    {title:'Block for one day', dbValue:'day'},
    {title:'Block for one week', dbValue:'week'},
    {title:'Block for one month', dbValue:'month'},
    {title:'Block for one year', dbValue:'year'},
    {title:'Block until filter passcode entered', dbValue:'passcode'},
];

class Blockduration extends React.PureComponent{

    constructor(props) {
        super(props);
        this.state = {
            blockRowTypes: subSettingsRow,
            settingDetail : props.internetFilterList,
            duration: "temporary",
            isWebSite: props.navigation.state.params.isWebSite,
            modalVisible: false
        };
    };

    componentWillMount() {
        AsyncStorage.getItem('preDuration').then((preDuration) => {
                if(preDuration){
                    let jsonObj = JSON.parse(preDuration);
                    this.setState({
                        duration: jsonObj.dbValue,
                });
        }});
    }

    onBackButtonPress = (dbVal = "") => {
        if(dbVal === ""){
            dbVal = this.state.duration;
        }
        let obj = _.find(subSettingsRow, {dbValue: dbVal});
        AsyncStorage.setItem("preDuration", JSON.stringify(obj));
        this.props.navigation.state.params.onSelectedDurationType(obj);
        this.props.navigation.goBack();
    };

    onSelectOption = (type, dbVal) => {
        if(dbVal === "passcode"){
            AsyncStorage.getItem("filterPasscode").then(passcode=>{
               if(!passcode){
                    this.setState({
                        modalVisible: true
                    });
               }else{
                    this.manageSelectOption(dbVal);
               }
            });
        }else{
            this.manageSelectOption(dbVal);
        }
    }

    manageSelectOption = (dbVal) => {
        this.setState({
            duration: dbVal
        },()=>{
            setTimeout(()=>{
                this.onBackButtonPress(dbVal);
            },300);
        });
    }

    onCloseModal = (isDone) => {
        if(isDone){
            this.manageSelectOption("passcode")
            setTimeout(()=>{
                this.setState({
                    modalVisible: false
                });
            },300);
        }else{
            this.setState({
                modalVisible: false
            });
        }

    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Block duration'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    <SettingHeader headerTitle={"BLOCK UNTIL"}/>
                    {
                        this.state.blockRowTypes.map((obj,index)=>{
                           return <OptionRow title={obj.title} key={index}
                                       dbValue={obj.dbValue}
                                       type="blockingSiteDuration"
                                       textColor={(obj.dbValue == this.state.duration ) && "rgb(75,75,75)" || 'gray'}
                                       onSelectOption={this.onSelectOption}
                                       value={this.state.duration}/>
                        })
                    }

                </ScrollView>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                <PasscodeForBlock onCloseModal={this.onCloseModal}/>
                </Modal>
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
        internetFilterList:state.user.internetFilterList,
    };
};

export default connect(mapStateToProps, {
})(Blockduration)