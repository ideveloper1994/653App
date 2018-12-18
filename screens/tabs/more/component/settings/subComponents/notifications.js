import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    PushNotificationIOS,
    Alert,
    Linking, BackHandler, LayoutAnimation, AsyncStorage
} from 'react-native';
import SelectInput from 'react-native-select-input-ios';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import SettingRow from '../components/mainSettingRow';
import DoNotDisturb from '../components/doNotDisturb';
import OptionRow from '../components/multipleOptionSelection';
import PickerComponent from '../../../../../commonComponent/modelPickerComponent'
import {
    setNotification, setUpLocalNotificationAlerts, setTeamChatNotification,
    updateUserDetail, setDoNotDisturbEnable
} from '../../../../../../actions/userActions';
import {updateMetaDataNoCalculation} from '../../../../../../actions/metadataActions';
import {resetAllAsyncStorageData, showThemeAlert} from "../../../../../../helper/appHelper";
import _ from 'lodash';

let settingTeamChatNotifications = [
    {title: 'Normal', isSelected: true, value: 'long'},
    {title: 'Discreet', isSelected: false, value: 'discreet'},
    {title: 'None', isSelected: false, value: 'none'},
];

class Notifications extends Component {

    constructor(props){
        super(props);
        this.state = {
            settingNotifications: props.settingNotifications,
            selectedTime: props.settingNotifications[2].selectedTime || "8am",
            settingTeamChatNotifications: props.settingTeamChatNotifications || settingTeamChatNotifications,
            replyToPost: {title: 'Replies to your posts', isSelected: true},
        }
    }

    componentWillMount() {
        AsyncStorage.getItem("ReplyToPostsNotification").then(res=>{
            if(res) {
                let isSelected = res == "true";
                if(!isSelected) {
                    this.setState({
                        replyToPost: {title: 'Replies to your posts', isSelected: false}
                    });
                }
            }
        });
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
        this.props.setUpLocalNotificationAlerts();
    };

    onRowSelect = (mainKey, objData) => {
        if(this.state.settingNotifications[mainKey].isSelected){
            this.performChanges(mainKey);
        }else{
            if(Constant.isIOS){
                this.showNotificationAllowAlert(mainKey);
            }else{
                this.performChanges(mainKey);
            }
        }
    };

    performChanges = (mainKey) => {
        let data = this.state.settingNotifications;
        data[mainKey].isSelected = !data[mainKey].isSelected;
        this.setState({
            settingNotifications: data
        });
        this.props.setNotification(data);
    };

    showNotificationAllowAlert = (mainKey, type = "") => {
        PushNotificationIOS.checkPermissions(res=>{
            if(res.alert == 1) {
                if(type === "chat"){
                    this.performChangesForTeamChat(mainKey);
                }else{
                    this.performChanges(mainKey);
                }
            }else{
                showThemeAlert({
                    title: "App Permission Denied",
                    message: "To re-enable, please go to Settings and turn on Notification Service.",
                    leftBtn: "Cancel",
                    styleLeft: 'destructive',
                    leftPress: ()=>{
                    },
                    rightBtn: "Settings",
                    rightPress: ()=>{
                        Linking.canOpenURL('app-settings:').then(supported => {
                            Linking.openURL('app-settings:')
                        }).catch(error => {
                        })
                    },
                });
            }
        });
    }

    //For team chat
    onSelecteTeamChatRow = (mainKey, objData) => {
        if(this.state.settingTeamChatNotifications[mainKey].isSelected){
            this.performChangesForTeamChat(mainKey);
        }else{
            if(Constant.isIOS){
                this.showNotificationAllowAlert(mainKey,"chat");
            }else{
                this.performChangesForTeamChat(mainKey);
            }
        }
    }

    updateUserDetails = (type) => {
        let obj = this.props.userDetails;
        if(obj.notification_type !== type){
            obj.notification_type = type;
            this.props.updateUserDetail(obj);
        }
    };

    performChangesForTeamChat = (mainKey) => {
        let data = this.state.settingTeamChatNotifications;
        data.forEach((obj,index)=>{
            data[index].isSelected = false;
        })
        data[mainKey].isSelected = !data[mainKey].isSelected;
        this.setState({
            settingTeamChatNotifications: data
        });
        this.props.setTeamChatNotification(data);

        this.updateUserDetails(data[mainKey].value);
    };

    getTimePickerOptions = () => {
        return [
            { value: "4am", label: '4am'},
            { value: "5am", label: '5am'},
            { value: "6am", label: '6am'},
            { value: "7am", label: '7am'},
            { value: "8am", label: '8am'},
            { value: "9am", label: '9am'},
            { value: "10am", label: '10am'},
            { value: "11am", label: '11am'},
            { value: "12pm", label: '12pm'},
        ];
    };

    //On done button press in picker
    onSubmitEditing = (value) => {
        let data = this.state.settingNotifications;
        data[2].selectedTime = value;
        this.setState({
            settingNotifications: data,
            selectedTime: value
        });
        this.props.setNotification(data);
    };

    onMuteTeamMember = () => {
        this.props.navigation.navigate("muteTeamMemberNotificationCard",
            {transition: "myCustomSlideRightTransition"});
    }

    onDonotDistubSwitch = () => {
        LayoutAnimation.linear();
        let data = _.cloneDeep(this.props.doNotDisturb);
        if(data.isSelected){
            this.props.updateMetaDataNoCalculation({
                do_not_disturb_start: null,
                do_not_disturb_end: null
            });
        }else{
            this.props.updateMetaDataNoCalculation({
                do_not_disturb_start: this.props.do_not_disturb_start,
                do_not_disturb_end: this.props.do_not_disturb_end
            });
        }
        data.isSelected = !data.isSelected;
        this.props.setDoNotDisturbEnable(data);

    }

    onDonotDistub = () => {
        this.props.navigation.navigate("doNotDisturbNotificationCard",
            {transition: "myCustomSlideRightTransition"});
    }

    getTimeTitle = () => {
        let start = this.props.do_not_disturb_start;
        let end = this.props.do_not_disturb_end;
        if(start > 12){
            start = (start - 12) + ' PM';
        }else{
            if(start == 0){
                start = "12 PM";
            }else{
                start = start + ' AM';
            }
        }
        if(end > 12){
            end = (end - 12) + ' PM';
        }else{
            if(end == 0){
                end = '12 PM';
            }else{
                end = end + ' AM';
            }
        }
        return start + "\n" + end;
    }

    onSelecteReplyToPost = (i, data) => {
        let rowData = data;
        rowData.isSelected = !rowData.isSelected;
        this.setState({
            replyToPost: rowData
        });
        if(data.isSelected){
            AsyncStorage.setItem("ReplyToPostsNotification", "true");
            this.props.updateMetaDataNoCalculation({
                wants_reply_notifications: true
            });
        }else{
            AsyncStorage.setItem("ReplyToPostsNotification", "false");
            this.props.updateMetaDataNoCalculation({
                wants_reply_notifications: false
            });
        }
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Notifications'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    <View>
                        <SettingHeader headerTitle={"REWIRING"}/>
                        {
                            this.state.settingNotifications.map((objRow, i) => {
                                return(
                                    <OptionRow rowData={objRow}
                                               mainIndex={i}
                                               onRowSelect={this.onRowSelect}
                                               key={i}/>
                                )
                            })
                        }
                        {
                            (this.state.settingNotifications[2].isSelected) &&
                            <View style={{height:45}}>
                                <View style={[styles.mainView,{position:'absolute',left:0, right:0, bottom:0, top:0}]}>
                                    <Text style={styles.rowTitle}>
                                        {"Notification time"}
                                    </Text>
                                    <Text style={styles.timeText}>
                                        {this.state.settingNotifications[2].selectedTime}
                                    </Text>
                                </View>
                                {
                                    (Constant.isANDROID) &&
                                    <PickerComponent items={this.getTimePickerOptions()}
                                                     dropDownStyle={{width:Constant.screenWidth-10,alignSelf:'center',margin:5}}
                                                     style={{marginTop:10,alignSelf:'center',width:'100%'}}
                                                     itemStyle={{textAlign:'right',paddingRight:15}}
                                                     textStyle={{color:'transparent'}}
                                                     selectedValue={''}
                                                     onValueChange={this.onSubmitEditing}
                                    />
                                    ||
                                    <SelectInput value={""}
                                                 style={{height:45, backgroundColor:'transparent'}}
                                                 options={this.getTimePickerOptions()}
                                                 onCancelEditing={() => console.log('onCancel')}
                                                 onSubmitEditing={this.onSubmitEditing.bind(this)}/>

                                }
                            </View>
                            || null
                        }
                        <SettingHeader headerTitle={"COMMUNITY"}/>
                        {
                            <OptionRow rowData={this.state.replyToPost}
                                       mainIndex={1}
                                       onRowSelect={this.onSelecteReplyToPost}/>
                        }
                        <SettingHeader headerTitle={"TEAM CHAT"}/>
                        {
                            this.state.settingTeamChatNotifications.map((objRow, i) => {
                                return(
                                    <OptionRow rowData={objRow}
                                               mainIndex={i}
                                               onRowSelect={this.onSelecteTeamChatRow}
                                               key={i}/>
                                )
                            })
                        }

                        <SettingHeader headerTitle={"Normal notifications will show the content of the message. Discreet notifications" +
                        " will hide the message content."}
                                       viewStyle={{paddingTop: 10, paddingBottom:25}}
                                       textStyle={{lineHeight: 21}}/>

                        <SettingRow rowData={{title: 'Do not disturb', isSwitch: true, value: this.props.doNotDisturb.isSelected}}
                                    onRowSelect={this.onDonotDistubSwitch}/>
                        {
                            (this.props.doNotDisturb.isSelected) &&
                            <DoNotDisturb onRowSelect={this.onDonotDistub} title={this.getTimeTitle()}/>
                        }
                        <SettingHeader headerTitle={""}/>

                        <SettingRow rowData={{title: 'Mute team members'}}
                                    onRowSelect={this.onMuteTeamMember}/>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

const MARGIN_SMALL = 8;
const MARGIN_LARGE = 16;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    },
    textView:{
        marginTop: 10,
        padding:10,
        fontSize: 15,
        color: '#000',
        minHeight: 100,
        fontFamily: Constant.font300,
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
        fontSize: 15,
        color: 'rgb(75,75,75)',
        fontFamily: Constant.font500,
        flex:1
    },
    timeText:{
        fontSize: 15,
        color: 'rgb(166,166,166)',
        fontFamily: Constant.font500,
    },
});

const mapStateToProps = state => {
    return {
        settingNotifications: state.user.settingNotifications,
        settingTeamChatNotifications: state.user.settingTeamChatNotifications,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        userDetails:state.user.userDetails,
        doNotDisturb:state.user.doNotDisturb,
        do_not_disturb_start: (state.metaData.metaData.do_not_disturb_start == null) && 22 || state.metaData.metaData.do_not_disturb_start,
        do_not_disturb_end: (state.metaData.metaData.do_not_disturb_end == null) && 7 || state.metaData.metaData.do_not_disturb_end,
    };
};

export default connect(mapStateToProps, {
    setNotification,
    setUpLocalNotificationAlerts,
    setTeamChatNotification,
    updateUserDetail,
    setDoNotDisturbEnable,
    updateMetaDataNoCalculation
})(Notifications);