import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Keyboard,
    Alert, BackHandler
} from 'react-native';
import Constant from '../../../../../helper/constant';
import NavigationBar from '../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import { updateJournalContent, addJournalDays } from '../../../../../actions/statisticAction';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {showNoInternetAlert, showCustomAlert, callTodayScreenEcentListner} from '../../../../../helper/appHelper';

let textData = "";
let isBackProcessDone = false;
let downCount = 0;

class JournalCompose extends Component {

    constructor(props){
        super(props);
        let messageText = (props.navigation.state.params.rowData.data && props.navigation.state.params.rowData.data !== '@@@') &&
            props.navigation.state.params.rowData.data || ""
        this.state = {
            keyboardHeight: 0,
            messageText,
            height: 0,
            isShowDone : false
        };
        textData = messageText;
        downCount = 0;
    }

    componentWillMount() {
        callTodayScreenEcentListner(false);
        isBackProcessDone = false;
        this.keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardWillHide);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        if(this.props.navigation.state.params){
            if(this.props.navigation.state.params.rowData.data.length == 0){
                this.refs.txtInput.focus();
            }else{
                Keyboard.dismiss()
            }
        }
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount() {
        callTodayScreenEcentListner();
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
        Keyboard.dismiss();
        if(!isBackProcessDone){
            this.onBackButtonPress(false)
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    _keyboardWillShow = (e) => {
         this.setState({
            keyboardHeight: e.endCoordinates.height + 60,
            isShowDone: true
        });
    };

    _keyboardWillHide = (e) => {
        this.setState({
            keyboardHeight: 0,
            isShowDone : false
        });
    };

    onSwipeDown(gestureState) {
        Keyboard.dismiss()
    }

    onBackButtonPress = (isBackPress = true) => {
        isBackProcessDone = true;
        Keyboard.dismiss();
        if(this.props.navigation.state.params.rowData.data != textData) {
            if(!textData.trim().length){
                textData = '@@@';
            }
            this.props.navigation.state.params.rowData.data = textData;
            if(this.props.navigation.state.params.rowData.id != 0) {
                if(this.props.isConnected){
                    this.props.updateJournalContent(this.props.navigation.state.params.rowData).then(res=>{
                    }).catch(err=>{
                        showCustomAlert("Failed to update journal entry.", "Brainbuddy", "Try again");
                    });
                }else{
                    showNoInternetAlert();
                }
            }else{
                if(this.props.isConnected){
                    this.props.addJournalDays(this.props.navigation.state.params.rowData).then(res=>{
                    }).catch(err=>{
                        showCustomAlert("Failed to add journal entry.", "Brainbuddy", "Try again");
                    });
                }else{
                    showNoInternetAlert();
                }
            }
        }
        if(isBackPress){
            if(this.props.navigation.state.params.isOptional) {
                callTodayScreenEcentListner();
                if(!this.props.navigation.state.params.isReplay){
                    this.props.navigation.state.params.onCompleteExercises("journalActivity");
                }
                this.props.navigation.state.params.makeFadeInAnimation();
            }
            this.props.navigation.goBack();
        }
    };

    onTextChange = (text) => {
        let message = text.toString().trim();
        textData = message;
        // this.setState({
        //     messageText: text,
        // });
    };

    onDonePress=()=>{
        Keyboard.dismiss();
    };

    updateSize = (val) =>{
        this.setState({
            height: val
        });
    };

    render() {
        let objIcon = (this.props.navigation.state.params && this.props.navigation.state.params.isOptional) ? {name:"md-close", size: 28} : null;
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50
        };
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {formatedDate, data } = this.props.navigation.state.params.rowData;
        return (
            <View style={{flex:1}}>
                <GestureRecognizer
                    onSwipeDown={(state) => this.onSwipeDown(state)}
                    config={config}
                    style={{flex: 1}}>
                    <View style={ styles.container}>    
                        <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                                       top={this.props.safeAreaInsetsDefault.top}
                                       backIcon={objIcon}
                                       title={formatedDate}/>
                        {
                            (this.state.isShowDone) &&
                            <TouchableHighlight style={styles.doneView}
                                                onPress={() => this.onDonePress()}
                                                underlayColor={Constant.transparent}>
                                <Text style={[styles.doneText, {paddingTop: 10 + this.props.safeAreaInsetsDefault.top,
                                    color: appColor.navDoneBtn
                                }]}>
                                    DONE
                                </Text>
                            </TouchableHighlight>
                            || null
                        }

                        <TextInput placeholder={ (data === "" || data === '@@@') ? "Write about your day." : ""}
                                   placeholderTextColor="gray"
                                   multiline={true}
                                   numberOfLines={100}
                                   autoCorrect={true}
                                   onChangeText={ (text) => this.onTextChange(text) }
                                   autoFocus={false}
                                   keyboardDismissMode={"on-drag"}
                                   underlineColorAndroid={Constant.transparent}
                                   blurOnSubmit={false}
                                   enablesReturnKeyAutomatically={false}
                                   ref="txtInput"
                                   autoCapitalize={"sentences"}
                                   selectionColor={Constant.selectionColor}
                                   style={[styles.textView,
                                       {maxHeight: Constant.screenHeight - this.state.keyboardHeight}]}>
                            <Text style={{lineHeight: 24}}>
                                {textData}
                            </Text>
                        </TextInput>
                    </View>
                </GestureRecognizer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 50
    },
    textView:{
        textAlignVertical: 'top',
        fontSize: 15,
        color: '#4e4e4e',
        minHeight: 40,
        fontFamily: Constant.font500,
        backgroundColor: '#fff',
        marginLeft:18,
        paddingRight:18,
        paddingTop: 30,
        paddingBottom: 12,
        lineHeight: 24
    },
    doneView:{
        top:10,
        right:10,
        position:'absolute',
        width:50,
        alignItems:'center',
        backgroundColor:'transparent'
    },
    doneText:{
        fontSize: 14,
        color:'#a7b0b6',
        fontFamily: Constant.font700,
    }
});

const mapStateToProps = state => {
    return {
        initialMsg:state.statistic.initialMsg,
        backup_data: state.statistic.backup_data,
        isConnected: state.user.isConnected,
        safeAreaInsetsDefault:state.user.safeAreaInsetsDefault,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    updateJournalContent, addJournalDays
})(JournalCompose);
