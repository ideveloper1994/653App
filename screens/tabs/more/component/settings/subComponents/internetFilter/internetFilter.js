import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    AsyncStorage,
    NativeModules,
    AppState,
    PushNotificationIOS,
    Text, Alert,
    Modal
} from 'react-native';
import Constant from './../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import SettingRow from '../../components/mainSettingRow';
import * as StoreReview from 'react-native-store-review';
import { removeSafeArea, manageInternetFilter} from "../../../../../../../actions/userActions";
import RowWithText from './rowWithText';
import _ from 'lodash'
import moment from "moment/moment";
import InternetFilterEnablePopup from './filterEnablePopUp';
import {callTodayScreenEcentListner} from "../../../../../../../helper/appHelper";
import InternetFilterHelp from './subComponent/internetFilterHelp';

let NativeInternetFilter = NativeModules.InternetFilter;

let kBlockList = "blockAllList";
let kBlockWebsite = "websites";
let kBlockKeyword = "keywords";

let kTitleBlockList = "BLOCK LIST";
let kTitleBlockWebsite = "BLOCK A WEBSITE URL";
let kTitleBlockKeyword = "BLOCK A URL KEYWORD";

let titleAutoblock = "Automatic block list disabled";
let titleAddWebSite = "Add website...";
let titleAddKeyword = "Add keyword...";

let iconImage = {
    adultWeb: {
        crossIcon:{
            iconImg: {uri:'filter_cross_icon'},
            backColor: Constant.verOrangeColor,
            imgsize: 11
        },
        tickIcon :{
            iconImg: {uri:'filter_tick_icon'},
            backColor: Constant.verColor,
            imgsize: 11
        }
    },
    addWeb: {
        iconImg: {uri:'filter_plus_icon'},
        backColor: Constant.orangeColor,
        imgsize: 10
    }
}

let internetFilterSetting = [
    {"blockAllList":[
            {title: "Automatic block list disabled", value: false, type: "blockList", objDuration:{
                    duration: "",
                    startingDate: "", endingDate: "", daysLeft: 0}
            },
        ]},
    {"websites":[
            {title: 'Add website...', pageName: 'blockWebsites', type: "website",
                allWebSite: []},
        ]},
    {"keywords":[
            {title: 'Add keyword...', pageName: 'blockKeywords', allKeywords: [], type: "keyword"},
        ]}
];

class InternetFilter extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            helpModalVisible: false
        };

    }

    componentWillMount() {
        callTodayScreenEcentListner(false);
        AppState.removeEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {
        if(this.props.navigation.state.params && this.props.navigation.state.params.scrollToTopToday) {
            setTimeout(()=>{
                this.props.navigation.state.params.scrollToTopToday();
            },1000)
        }
        try{
            this.checkForEnabledFilter();
        }catch (e){
        }
        this.setDoneFilterToday();
    }

    setDoneFilterToday = () => {
        if(this.props.navigation.state.params && this.props.navigation.state.params.isOptional){
            if(!this.props.navigation.state.params.isReplay) {
                AsyncStorage.setItem('isFilterOnToday',"true");
                this.props.navigation.state.params.onCompleteExercises(this.props.navigation.state.params.pageName);
            }
        }
    };

    componentWillReceiveProps (nextProps) {
    }

    _handleAppStateChange = (nextAppState) => {
        if(nextAppState === 'active'){
            this.checkForEnabledFilter();
        }else if(nextAppState === "background"){
        }
    };

    checkForEnabledFilter = () =>{
        try{
            NativeInternetFilter.checkIsFilterEnable((error, events) => {
                if(events == "NULL") {
                    setTimeout(()=>{
                        this.setState({showPopup: true});
                        // AsyncStorage.setItem("isFilterAlertShownOnce","true");
                    },500);
                    //AsyncStorage.setItem("isFilterAlertShownOnce","true");
                }else{
                    this.setState({showPopup: false});
                    if(this.props.navigation.state.params && this.props.navigation.state.params.isOptional){
                        // this.showAlertForAccess();
                        //     AsyncStorage.getItem('isFilterAlertShownOnce')
                        //         .then(isShown => {
                        //             if(!isShown){
                        //                 // this.setState({showPopup: true});
                        //                 AsyncStorage.setItem("isFilterAlertShownOnce","true");
                        //             }
                        //         }).catch(err=>{
                        //     });
                        // }else{
                        //     // this.setState({showPopup: false});
                    }
                }
            });
        }catch (e){
        }
    };

    componentWillUnmount() {
        callTodayScreenEcentListner();
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.props.removeSafeArea(true);
    }

    onBackButtonPress = () => {
        if(this.props.navigation.state.params && this.props.navigation.state.params.isOptional) {
            this.showAlertForAccess();
        }else{
            this.onBackToToday();
        }
    };

    onBackToToday = () => {
        this.props.removeSafeArea(true);
        callTodayScreenEcentListner();
        this.props.navigation.goBack();
    }

    renderWebsite = (objRow) => {
        let views = [];
        objRow.allWebSite.map((obj,i)=>{
            views.push(
                <RowWithText onRowSelect={this.webSiteRowSelect}
                             title={obj.name}
                             key={i}
                             rowIndex={i}
                             rightText={""}
                             imageText={obj.name.charAt(0).toUpperCase()}/>
            )
        });
        return (
            <View>
                <SettingRow rowData={Object.assign(objRow,{title: titleAddWebSite, isONlyText: false })}
                            onRowSelect={this.onAddWebsiteClicked}
                            icon={iconImage.addWeb}  />
                {views}
            </View>
        )
    }

    renderKeyword = (objRow) => {
        let views = [];
        objRow.allKeywords.map((obj,i)=>{
            views.push(
                <RowWithText onRowSelect={this.keyWordRowSelect}
                             title={obj.name}
                             key={i}
                             rowIndex={i}
                             rightText={""}
                             imageText={obj.name.charAt(0).toUpperCase()}/>
            )
        });
        return (
            <View>
                <SettingRow rowData={Object.assign(objRow,{title: titleAddKeyword, isONlyText: false})}
                            onRowSelect={this.onAddKeywordClicked}
                            icon={iconImage.addWeb}  />
                {views}
            </View>
        )
    }

    //Manage Adult
    managedAdultWebsite = () => {
        let obj = this.props.internetFilterList[0][kBlockList][0];
        this.props.navigation.navigate("blockAdultWebSiteCard", {adultObj: obj,
            transition: "myCustomSlideRightTransition"});
    }

    //Manage Website
    webSiteRowSelect = (index) => {
        try{
            let selectedData = this.props.internetFilterList[1][kBlockWebsite][0].allWebSite[index];
            this.props.navigation.navigate("filterDetailCard", {Website: selectedData, isWebSite: true,
                transition: "myCustomSlideRightTransition"});
        }catch (e){
            console.log("Err - webSiteRowSelect", e);
        }
    }

    onAddWebsiteClicked = () => {
        this.props.navigation.navigate("addWebsiteCard",{transition: "myCustomSlideRightTransition"});
    };

    //Manage Keyword
    keyWordRowSelect = (index) => {
        try{
            let selectedData = this.props.internetFilterList[2][kBlockKeyword][0].allKeywords[index];
            this.props.navigation.navigate("filterDetailCard", {Website: selectedData, isWebSite: false,
                transition: "myCustomSlideRightTransition"});
        }catch (e){
            console.log("Err - keyWordRowSelect", e);
        }
    }

    onAddKeywordClicked = () => {
        this.props.navigation.navigate("addKeywordCard",{
            transition: "myCustomSlideRightTransition"
        });
    }

    //Access from More tab
    showAlertForAccess = () => {
        AsyncStorage.getItem('isFilterAlertShownOnce')
            .then(isShown => {
                if(!isShown){
                    AsyncStorage.setItem("isFilterAlertShownOnce","true");
                    Alert.alert("You can access the internet filter at any time from the more tab.",
                        "",
                        [
                            {text: 'Got it', onPress: () => {
                                    this.onBackToToday();
                                }},
                        ],
                    );
                }else{
                    this.onBackToToday();
                }
            }).catch(err=>{
            this.onBackToToday();
        });
    }

    onPopUpButtonPress = () => {
        if(this.props.navigation.state.params && this.props.navigation.state.params.isOptional){
            this.showAlertForAccess();
        }else {
            this.onBackButtonPress();
        }
        // this.setState({showPopup: false});
    }

    onRowSelect = (rowData) => {
        const pageName = rowData.pageName;
        this.props.navigation.navigate(pageName,{
            transition: "myCustomSlideRightTransition"
        });
    }

    getBlockAdultWbsiteTitle = () => {
        try{
            let obj = this.props.internetFilterList[0][kBlockList][0];
            if(obj.value){
                if(obj.objDuration.duration === "passcode"){
                    return "Adult websites blocked until passcode entered";
                }else if(obj.isTemporaty){
                    return "Adult websites blocked";
                }
                let date = obj.objDuration.endingDate;
                let date1 = moment(date,"YYYY-MM-DD HH:mm:ss").toDate()
                let daysLeft = moment(date1).diff(moment(), 'days');
                if(daysLeft >= 0){
                    let formatedDate = moment(date1).format("MMMM D, YYYY");
                    return "Adult websites blocked until " + formatedDate;
                }
            }
        }catch (e){
            return titleAutoblock;
        }
        return titleAutoblock;
    }

    onShowHelp = () => {
        this.setState({
            helpModalVisible: true
        })
    }

    onClosePressHelp = () => {
        this.setState({
            helpModalVisible: false
        })
    }

    render() {
        let objIcon = (this.props.navigation.state.params && this.props.navigation.state.params.isOptional) ? {name:"md-close", size: 28} : null;
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               backIcon={objIcon}
                               rightButton={"Help"}
                               onRightBtnClick={this.onShowHelp}
                               title='Internet Filter'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    {
                        this.props.internetFilterList.map((objSetting, index) => {
                            let headerTitle = Object.keys(objSetting);
                            let headerKey = kTitleBlockList;
                            if(headerTitle[0] === kBlockKeyword){
                                headerKey = kTitleBlockKeyword;
                            }else if(headerTitle[0] === kBlockWebsite){
                                headerKey = kTitleBlockWebsite
                            }
                            return (
                                <View key={index}>
                                    <SettingHeader headerTitle={headerKey}/>
                                    {
                                        objSetting[headerTitle[0]].map((objRow, i) => {
                                            if(objRow.type && objRow.type == "website"){
                                                return this.renderWebsite(objRow);
                                            }else if(objRow.type && objRow.type == "keyword"){
                                                return this.renderKeyword(objRow);
                                            }
                                            return <SettingRow rowData={Object.assign(objRow,
                                                {isONlyText: false, isSwitch: false, title: this.getBlockAdultWbsiteTitle()})}
                                                               onRowSelect={this.managedAdultWebsite}
                                                               key={i}
                                                               icon={(this.props.internetFilterList[0].blockAllList[0].value)
                                                               && iconImage.adultWeb.tickIcon || iconImage.adultWeb.crossIcon }
                                            />
                                        })
                                    }
                                </View>
                            )
                        })
                    }
                    <View style={styles.bottomView}>
                        <Text style={styles.bottomText}>{"Having issues with blocking? Restart safari for changes to take effect."}</Text>
                    </View>
                </ScrollView>

                {(this.state.showPopup) &&
                <InternetFilterEnablePopup onPopUpButtonPress={this.onPopUpButtonPress}/>
                || null}


                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.helpModalVisible}>
                    <InternetFilterHelp safeAreaInsetsData={this.props.safeAreaInsetsData}
                                        onClosePress={this.onClosePressHelp}/>
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
    bottomView :{
        marginTop:24,
        paddingLeft:26,
        paddingRight:26,
        alignItems:'center',
        justifyContent:'center'
    },
    bottomText :{
        fontSize: 11,
        color: '#a4b6bf',
        fontFamily: Constant.font500,
        lineHeight:20,
        textAlign:'center'
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        internetFilterList:state.user.internetFilterList,
    };
};

export default connect(mapStateToProps, {
    removeSafeArea, manageInternetFilter
})(InternetFilter);