import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing, Linking, Alert,
    TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import Button from '../../../commonComponent/button';
import moment from 'moment';
import {addTeamChat} from "../../../../actions/teamAction";
import {showThemeAlert} from "../../../../helper/appHelper";

let isClicked = false;

class EncouragePopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEmptyMessage: true,
            messageText: "",
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
        if(this.state.isEmptyMessage){
            showThemeAlert({title:"Please enter a message",
                leftBtn: "OK"});
        }else{
            let obj = {
                content: this.state.messageText,
                recipient_user_id: this.props.memberDetail.id
            }
            this.props.addTeamChat(obj, "Encourage");
            this.hidePopup()
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
                        {"Motivate " + this.props.memberDetail.name}
                    </Text>
                    <Text style={styles.subTitle}>
                        {"Your message will appear on team chat"}
                    </Text>
                    <TextInput
                        placeholder={"Enter message..."}
                        placeholderTextColor={'#f9e2c4'}
                        multiline={true}
                        underlineColorAndroid={Constant.transparent}
                        style={styles.textInput}
                        autoCorrect={true}
                        maxLength={200}
                        ref={"messageInput"}
                        blurOnSubmit={true}
                        returnKeyType={"done"}
                        onChangeText={ (text) => this.onTextChange(text) }
                        selectionColor={Constant.selectionColor}/>
                    <Button title={"Send motivation"}
                            backColor="#FFF"
                            color='rgb(251,176,67)'
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
        backgroundColor: 'rgb(251,176,67)',
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
        color:"#fbead6",
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
        paddingLeft:14,
        fontSize: 15,
        fontFamily: Constant.font500,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#f3c27a',
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