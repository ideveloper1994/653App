import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing, Linking, Alert,
    TextInput
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import Button from '../../../commonComponent/button';
import _ from 'lodash';
import moment from 'moment';
import {addTeamChat} from "../../../../actions/teamAction";
import {showThemeAlert} from "../../../../helper/appHelper";

let isClicked = false;

class EncouragePopup extends Component {

    constructor(props) {
        super(props);
        const message = (props.memberDetail && props.memberDetail.days == 1)
            && "Congratulations on your 24 hour streak " + props.memberDetail.member.name + "!" ||
        "Congratulations on your "+ props.memberDetail.days +" days streak " + props.memberDetail.member.name + "!";
        this.state = {
            isEmptyMessage: message.length == 0,
            messageText: message,
        }
        this.offset = new Animated.Value(Constant.screenHeight);
    }

    componentWillMount() {
        isClicked = false;
    }

    componentDidMount() {
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),
            toValue: 0,
            useNativeDriver: true
        }).start();
    }

    hidePopup = () => {
        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(()=>{
            this.props.onHidePopup()
        });
    };

    onTextChange = (text) => {
        let message = text.toString().trim();
        this.setState({
            isEmptyMessage: message.length === 0,
            messageText: text
        });
        if(message.length >= 200){
            showThemeAlert({title:"Character limit reached",
                message:"Maximum 200 characters allowed",
                leftBtn: "OK"});
        }
    };

    onMessageSend = () => {
        try{
            if(this.state.isEmptyMessage){
                showThemeAlert({title:"Please enter a message",
                    leftBtn: "OK"});
            }else{
                let message = (this.props.memberDetail && this.props.memberDetail.days == 1) && "24 hour streak" ||
                    this.props.memberDetail.days + " day streak";
                let obj = {
                    content: this.state.messageText,
                    recipient_user_id: this.props.memberDetail.member.id,
                    supplementary_content: this.props.userName + " congratulated "+ this.props.memberDetail.member.name +" on his " + message
                }
                this.props.addTeamChat(obj, "Congratulate",this.props.memberDetail.id);
                this.hidePopup()
            }
        }catch (e){
            console.log("error - onMessageSend", e)
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <View style={styles.outerView}>
                <View style={[styles.transparentView,{backgroundColor: appColor.todayPopupBackgroundColor,
                    opacity: appColor.todayPopupBackOpacity}]}/>
                <TouchableHighlight style={{top:0, left:0, right:0, bottom:0, position: 'absolute'}}
                                    underlayColor={Constant.transparent} onPress={this.hidePopup}
                                    activeOpacity={0}>
                    <View/>
                </TouchableHighlight>
                <Animated.View style={[styles.innerPopupView,{transform: [{translateY: this.offset}]}]}>
                    <Text style={styles.topTitle}>
                        {"Congratulate " + this.props.memberDetail.member.name}
                    </Text>
                    <Text style={styles.subTitle}>
                        {"Your message will appear on team chat"}
                    </Text>
                    <TextInput
                        placeholder={"Enter message..."}
                        placeholderTextColor={'rgba(255,255,255,0.5)'}
                        multiline={true}
                        underlineColorAndroid={Constant.transparent}
                        style={ styles.textInput}
                        autoCorrect={true}
                        maxLength={200}
                        ref={"messageInput"}
                        blurOnSubmit={true}
                        returnKeyType={"done"}
                        value={this.state.messageText}
                        onChangeText={ (text) => this.onTextChange(text) }
                        selectionColor={Constant.selectionColor}/>
                    <Button title={"Congratulate"}
                            backColor="#FFF"
                            color={Constant.lightBlueColor}
                            otherStyle={{height: 60,width: '70%',marginTop: 0}}
                            otherTextStyle={{fontSize:15, fontFamily: Constant.font700}}
                            onPress={this.onMessageSend}/>
                </Animated.View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        width:Constant.screenWidth,
        height:Constant.screenHeight,
        top:0, left:0,
        position: 'absolute', backgroundColor:'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transparentView: {
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'#173d51',
        opacity:0.9, alignItems:'center', justifyContent:'center'
    },
    innerPopupView:{
        backgroundColor: Constant.lightBlueColor,
        width: Constant.screenWidth - 40,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        paddingTop: 30,
        paddingBottom:34,
        marginBottom: 10,
        maxWidth:340,
    },
    subTitle:{
        color:"#d5edfc",
        fontSize:15,
        fontFamily: Constant.font500,
        textAlign: 'center',
        marginTop: 12,
        maxWidth: '90%'
    },
    topTitle:{
        color:"#fff",
        fontSize: 22,
        fontFamily: Constant.font300,
        textAlign: 'center'
    },
    textInput: {
        color: '#fff',
        height: 120,
        width: '90%',
        borderRadius: 13,
        paddingLeft:10,
        fontSize: 15,
        fontFamily: Constant.font500,
        paddingTop: 5,
        paddingBottom: 12,
        backgroundColor: '#7acdf6',
        marginTop: 30,
        marginBottom: 24,
        lineHeight: 24
    },
});

const mapStateToProps = state => {
    return {
        userName:state.user.userDetails.name || "",
    };
};

export default connect(mapStateToProps, {
    addTeamChat
})(EncouragePopup);