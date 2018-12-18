import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    PushNotificationIOS
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import Button from '../../../commonComponent/button';
// import PushNotification from 'react-native-push-notification';
import { setNotification,sendTagOneSignal } from '../../../../actions/userActions';

let counter = 1;

class CompleteSettingCheckup extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
        };
    }

    onButtonPress = () => {
        PushNotificationIOS.requestPermissions().then(res=>{
            if(res.alert == 1) {
                //allow
                this.props.sendTagOneSignal();
            }else{
                //don't allow
                let data = this.props.settingNotifications;
                data.forEach(obj=>{
                    obj.isSelected = false
                });
                this.props.setNotification(data);
            }
            this.props.navigation.navigate("showNotificationList");
        }).catch(res=>{
        });
        //this.askForPermission();
    };

    // async askForPermission() {
    //     if(counter > 1){
    //         this.props.navigation.navigate("showNotificationList");
    //         PushNotification.checkPermissions(res=>{
    //             if(res.alert == 1) {
    //                 //allow
    //             }else{
    //                 //don't allow
    //                 let data = this.props.settingNotifications;
    //                 data.forEach(obj=>{
    //                     obj.isSelected = false
    //                 });
    //                 this.props.setNotification(data);
    //             }
    //         });
    //     }
    //     counter += 1;
    //     PushNotification.configure({
    //         // (required) Called when a remote or local notification is opened or received
    //         onNotification: function(notification) {
    //         },
    //         // IOS ONLY (optional): default: all - Permissions to register.
    //         permissions: {
    //             alert: true,
    //             badge: true,
    //             sound: true
    //         },
    //         // Should the initial notification be popped automatically
    //         // default: true
    //         popInitialNotification: true,
    //         /**
    //          * (optional) default: true
    //          * - Specified if permissions (ios) and token (android and ios) will requested or not,
    //          * - if not, you must call PushNotificationsHandler.requestPermissions() later
    //          */
    //         requestPermissions: true,
    //     });
    // }

    render() {
        //this.props.navigation.state.params.checkupTime
        return (
            <View style={styles.container}>
                <View style={{flexDirection:'row', marginTop: Constant.screenHeight*0.17, alignItems: 'center'}}>
                    <Text style={{color:'#FFF', fontSize: 18, fontFamily: Constant.font300}}>
                        {"Checkup time set for "}
                    </Text>
                    <Text style={{color:'rgb(156,239,147)', fontSize: 18, fontFamily: Constant.font700}}>
                        {"dfg"}
                    </Text>
                </View>

                <View style={{flexDirection:'row', top: Constant.screenHeight*0.24, position: 'absolute',
                alignItems: 'center'}}>
                    <Text style={{color:'#a3b0b6', fontSize: 15, fontFamily: Constant.font500, textAlign:'center',lineHeight:22}}>
                        {"We'll remind you when it's time for your\ncheckup"}
                    </Text>
                </View>

                <View style={{top: Constant.screenHeight*0.4, position: 'absolute',height:74, width:300, alignSelf:'center'}}>
                    <View style={{flexDirection:'row',height:26, width:300, backgroundColor:'rgb(51,101,117)', alignItems:'center',
                    borderTopLeftRadius:10, borderTopRightRadius:10}}>
                        <Image source={{uri:'notification_icon'}}
                               style={{height:15, width:15, marginLeft:10}}
                               resizeMode={"contain"}/>
                        <Text style={{color:'#a1b2b9', fontSize: 12, fontFamily: Constant.font300, marginLeft:10, flex:1}}>
                            {"BRAINBUDDY"}
                        </Text>
                        <Text style={{color:'#a1b2b9', fontSize: 12, fontFamily: Constant.font300, marginRight:12}}>
                            {"Now"}
                        </Text>
                    </View>
                    <View style={{height:48, width:300, justifyContent:'center', backgroundColor:'rgb(26,82,101)', paddingLeft:15,
                    borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                        <Text style={{color:'#dfe3e6', fontSize: 13, fontFamily: Constant.font500}}>
                            {"It's time for your evening checkup!"}
                        </Text>
                    </View>
                </View>


                <View style={{top:Constant.screenHeight*0.8, left:0, right:0, bottom:0,
                     position: 'absolute'}}>
                    <Button title="Set checkup reminder"
                            backColor="rgb(118,192,187)"
                            color="#FFF"
                            onPress={this.onButtonPress}
                            otherStyle={{marginTop:0, width:"80%", height:60}}
                            otherTextStyle={{
                                    fontSize: 16,
                                    fontFamily: Constant.font700}}/>


                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor,
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        settingNotifications: state.user.settingNotifications,
    };
};

export default connect(mapStateToProps, {
    setNotification,sendTagOneSignal
})(CompleteSettingCheckup);