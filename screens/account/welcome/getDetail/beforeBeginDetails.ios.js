import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
    Image,
    ScrollView,
    PushNotificationIOS,
    TouchableHighlight
} from 'react-native';
import BeforeBeginComponent from './beforeBeginComponent';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {updateMetaData} from "../../../../actions/metadataActions";
import { updateUserDetail,setNotification,sendTagOneSignal } from '../../../../actions/userActions';
import {setBeforeBeginPornFreeDays, setBeforeBeginMasturbationFreeDays} from "../../../../actions/statisticAction";

import moment from "moment";

let timeStr="6pm";

class BeforeBeginDetails extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            arrDays: [],
            selectedPornDay: 0,
            selectedMasturbateDay: 0,
            selectedCheckupTime: 18,
            selectedRegion: "america",
            isFirstName: props.userDetails.name == "Unknown",
            userDetails: props.userDetails,
            isReceivedProps: false,
            pageNum: 0,
        };
    }

    componentWillMount() {
        let arr = [];
        for(let i = 0; i <= 365; i++) {
            arr.push(i);
        }
        this.setState({
            arrDays: arr
        });
    }

    componentDidMount() {
        this.refs.firstView.fadeIn(600);
    }

    componentWillReceiveProps (nextProps){
        // if(!this.state.isReceivedProps){
        //     this.setState({
        //         isFirstName: nextProps.userDetails.name == "Unknown",
        //         userDetails: nextProps.userDetails,
        //         isReceivedProps: true
        //     });
        // }
    }

    onPressNext = (selectedItem, type) => {
        let pageNo = 0;
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
            case "porn":
                pageNo= (this.state.isFirstName) && 2 || 1;
                this.setState({
                    selectedPornDay: selectedItem
                });
                this.scrollToNextView(pageNo);
                break;
            case "masturbate":
                this.setState({
                    selectedMasturbateDay: selectedItem
                });
                pageNo= (this.state.isFirstName) && 3 || 2;
                this.scrollToNextView(pageNo);
                break;
            case "checkup":
                pageNo= (this.state.isFirstName) && 4 || 3;
                this.setState({
                    selectedCheckupTime: selectedItem
                });
                this.setPornCalendar(this.state.selectedPornDay);
                this.setMasturbateCalendar(this.state.selectedMasturbateDay);
                this.setCheckupTime(selectedItem);
                this.showNotificationPopup(selectedItem);
                break;
            case "notification":
                pageNo= (this.state.isFirstName) && 5 || 4;
                this.scrollToNextView(pageNo);
                break;
            case "region":
                userObj.region = selectedItem;
                this.setState({
                    userDetails: userObj
                });
                this.props.updateUserDetail(userObj);
                switch (this.state.selectedCheckupTime){
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
                pageNo= (this.state.isFirstName) && 6 || 5;
                this.scrollToNextView(pageNo);
                break;
            case "chooseAvatar":
                if(selectedItem == 1){
                    if(userObj.gender.includes("female")){
                        selectedItem = 46;
                    }
                }
                userObj.avatar_id = selectedItem;
                this.props.updateUserDetail(userObj);
                setTimeout(()=>{
                    this.props.navigation.navigate("introTour", {checkupTime: timeStr});
                },200);
                break;
        }
    };


    scrollToNextView = (pageNo) => {
        setTimeout(()=>{
            if(this.refs.mainScroll) {
                this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
            }
        },200);
    };

    setPornCalendar = (day) => {
        let arrPornFree = [];
        if(day == 0) {
            //today
            let obj = {
                is_relapse: true,
                occurred_at: moment().format("YYYY-MM-DD")
            };
            arrPornFree.push(obj);
        }else if(day == 1) {
            //yesterday
        }else{
            let i=1;
            while(i<day){
                let obj = {
                    is_relapse: false,
                    occurred_at: moment().subtract(i, 'days').format("YYYY-MM-DD")
                };
                i++;
                arrPornFree.push(obj);
            }
        }
        if(arrPornFree.length > 0){
            this.props.setBeforeBeginPornFreeDays(arrPornFree);
        }

    };

    setMasturbateCalendar = (day) => {
        let arrMosturbateFree = [];
        if(day == 0) {
            let obj = {
                is_relapse: true,
                occurred_at: moment().format("YYYY-MM-DD")
            };
            arrMosturbateFree.push(obj);
            //today
        }else if(day == 1) {
        }else {
            let i=1;
            while(i<day){
                let obj = {
                    is_relapse: false,
                    occurred_at: moment().subtract(i, 'days').format("YYYY-MM-DD")
                };
                i++;
                arrMosturbateFree.push(obj);
            }
        }
        if(arrMosturbateFree.length > 0){
            this.props.setBeforeBeginMasturbationFreeDays(arrMosturbateFree);
        }
    };

    setCheckupTime = (time) => {
        this.props.updateMetaData({
            last_checkup_at: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            checkup_time: time,
        });
    };

    //Ask for notification permission
    showNotificationPopup = (time) => {
        let pageNo= (this.state.isFirstName) && 4 || 3;
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
    };

    onBackButtonPress = () => {
        let pageNo = this.state.pageNum - 1;
        if(this.refs.mainScroll) {
            this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
        }
    };

    onScroll = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        if(this.state.pageNum != pageNum){
            this.setState({
                pageNum: pageNum
            });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex:1}}
                            bounces={false}
                            pagingEnabled={true}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            onMomentumScrollEnd={this.onScroll}
                            ref="mainScroll">
                    {
                        (this.state.isFirstName)
                        &&
                        <Animatable.View style={styles.outerView} ref="firstView">
                            <BeforeBeginComponent pickerItems={this.state.arrDays}
                                                  subTitle={"What is your first name?"}
                                                  type="firstName"
                                                  selectedDay={""}
                                                  onPressNext={this.onPressNext} />
                        </Animatable.View>
                        || null
                    }

                    <Animatable.View style={styles.outerView} ref="firstView">
                        <BeforeBeginComponent pickerItems={this.state.arrDays}
                                              subTitle={"When did you last use porn?"}
                                              type="porn"
                                              selectedDay={0}
                                              onPressNext={this.onPressNext} />
                    </Animatable.View>

                    <View style={styles.outerView}>
                        <BeforeBeginComponent pickerItems={this.state.arrDays}
                                              subTitle={"When did you last masturbate?"}
                                              type="masturbate"
                                              selectedDay={0}
                                              onPressNext={this.onPressNext} />
                    </View>

                    <View style={styles.outerView}>
                        <BeforeBeginComponent pickerItems={[]}
                                              subTitle={"At what time would you like your checkup each evening?"}
                                              type="checkup"
                                              selectedDay={18}
                                              onPressNext={this.onPressNext} />
                    </View>

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
                                              onPressNext={this.onPressNext} />
                    </View>

                    <View style={styles.outerView}>
                        <BeforeBeginComponent pickerItems={this.state.arrDays}
                                              subTitle={"Finally, choose your avatar."}
                                              type="chooseAvatar"
                                              selectedDay={1}
                                              onPressNext={this.onPressNext} />
                    </View>

                </ScrollView>
                {
                    (this.state.pageNum) &&
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
    setBeforeBeginPornFreeDays,
    setBeforeBeginMasturbationFreeDays,
    setNotification,
    sendTagOneSignal
})(BeforeBeginDetails);