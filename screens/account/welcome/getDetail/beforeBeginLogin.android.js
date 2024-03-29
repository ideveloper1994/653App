import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    PushNotificationIOS,
    TouchableHighlight,
    BackHandler
} from 'react-native';
import BeforeBeginComponent from './beforeBeginComponent';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import {updateMetaData} from "../../../../actions/metadataActions";
import { updateUserDetail,setNotification,sendTagOneSignal } from '../../../../actions/userActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import AppStatusBar from '../../../commonComponent/statusBar';
let timeStr="6pm";
let pageNo = 0;

class BeforeBeginLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCheckupTime: 18,
            selectedRegion: "america",
            isFromLogin: props.navigation.state.params || false,
            isFirstName: props.userDetails.name == "Unknown",
            userDetails: props.userDetails,
            isReceivedProps: false,
            pageNum: 0,
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        this.refs.firstView.fadeIn(600);
    }

    componentWillReceiveProps (nextProps) {
        // if(!this.state.isReceivedProps) {
        //     this.setState({
        //         isFirstName: nextProps.userDetails.name == "Unknown",
        //         userDetails: nextProps.userDetails,
        //         isReceivedProps: true
        //     });
        // }
    }

    _handleBackPress = () => {
        // BackHandler.exitApp();
        this.onBackButtonPress();
        return true;
    };

    onPressNext = (selectedItem, type) => {
        pageNo = 0;
        let userObj = this.state.userDetails;
        switch (type){
            case "firstName":
                userObj.name = selectedItem;
                this.setState({
                    userDetails: userObj
                });
                this.props.updateUserDetail(userObj);
                pageNo=1;
                this.scrollToNextView(pageNo);
                break;
            case "checkup":
                this.setState({
                    selectedCheckupTime: selectedItem
                });
                this.setCheckupTime(selectedItem);
                this.showNotificationPopup(selectedItem);
                break;
            case "notification":
                pageNo= (this.state.isFirstName) && 3 || 2;
                this.scrollToNextView(pageNo);
                break;
            case "region":
                userObj.region = selectedItem;
                this.props.updateUserDetail(userObj);
                switch (this.state.selectedCheckupTime) {
                    case 19:
                        timeStr="7pm";
                        break;
                    case 20:
                        timeStr="8pm";
                        break;
                    case 21:
                        timeStr="9pm";
                        break;
                    case 22:
                        timeStr="10pm";
                        break;
                    case 23:
                        timeStr="11pm";
                        break;
                }
                if(userObj.avatar_id == 0) {
                    pageNo= (this.state.isFirstName) && 4 || 3;
                    this.scrollToNextView(pageNo);
                }else{
                    this.sendToNextView();
                }
                break;
            case "chooseAvatar":
                if(selectedItem == 1){
                    if(userObj.gender.includes("female")){
                        selectedItem = 46;
                    }
                }
                userObj.avatar_id = selectedItem;
                this.props.updateUserDetail(userObj);
                this.sendToNextView();
                break;
        }
    };

    sendToNextView = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        setTimeout(()=>{
            this.props.navigation.navigate("introTour",{checkupTime: timeStr});
        },200);
    };

    setCheckupTime = (time) => {
        this.props.updateMetaData({
            last_checkup_at: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            checkup_time: time,
        });
    };

    scrollToNextView = (pageNo) => {
        setTimeout(()=>{
            if(this.refs.mainScroll) {
                this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
            }
        },200);
    };

    //Ask for notification permission
    showNotificationPopup = (time) => {
        pageNo = (this.state.isFirstName) && 2 || 1;
        if(Constant.isIOS){
            PushNotificationIOS.requestPermissions().then(res=>{
                if(res.alert == 1) {
                    //allow
                    this.props.sendTagOneSignal();
                }else {
                    //don't allow
                    let data = this.props.settingNotifications;
                    data.forEach(obj=>{
                        obj.isSelected = false
                    });
                    this.props.setNotification(data);
                }
                setTimeout(()=>{
                    if(this.refs.mainScroll) {
                        this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
                    }
                },200);
            }).catch(res=>{
                setTimeout(()=>{
                    if(this.refs.mainScroll) {
                        this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
                    }
                },200);
            });
        }else{
            setTimeout(()=>{
                if(this.refs.mainScroll) {
                    this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
                }
            },200);
        }
    };

    onScroll = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        this.setState({
            pageNum: pageNum
        });
    };

    onBackButtonPress = () => {
        pageNo = pageNo - 1;
        if(this.refs.mainScroll) {
            this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <AppStatusBar backColor={"rgb(22,93,120)"}/>
                <ScrollView style={{flex:1}}
                            bounces={false}
                            pagingEnabled={true}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            onScroll={this.onScroll}
                            ref="mainScroll">
                    {
                        (this.state.isFirstName)
                        &&
                        <Animatable.View style={styles.outerView} ref="firstView">
                            <BeforeBeginComponent pickerItems={[]}
                                                  subTitle={"What is your first name?"}
                                                  type="firstName"
                                                  selectedDay={""}
                                                  onPressNext={this.onPressNext} />
                        </Animatable.View>
                        || null
                    }

                    <Animatable.View style={styles.outerView} ref="firstView">
                        <BeforeBeginComponent pickerItems={[]}
                                              subTitle={"At what time would you like your checkup each evening?"}
                                              type="checkup"
                                              selectedDay={18}
                                              onPressNext={this.onPressNext} />
                    </Animatable.View>

                    <View style={styles.outerView}>
                        <BeforeBeginComponent subTitle={"To modify the notifications you receive, visit the settings menu."}
                                              type="notification"
                                              userName={this.props.userDetails.name}
                                              onPressNext={this.onPressNext} />
                    </View>

                    <View style={styles.outerView}>
                        <BeforeBeginComponent pickerItems={[]}
                                              subTitle={"Select your region."}
                                              type="region"
                                              selectedDay={"america"}
                                              isLast={this.props.userDetails.avatar_id != 0}
                                              onPressNext={this.onPressNext} />
                    </View>

                    {
                        (this.props.userDetails.avatar_id == 0) &&
                        <View style={styles.outerView}>
                            <BeforeBeginComponent pickerItems={[]}
                                                  subTitle={"Finally, choose your avatar."}
                                                  type="chooseAvatar"
                                                  selectedDay={1}
                                                  onPressNext={this.onPressNext} />
                        </View>

                        || null
                    }

                </ScrollView>
                {
                    (pageNo > 0) &&
                    <TouchableHighlight onPress={() => this.onBackButtonPress()}
                                        style={[styles.backView,{paddingTop:10+this.props.safeAreaInsetsDefault.top}]}
                                        underlayColor={Constant.transparent}>
                        <Ionicons name='ios-arrow-back'
                                  size={35}
                                  color="rgba(255,255,255,0.7)"/>
                    </TouchableHighlight>
                    || null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgb(22,93,120)',
    },
    outerView:{
        height: Constant.screenHeight,
        width: Constant.screenWidth
    },
    backView:{
        height:60,
        width:60,
        position:'absolute',
        left:10,
        top:10,
        paddingLeft:5,
        backgroundColor: Constant.transparent
    },
});

const mapStateToProps = state => {
    return {
        userDetails: state.user.userDetails,
        settingNotifications: state.user.settingNotifications,
        safeAreaInsetsDefault:state.user.safeAreaInsetsDefault
    };
};

export default connect(mapStateToProps, {
    updateMetaData,
    updateUserDetail,
    setNotification,
    sendTagOneSignal
})(BeforeBeginLogin);