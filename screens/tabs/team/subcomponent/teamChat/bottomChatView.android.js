import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    Keyboard,
    TouchableHighlight,
    Animated,
    Easing,
    Alert
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default class BottomChatComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEmptyMessage: true,
            keyboardHeight: 0,
            messageText: "",
            height: 0
        }
        this.keyboardHeight = new Animated.Value(0);
    }

    componentDidUpdate() {
        if (this.state.keyboardHeight !== 0) {
            this.props.onInputBoxChange()
        }
    }

    componentWillMount () {
        // this.keyboardDidShowListener = Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        // this.keyboardDidHideListener = Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isCommentEdit){
            if(this.props.editCommentData.content != nextProps.editCommentData.content){
                this.setState({
                    messageText: nextProps.editCommentData.content || "",
                    isEmptyMessage: false
                });
            }
            if(this.refs.mexLenthInput){
                // alert("ccc")
                this.refs.mexLenthInput.focus();
            }
        }
    }

    componentWillUnmount () {
        try{
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }catch (e){

        }
        Keyboard.dismiss();
    }

    _keyboardDidShow = (e) => {
        // this.setState({
        //     keyboardHeight: 15
        //     // keyboardHeight: this.props.isBottomBar && e.endCoordinates.height - 45 -
        //     // this.props.safeAreaInsetsData.bottom
        //     // || e.endCoordinates.height - this.props.safeAreaInsetsData.bottom
        // },()=>{
            setTimeout(()=>{
                this.props.onKeybordChange();
            },100);

        // });
    };

    _keyboardDidHide = (e) => {

        // this.setState({
        //     keyboardHeight: 0
        // },()=>{
            setTimeout(()=>{
                this.props.onKeybordChange();
            },100)
        // });
    };

    onTextChange = (text) => {
        let message = text.toString().trim();
        this.setState({
            isEmptyMessage: message.length === 0,
            messageText: text
        });
        this.props.showCharLimit(message.length);
    };

    onMessageSend = () => {
        if(this.props.isCommentEdit){
            this.props.onEditCommentDone(this.state.messageText.toString().trim());
            Keyboard.dismiss();
            if(this.props.isConnected) {
                this.setState({messageText:"", isEmptyMessage: true});
            }
        }else{
            if(!this.state.isEmptyMessage && this.state.messageText !== ""){
                this.props.onMessageSend(this.state.messageText.toString().trim());
                Keyboard.dismiss();
                if(this.props.isConnected) {
                    this.setState({messageText: "", isEmptyMessage: true});
                }
            }
        }
    };

    updateSize = (val) =>{
        this.setState({
            height: val
        });
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[ styles.mainView, { marginBottom: this.state.keyboardHeight } ]}>
                <View style={[styles.innerView,{backgroundColor: appColor.bottomChatInner}]}>
                    {
                        (this.props.maxLength) &&
                        <TextInput
                            placeholder={"Write a message"}
                            placeholderTextColor={appColor.bottomChatPlaceholder}
                            multiline={true}
                            autoCapitalize={"sentences"}
                            onChangeText={ (text) => this.onTextChange(text) }
                            underlineColorAndroid={Constant.transparent}
                            style={[styles.textInput,{color: appColor.bottomChatText, height: Math.min(100, Math.max(40, this.state.height))}]}
                            autoCorrect={true}
                            value={this.state.messageText}
                            maxLength={this.props.maxLength}
                            blurOnSubmit={false}
                            ref={"mexLenthInput"}
                            onLayout={(e)=>{
                                let tmp = e.nativeEvent.layout.height;
                                this.props.onTextInputHeightChange(e.nativeEvent.layout.height);
                                setTimeout(()=>{
                                    this.props.onKeybordChange()
                                },100);
                            }}
                            onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                            selectionColor={Constant.selectionColor}/>
                        ||

                        <TextInput
                            placeholder={this.props.placeHolderText}
                            placeholderTextColor={appColor.bottomChatPlaceholder}
                            multiline={true}
                            autoCapitalize={"sentences"}
                            onChangeText={ (text) => this.onTextChange(text) }
                            underlineColorAndroid={Constant.transparent}
                            style={[styles.textInput,{color: appColor.bottomChatText, height: Math.min(100, Math.max(40, this.state.height))}]}
                            autoCorrect={true}
                            value={this.state.messageText}
                            blurOnSubmit={false}
                            // onEndEditing={() => this.onMessageSend()}
                            onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                            onLayout={(e)=>{
                                let tmp = e.nativeEvent.layout.height;
                                setTimeout(()=>{
                                    this.props.onKeybordChange()
                                },100);
                            }}
                            // onEndEditing={() => this.onMessageSend()}
                            selectionColor={Constant.selectionColor}/>
                    }
                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={() => this.onMessageSend()}>
                        <View style={ styles.outerImage }>
                            <Image resizeMode="contain"
                                   source={{uri:'community_send_button'}}
                                   style={[{opacity: (this.state.isEmptyMessage) ? 0.5 : 1}, styles.imageView]}/>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        padding:5,
        // backgroundColor: 'rgb(0,63,85)',
        width: '100%',
        marginBottom:0,
        backgroundColor: Constant.transparent,
        paddingLeft:10,
        paddingRight: 10,
        // paddingTop:5,
        // paddingBottom: 5
    },
    innerView: {
        flexDirection:'row',
        backgroundColor: Constant.backColor,
        borderRadius: 20,
        alignItems: 'flex-end',
        paddingBottom: 5,

    },
    textInput: {
        flex:1,
        color: '#fff',
        // minHeight: 40,
        // maxHeight:100,
        borderRadius: 20,
        paddingLeft:15,
        fontSize: 15,
        fontFamily: Constant.font500,
        justifyContent:'center',
        paddingTop: 12,
        paddingBottom: 7,
    },
    outerImage:{
        justifyContent:'flex-end',
        borderRadius: 20
    },
    imageView:{
        height: 30,
        width:30,
        marginLeft: 15,
        marginRight: 5,
        // marginBottom: 5
    }
});