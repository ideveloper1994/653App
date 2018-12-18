import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Alert,
    AsyncStorage,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal
} from 'react-native';
import Constant from './../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import SettingRedtBtn from '../../components/settingRedBtton';
import SettingRow from '../../components/mainSettingRow';
import { manageInternetFilter} from "../../../../../../../actions/userActions";
import _ from 'lodash'
import moment from "moment/moment";
import EnterPasscodeForunblock from './subComponent/enterPasscodeForUnblock';

let kBlockList = "blockAllList";
let kBlockWebsite = "websites";
let kBlockKeyword = "keywords";

class AddKeyword extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedDurationType: {title:'Block temporarily', dbValue:'temporary'},
            isSelected: props.navigation.state.params.adultObj.value,
            isLeftDays: false,
            modalVisible: false
        };
    }

    componentWillMount() {
        if(this.props.navigation.state.params.adultObj.value){
            let date = this.props.navigation.state.params.adultObj.objDuration.endingDate;
            let date1 = moment(date,"YYYY-MM-DD HH:mm:ss").toDate()
            let daysLeft = moment(date1).diff(moment(), 'days');
            if(daysLeft >= 0 && this.props.navigation.state.params.adultObj.objDuration.duration !== "passcode"
                && !this.props.navigation.state.params.adultObj.isTemporaty){
                let formatedDate = moment(date1).format("MMMM D, YYYY");
                this.setState({
                    isLeftDays: true,
                    leftDayText: formatedDate,
                });
            }
        }else{
            AsyncStorage.getItem('preDuration').then((preDuration) => {
                if(preDuration){
                    let jsonObj = JSON.parse(preDuration);
                    this.setState({
                        selectedDurationType: jsonObj
                    });
                }else{
                    this.setState({
                        selectedDurationType: {title:'Block temporarily', dbValue:'temporary'},
                    });
                }
            });
        }

    }

    componentDidMount() {
    };

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    onTextChange = (text) => {
        this.setState({
            keyword: text.trim()
        });
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    }

    onDurationSelect = () => {
        this.props.navigation.navigate("blockDurationCard", {isWebSite: false,
            onSelectedDurationType: this.onSelectedDurationType,
            transition: "myCustomSlideRightTransition"});
    }

    onSelectedDurationType = (selectedDuration) => {
        this.setState({
            selectedDurationType: selectedDuration
        });
    }

    manageUnblockAdultWebsites = () => {
        let settingDetail = this.props.internetFilterList;
        let obj = this.props.internetFilterList[0][kBlockList][0];
        obj.value = false;
        obj.isTemporaty = false;
        settingDetail[0][kBlockList][0] = obj;
        this.props.manageInternetFilter(settingDetail);
        this.onBackButtonPress();
    }

    addToBlockList = () => {
        if(this.state.isSelected) {
            if(this.props.navigation.state.params.adultObj.objDuration.duration == "passcode") {
                this.setState({
                    modalVisible: true
                });
            }else if(this.props.navigation.state.params.adultObj.isTemporaty || !this.state.isLeftDays){
                this.manageUnblockAdultWebsites();
            }else{
                let title = "Adult websites Blocked";
                let description = "You cannot unblock adult websites before " + this.state.leftDayText;
                Alert.alert(title,
                    description,
                    [
                        {text: 'OK', onPress: () => {}},
                    ],
                );
            }
        }else{
        try{
            if(this.state.selectedDurationType.dbValue == "") {
                Alert.alert("Please select duration for block adult websites");
            }else {
                let settingDetail = this.props.internetFilterList;
                let obj = this.props.internetFilterList[0][kBlockList][0];
                let dbVal = this.state.selectedDurationType.dbValue;
                let startingDate = moment().format('YYYY-MM-DD HH:mm:ss');
                let endingDate = moment().format('YYYY-MM-DD HH:mm:ss');
                if (dbVal == 'day') {
                    endingDate = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
                } else if (dbVal == 'week') {
                    endingDate = moment().add(1, 'week').format('YYYY-MM-DD HH:mm:ss');
                } else if (dbVal == 'month') {
                    endingDate = moment().add(1, 'month').format('YYYY-MM-DD HH:mm:ss');
                } else if (dbVal == 'year') {
                    endingDate = moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
                } else if (dbVal == 'passcode') {
                }

                let daysLeft = moment(endingDate).diff(moment(startingDate), 'days');
                    obj.value = true;
                    obj.isTemporaty = dbVal == "temporary";
                    obj.objDuration = { duration: dbVal,
                    startingDate: startingDate, endingDate: endingDate, daysLeft: daysLeft}
                    settingDetail[0][kBlockList][0] = obj;
                    this.props.manageInternetFilter(settingDetail);
                    this.onBackButtonPress();
                }
        }catch (e){
            console.log("err - onselectOption", e);
         }
        }
    }

    onCloseModal = (isDone) => {
        if(isDone){
            this.manageUnblockAdultWebsites();
        }
        this.setState({
            modalVisible: false
        });
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title={(this.state.isSelected) && "Details" || 'Auto-block adult websites'}/>
                <SettingHeader headerTitle={"BLOCK DURATION"}/>

                {
                    (this.state.isSelected) &&
                    <View style={styles.mainView}>
                        <Text style={styles.rowTitle}>
                            {
                                (this.props.navigation.state.params.adultObj.objDuration &&
                                    this.props.navigation.state.params.adultObj.objDuration.duration == "passcode") &&
                                "Adult websites blocked until passcode entered" ||
                                (this.props.navigation.state.params.adultObj.isTemporaty || !this.state.isLeftDays) &&
                                "Adult websites blocked temporarily"
                                || "Adult websites blocked until " + this.state.leftDayText
                            }
                        </Text>
                    </View>
                    ||
                    <SettingRow rowData={this.state.selectedDurationType}
                                onRowSelect={this.onDurationSelect} />
                }

                <SettingHeader headerTitle={""} viewStyle={{height: 45}}/>

                <SettingRedtBtn title={(this.state.isSelected) && "Unblock" || "Block all adult websites"}
                                onPress={this.addToBlockList}/>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <EnterPasscodeForunblock onCloseModal={this.onCloseModal}/>
                </Modal>


            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    },
    containerStyle:{
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        height: 45,
        width:Constant.screenWidth,
        backgroundColor:'#FFF',
        paddingLeft:20,
        paddingRight:10,
    },
    mainView:{
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        height:45,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    rowTitle:{
        fontSize: 14,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        flex:1
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        internetFilterList:state.user.internetFilterList,
    };
};

export default connect(mapStateToProps, {
    manageInternetFilter
})(AddKeyword);