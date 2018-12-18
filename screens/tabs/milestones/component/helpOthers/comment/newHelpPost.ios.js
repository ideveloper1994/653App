import React, {Component} from 'react';
import {
    AsyncStorage,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import {connect} from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';
import Constant from '../../../../../../helper/constant';
import {addNewComment, editHelpPost} from '../../../../../../actions/helpPostActions';
import {isReligious, showCustomAlert, showNoInternetAlert, showThemeAlert} from '../../../../../../helper/appHelper';

let barPosition = Constant.screenHeight < 700 ? 325 : (Constant.screenHeight > 800) ? 390 : 330;
let textInputHeight = Constant.screenHeight < 700 ? 400 : (Constant.screenHeight > 800) ? 490 : 445;

class NewHelpPost extends Component {

    constructor(props){
        super(props);
        this.state = {
            messageText: "",
            charCount:400,
            btnDisabled: false,
            opacity:1,
            postBtnTitle: "Post"
        };
    }

    componentWillMount() {
        if(this.props.isEdit){
            this.setState({
                messageText: this.props.editData.content,
                charCount: 400 - this.props.editData.content.length,
                postBtnTitle: "Save",
                btnDisabled: false,
                opacity:1,
            });
        }
    }

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    onTextChange = (text) => {
        if(this.state.charCount >= 0 || text.toString().trim().length <= 400) {
            this.setState({
                messageText: text,
                charCount: 400 - text.toString().trim().length
            });
        }
    };

    onPostPress = () => {
        try{
            if(this.props.isEdit) {
                //Edit
                if(this.state.messageText.trim().length > 0 && this.state.messageText.trim() !== this.props.editData.content ){
                    this.makeDisabled(true);
                    if(this.props.isConnected) {
                        this.checkForReligious(false);
                    }else{
                        showNoInternetAlert();
                        this.makeDisabled(false);
                    }
                }else{
                    this.props.onCloseBtnPress();
                }
            }else{
                //Add Post
                AsyncStorage.getItem("getHelpDateHour").then(getHelpAdvice => {
                    let today = new Date().toDateString();
                    let hour = new Date().getHours();
                    let objdateHour = JSON.stringify({addedDate: today, postedHour: hour});
                    if(getHelpAdvice === null || getHelpAdvice !== objdateHour) {
                        //post allow
                        this.makeDisabled(true);
                        this.checkForReligious(true, objdateHour);
                    }else{
                        //alert
                    }
                });
            }
        }catch (e){
            console.log(e)
        }
    };

    performEditPost = (isReligiousContent) => {
        try{
            let editData = this.props.editData;
            editData.content = this.state.messageText.trim();
            editData.is_religious = isReligiousContent;
            this.props.editHelpPost(editData).then((res) => {
                Keyboard.dismiss();
                this.props.onCloseBtnPress();
            }).catch(err => {
                showCustomAlert("Fail to save post, please try again.", "Brainbuddy","OK");
                this.makeDisabled(false);
            });
        }catch (e){
            console.log(e)
        }
    }

    checkForReligious = (isNewPost = true, objdateHour = null) => {
        try{
            let religiousString = isReligious(this.state.messageText.trim());
            if(religiousString == Constant.RELIGIOUS){
                if(isNewPost){
                    this.performAddPost(true,objdateHour);
                }else{
                    this.performEditPost(true);
                }
            }else if(religiousString == Constant.NO_RELIGIOUS){
                if(isNewPost){
                    this.performAddPost(false,objdateHour);
                }else{
                    this.performEditPost(false);
                }
            }else if(religiousString == Constant.ASK_RELIGIOUS_ALERT){
                showThemeAlert({
                    title: "Religious content?",
                    message: "Does your post contain religious content?",
                    leftBtn: "Yes",
                    leftPress: ()=>{
                        if(isNewPost){
                            this.performAddPost(true,objdateHour);
                        }else{
                            this.performEditPost(true);
                        }
                    },
                    rightBtn: "No",
                    rightPress: ()=>{
                        if(isNewPost){
                            this.performAddPost(false,objdateHour);
                        }else{
                            this.performEditPost(false);
                        }
                    },
                });
            }
        }catch (e){
            console.log(e)
        }
    }

    performAddPost = (isReligiousContent, objdateHour) => {
        this.props.addNewComment({content: this.state.messageText.trim(), is_religious: isReligiousContent}).then((res) => {
            Keyboard.dismiss();
            AsyncStorage.setItem("getHelpDateHour", objdateHour);
            this.props.onCloseBtnPress();
        }).catch(err => {
            showCustomAlert("Fail to add post, please try again.", "Brainbuddy","OK");
            this.makeDisabled(false);
        });
    }

    makeDisabled = (flag) => {
        this.setState({
            btnDisabled: flag,
            opacity:(flag) && 0.4 || 1
        });
    };

    cancelPress = () => {
        //this.props.navigation.goBack();
        this.props.onCloseBtnPress();
    };

    onSwipeDown(gestureState) {
        Keyboard.dismiss()
    }

    render() {
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50
        };
        const { container, textDetail } = styles;
        let value = Constant.screenHeight > 700 ? 330 : 315;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        let bottom = (this.props.safeAreaInsetsData.bottom > 0) && (this.props.safeAreaInsetsData.bottom + 10) || 0
        return (
            <View style={[container,{paddingTop:this.props.safeAreaInsetsData.top+9, backgroundColor: appColor.appBackground}]}>
                <GestureRecognizer
                    onSwipeDown={(state) => this.onSwipeDown(state)}
                    config={config}
                    style={{flex: 1, backgroundColor:"transparent"}}>
                    <View style={styles.titleView}>
                        <View style={{flex:1}}>
                            <TouchableHighlight underlayColor={Constant.transparent}
                                                onPress={() => {this.cancelPress()}}
                                                style={{flex:1}}>
                                <Text style={[styles.cancelText, {color:appColor.createPostCancel}]}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{  color: appColor.defaultFont,fontSize: 15,alignSelf:'center',fontFamily: Constant.font700}}>
                                Get help
                            </Text>
                        </View>
                        <View style={{flex:1}}/>
                    </View>
                    <View style={{padding:20,marginTop:10,flex: 1}}>
                        <TextInput placeholder={"Write a Post."}
                                   blurOnSubmit={false}
                                   placeholderTextColor={appColor.createPostCancel}
                                   multiline={true}
                                   onChangeText={ (text) => this.onTextChange(text) }
                            // onSubmitEditing={Keyboard.dismiss}
                                   autoFocus={true}
                                   autoCorrect={true}
                                   ref="txtInput"
                                   underlineColorAndroid={Constant.transparent}
                                   value={this.state.messageText}
                                   maxLength={400}
                                   selectionColor={Constant.selectionColor}
                                   style={[styles.textView, {color:appColor.defaultFont, maxHeight: Constant.screenHeight - (textInputHeight + bottom)}]} />
                        <TouchableHighlight style={{flex: 1}}
                                            underlayColor={"transparent"}
                                            onPress={()=>{
                                                if(this.refs.txtInput.isFocused()){
                                                    Keyboard.dismiss()
                                                }else{
                                                    this.refs.txtInput.focus()
                                                }}}>
                            <View style={{flex: 1}}/>
                        </TouchableHighlight>
                    </View>
                    <View style={{left:20, right:20, top:Constant.screenHeight - (barPosition + bottom),
                        position:'absolute',height:50, flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={{color:Constant.greenColor, fontFamily: Constant.font500}}>
                                {this.state.charCount+" characters remaining"}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.onPostPress()}
                                          style={{alignSelf:'center',
                                              justifyContent:'center',
                                              backgroundColor:'transparent',
                                              alignItems:'center'}}
                                          disabled={this.state.btnDisabled}>
                            <View style={[styles.btnPost,{opacity: this.state.opacity, backgroundColor: appColor.createPostBtn}]}>
                                <Text style={{color:"#FFF", fontFamily: Constant.font500}}>
                                    {this.state.postBtnTitle}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </GestureRecognizer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor,
        paddingBottom:100
    },
    textDetail: {
        color: '#FFF',
        fontSize: 15,
        margin:5,
        fontFamily: Constant.font700,
    },
    titleView:{
        marginTop:30,
        flexDirection:'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    cancelText:{
        flex:1,
        fontSize: 15,
        fontFamily: Constant.font500,
        color:Constant.lightTheamColor
    },
    btnPost:{
        backgroundColor: Constant.transparentBackColor,
        padding:10,
        paddingLeft:20,
        paddingRight:20,
        borderRadius: 30,
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    textView:{
        fontSize: 15,
        color: '#FFF',
        //backgroundColor: 'red',
        fontFamily: Constant.font300,
        minHeight: 40,
        maxHeight: Constant.screenHeight - textInputHeight,
    },
    titleText:{
        color: '#FFFFFF',
        fontSize: 15,
        alignSelf:'center',
        fontFamily: Constant.font700,
    }
});

const mapStateToProps = state => {
    return {
        isConnected: state.user.isConnected,
        safeAreaInsetsData: state.user.safeAreaInsetsDefault,
    };
};

export default connect(mapStateToProps, {
    addNewComment, editHelpPost
})(NewHelpPost);