import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Alert,
    AsyncStorage, BackHandler,
    Platform, PushNotificationIOS, NativeModules
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Constant from '../../../../../helper/constant';
import NavigationBar from '../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from './components/settingHeader';
import SettingRow from './components/mainSettingRow';
import SettingRedtBtn from './components/settingRedBtton';
import * as StoreReview from 'react-native-store-review';
import Rate, { AndroidMarket } from 'react-native-rate';
import { removeSafeArea, setAppTheme, resetStoreData } from "../../../../../actions/userActions";
import TouchID from "react-native-touch-id";
import _ from 'lodash';
import {resetAllAsyncStorageData, showThemeAlert} from "../../../../../helper/appHelper";
let NativeCallback = NativeModules.checkBundle;

let settingDetails = [
    {"APPEARANCE":[
            {title: 'Light theme', isSwitch: true, value: false},
        ]},
    {"PROFILE":[
            {title: 'Your profile', pageName: 'settingProfile'},
            {title: 'Your motivation', pageName: 'settingMotivation'},
            {title: 'Checkup time', pageName: 'checkupTime'},
        ]},
    {"CALENDAR":[
            {title: 'Edit porn calendar', pageName: 'editPornCalendar'},
            {title: 'Edit masturbation calendar', pageName: 'editMasturbationCalendar'},
            // {title: 'Edit streaks', pageName: 'editStreaks'},
        ]},
    {"NOTIFICATIONS":[
            {title: 'Notification settings', pageName: 'notifications'},
            // {title: 'Relapse predictions', isSwitch: true, value: false},
        ]},
    {"EXERCISES":[
            {title: 'Today screen exercises', pageName: 'optionalExercises'},
            {title: 'Meditation time', pageName: 'meditationTime'},
        ]},
    {"SECURITY":[
            {title: 'PIN and Device ID', isSwitch: true, value: false},
        ]},
    {"ABOUT":[
            {title: 'Help and FAQ', pageName: 'helpFAQ'},
            {title: 'Rate Brainbuddy', isONlyText: true},
            {title: 'Contact us', pageName: 'contactUs'},
        ]},
    {"TERMS":[
            {title: 'Subscription details', pageName: 'subscriptionDetail'},
            {title: 'Terms of use', pageName: 'termsOfUse'},
        ]},
    {"PRIVACY":[
            {title: 'Privacy policy', pageName: 'privacyPolicy'},
            {title: 'Your account data', pageName: 'accountData'},
        ]},
    {"ADVANCED":[
            {title: 'Diagnostics', pageName: 'enterDiagnosticsPin'},
            {title: 'Reset', pageName: 'reset'},
        ]},
    {"ACCOUNT":[]},
    // {"CHECKUP":[
    //     {title: 'Checkup reminders', isSwitch: true, value: true},
    // ]},
];
var deviceId='PIN and Device ID';

class Settings extends Component {

    constructor(props){
        super(props);
        this.state = {
            settingDetail : settingDetails,
        };
    }

    componentWillMount() {
        let alteredData = this.state.settingDetail;
        if((Constant.isANDROID && Platform.Version >= 23) || Constant.isIOS){
            try{
                TouchID.isSupported()
                    .then(biometryType => {
                        if(biometryType === 'FaceID') {
                            deviceId='PIN and Face ID';
                        } else if(biometryType === 'TouchID' || biometryType) {
                            deviceId = 'PIN and Touch ID';
                        }
                        alteredData[4].SECURITY[0].title = deviceId;
                        this.setState({
                            settingDetail : alteredData
                        });
                    })
                    .catch(error => {
                    });
            }catch (e){
            }
        }
        this.setValue();
        try{
            let alteredData = this.state.settingDetail;
            alteredData[0].APPEARANCE[0].value = this.props.appTheme === Constant.lightTheme;
            this.setState({
                settingDetail: alteredData
            });
        }catch(e){

        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };
    componentWillUnmount(){
        this.props.removeSafeArea(true);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillReceiveProps(){
        this.setValue();
    }

    onBackButtonPress = () => {
        this.props.removeSafeArea(true);
        this.props.navigation.goBack();
    };

    onRowSelect = (objRowData) => {
        try{
            if(objRowData.title.includes("ID")) {
                let alteredData = this.state.settingDetail;
                if(alteredData[5].SECURITY[0].value) {
                    AsyncStorage.removeItem('secure');
                    alteredData[5].SECURITY[0].value = !alteredData[5].SECURITY[0].value
                }else{
                    this.props.navigation.navigate('enterPinCard', {setValue: this.setValue,
                        transition: "myCustomSlideRightTransition"});
                }
                this.setState({
                    settingDetail: alteredData
                })
            }else if(objRowData.title == "Rate Brainbuddy") {
                if(Constant.isIOS){
                    if (StoreReview.isAvailable) {
                        StoreReview.requestReview();
                    }
                }else{
                    let options = {
                        GooglePackageName:"com.brainbuddy.android",
                        preferredAndroidMarket: AndroidMarket.Google,
                        preferInApp:false,
                    };
                    Rate.rate(options, (success)=>{
                        if (success) {
                            //rated
                        }
                    })
                }
            }else if(objRowData.title == "Light theme") {
                let alteredData = this.state.settingDetail;
                alteredData[0].APPEARANCE[0].value = !alteredData[0].APPEARANCE[0].value
                this.setState({
                    settingDetail: alteredData
                });
                if(alteredData[0].APPEARANCE[0].value){
                    this.props.setAppTheme(Constant.lightTheme);
                }else{
                    this.props.setAppTheme(Constant.darkTheme);
                }
            }else if(objRowData.pageName){
                const pageName = objRowData.pageName + "Card"
                this.props.navigation.navigate(pageName,{
                    transition: "myCustomSlideRightTransition"
                });
            }
        }catch(e){
        }
    };

    setValue = () => {
        try{
            AsyncStorage.getItem("secure").then((value) => {
                let alteredData = this.state.settingDetail;
                if(value) {
                    alteredData[5].SECURITY[0].value = true;
                }else{
                    alteredData[5].SECURITY[0].value = false;
                }
                this.setState({
                    settingDetail: _.cloneDeep(alteredData)
                });
            });
        }catch(e){
        }
    };

    getInterNetFilterTitle = () => {
        try{
            let kBlockList = "blockAllList";
            let kBlockWebsite = "websites";
            let kBlockKeyword = "keywords";
            if(this.props.internetFilterList[2][kBlockKeyword][0].allKeywords.length !== 0 ||
                this.props.internetFilterList[1][kBlockWebsite][0].allWebSite.length !== 0 ||
                this.props.internetFilterList[0][kBlockList][0].value){
                return "Internet filter";
            }else{
                return "Setup internet filter";
            }
        }catch(e){
            return "Setup internet filter";
        }
    }

    onLogoutPress = () => {
        showThemeAlert({
            title: "",
            message: "Are you sure you want to log out?",
            leftBtn: "Cancel",
            leftPress: ()=>{
            },
            rightBtn: "Logout",
            styleRight: 'destructive',
            rightPress: ()=>{
                if(Constant.isIOS){
                    PushNotificationIOS.setApplicationIconBadgeNumber(0);
                    NativeCallback.setTodayWidget(JSON.stringify({isLogin:"NO"}));
                }
                this.props.resetStoreData();
                resetAllAsyncStorageData();
                this.props.navigation.navigate('welcome');
            },
        });
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Settings'/>

                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    {
                        this.state.settingDetail.map((objSetting, index) => {
                            let headerTitle = Object.keys(objSetting);
                            return (
                                <View key={index}>
                                    <SettingHeader headerTitle={headerTitle[0]}/>
                                    {
                                        objSetting[headerTitle[0]].map((objRow, index) => {
                                            return <SettingRow rowData={objRow}
                                                               onRowSelect={this.onRowSelect}
                                                               key={index}/>
                                        })
                                    }
                                </View>
                            )
                        })
                    }
                    <SettingRedtBtn title="Logout" onPress={this.onLogoutPress}/>
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
        internetFilterList:state.user.internetFilterList,
        appTheme: state.user.appTheme || Constant.darkTheme
    };
};

export default connect(mapStateToProps, {
    resetStoreData,
    setAppTheme,
    removeSafeArea
})(Settings);