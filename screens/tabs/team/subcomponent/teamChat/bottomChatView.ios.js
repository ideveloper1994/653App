import React from 'react';
import {Animated, Image, Keyboard, StyleSheet, TextInput, TouchableHighlight, View,} from 'react-native';
import Constant from '../../../../../helper/constant';

export default class BottomChatComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isEmptyMessage: true,
            keyboardHeight: 0,
            messageText: "",
        }
        this.keyboardHeight = new Animated.Value(0);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isCommentEdit){
            if(this.props.editCommentData.content != nextProps.editCommentData.content){
                this.setState({
                    messageText: nextProps.editCommentData.content || "",
                    isEmptyMessage: false
                });
            }
            this.refs.mexLenthInput.focus();
        }
    }

    componentDidUpdate(){
        if(this.state.keyboardHeight !== 0){
            this.props.onInputBoxChange();
        }
    }

    componentWillMount () {
        if(this.props.isManagedKeybord){
            this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
            // this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }
    }

    componentWillUnmount () {
        if(this.props.isManagedKeybord){
            this.keyboardWillShowListener.remove();
            // this.keyboardWillHideListener.remove();
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
        Keyboard.dismiss();
    }

    _keyboardWillShow = (e) => {
        this.props.setKeyboardShow(true);
        // this.setState({
        //     keyboardHeight: this.props.isBottomBar && e.endCoordinates.height - 45 - this.props.safeAreaInsetsData.bottom
        //     || e.endCoordinates.height - this.props.safeAreaInsetsData.bottom
        // });
        //this.props.onKeybordChange();
        // let keyboardHeight = this.props.isBottomBar && e.endCoordinates.height - 45 - this.props.safeAreaInsetsData.bottom
        //     || e.endCoordinates.height - this.props.safeAreaInsetsData.bottom;
        //
        // Animated.timing(this.keyboardHeight, {
        //     duration: e.duration,
        //     toValue: keyboardHeight,
        //     easing: Easing.linear
        // },{useNativeDriver: true}).start();

        // this.props.onKeybordChange();
    };

    _keyboardWillHide = (e) => {
        // this.setState({
        //     keyboardHeight: 0
        // });
        // Animated.timing(this.keyboardHeight, {
        //     duration: 10,
        //     toValue: 0,
        //     easing: Easing.linear
        // },{useNativeDriver: true}).start();
        // this.props.onKeybordChange();

    };

    _keyboardDidShow = (e) => {
        this.props.onKeybordChange(true)
    };

    _keyboardDidHide = (e) => {
        // setTimeout(()=>{
        //     // this.props.onKeybordChange()
        // },200);
        // this.props.onKeybordChange()
        this.props.onKeybordChange(false)

        this.props.setKeyboardShow(false);
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
                    this.setState({messageText:"", isEmptyMessage: true});
                }
            }
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.mainView]} ref={'test'}>
                <View style={[styles.innerView,{backgroundColor: appColor.bottomChatInner}]}>
                    {
                        (this.props.maxLength) &&
                        <TextInput
                            placeholder={this.props.placeHolderText}
                            placeholderTextColor={appColor.bottomChatPlaceholder}
                            multiline={true}
                            onChangeText={ (text) => this.onTextChange(text) }
                            underlineColorAndroid={Constant.transparent}
                            style={[styles.textInput,{color: appColor.bottomChatText}]}
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
                            // onEndEditing={() => this.onMessageSend()}
                            selectionColor={Constant.selectionColor}/>
                        ||
                        <TextInput
                            placeholder={this.props.placeHolderText}
                            placeholderTextColor={appColor.bottomChatPlaceholder}
                            multiline={true}
                            onChangeText={ (text) => this.onTextChange(text) }
                            underlineColorAndroid={Constant.transparent}
                            style={[styles.textInput,{color: appColor.bottomChatText}]}
                            autoCorrect={true}
                            value={this.state.messageText}
                            blurOnSubmit={false}
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
                                        onPress={() => {this.onMessageSend();}}>
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
        backgroundColor: "transparent",
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
        minHeight: 16,
        maxHeight: 100,
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