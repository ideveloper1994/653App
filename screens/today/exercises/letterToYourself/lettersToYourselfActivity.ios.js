import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Keyboard,
    Alert,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import _ from 'lodash';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import { updateLetters } from '../../../../actions/lettersActions';
import LettersToYourselfInit from './lettersToYourselfInit';
import NavigationBar from '../../../commonComponent/navigationBarRightbtn';
import * as Animatable from 'react-native-animatable';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
let downCount = 0;

class LetterYourSelfActivity extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            isInstruction: true,
            isLoaded: true,
            keyboardHeight: 0,
            messageText: "",
            params: props.navigation.state.params
        }
        this.offset = 0;
        downCount = 0;
    }

    componentWillMount() {
        callTodayScreenEcentListner(false);
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
    }


    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
        Keyboard.dismiss();
        callTodayScreenEcentListner();
    }

    //Instruction Page
    onCloseButtonPress = () => {
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack()
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setState({ isInstruction: false });
        this.refs.txtInput.focus();
    };

    onTextChange = (text) => {
        let message = text.toString().trim();
        this.setState({
            messageText: text,
        });
    };

    _keyboardWillShow = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height
        });
    };

    _keyboardWillHide = (e) => {
        this.setState({
            keyboardHeight: 0
        });
    };

    onSwipeDown(gestureState) {
        Keyboard.dismiss()
    }

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Wisdom"});
        if(obj != undefined){
            per = obj.progressPer
        }
        let desc = (this.props.currentGoal.goalDays == 1)
            ? "24 hours clean." : this.props.currentGoal.goalDays + " days clean.";

        return(
            <LettersToYourselfInit
                description= {"Write a letter to yourself. You will receive this letter after you complete " + desc}
                excerciseNumber = {this.props.exercise_number_letters}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {this.state.isLoaded}
                title={(this.props.currentGoal.goalDays == 1) ? "24 hours Letter" :
                    this.props.currentGoal.goalDays + " days Letter"}
                per={per}/>
        )
    };

    onScroll = (event) => {
        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > this.offset ? 'down' : 'up';
        this.offset = currentOffset;
        if(direction == "down") {
            downCount += 1;
            if(downCount > 35){
                Keyboard.dismiss();
                downCount = 0;
            }
        }else{
            downCount = 0;
        }
    }

    render() {
        const {container, absoluteView, textSubTitle} = styles;
        return (
            <View style={container}>
                <View style={container}>
                    <View style={[styles.container,{backgroundColor: "#FFF"}]}>
                        <NavigationBar onRightButtonPress={ this.onRightButtonPress }
                                       top={this.props.safeAreaInsetsDefault.top}
                                       appTheme={this.props.appTheme}
                                       title={(this.props.currentGoal.goalDays == 1) ? "24 hours clean" :
                                           this.props.currentGoal.goalDays + " days clean"}
                                       rightButton="DONE"/>
                        <ScrollView keyboardShouldPersistTaps={"always"} keyboardDismissMode="on-drag"
                                    showsVerticalScrollIndicator={false}>
                            <TextInput placeholder={"Write your letter."}
                                       placeholderTextColor="gray"
                                       multiline={true}
                                       onChangeText={ (text) => this.onTextChange(text) }
                                       // onSubmitEditing={Keyboard.dismiss}
                                       ref="txtInput"
                                       blurOnSubmit={false}
                                // onScroll={this.onScroll}
                                       autoFocus={false}
                                //value={this.state.messageText}
                                       underlineColorAndroid={Constant.transparent}
                                       selectionColor={Constant.selectionColor}
                                       style={[styles.textView,
                                           {maxHeight: Constant.screenHeight - this.state.keyboardHeight - (80 + this.props.safeAreaInsetsDefault.top - 10),
                                               paddingBottom: (this.props.safeAreaInsetsDefault.top > 20) && 20 || 13}]}>
                                <Text>
                                    {this.state.messageText}
                                </Text>
                            </TextInput>
                        </ScrollView>
                    </View>
                    { (this.state.isInstruction) ?
                        this.renderInitComponent()
                        : null}
                </View>
            </View>
        );
    }

    onRightButtonPress =  () => {
        Keyboard.dismiss();
        if(this.state.messageText.trim().length > 0){
            Alert.alert("Are you sure?",
                "You won't see this letter again until you reach your goal.",
                [
                    {text: "Keep writing", onPress: () => {
                        }},
                    {text: "I'm finished", onPress: () => {
                            let objLetters = {
                                day: this.props.currentGoal.goalDays,
                                content: this.state.messageText.trim()
                            };
                            this.props.updateLetters(objLetters);
                            Keyboard.dismiss();
                            let activityNo = this.props.exercise_number_letters;
                            activityNo += 1;
                            this.props.updateMetaData({ exercise_number_letters: activityNo }, this.state.params.improve || []);
                            this.state.params.onCompleteExercises(this.state.params.pageName);
                            if(this.state.params.isOptional){
                                this.state.params.makeFadeInAnimation();
                                this.props.navigation.goBack();
                                //this.props.navigator.push(Router.getRoute("completeOptionalActivity",{title: "Healthy activity complete", data: ["Dopamine"]}));
                            }else{
                                if(this.state.params.isLast){
                                    //this.props.navigator.push(Router.getRoute("completeMorningRoutine"));
                                    this.props.navigation.navigate("completeMorningRoutine");
                                }else{
                                    this.state.params.makeFadeInAnimation();
                                    this.props.navigation.goBack();
                                }
                            }
                        }},
                ],
            );
        }else {
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'rgb(49,165,159)',
    },
    textSubTitle: {
        fontSize:15,
        color:'#aaa',
        fontFamily: Constant.font500,
    },
    absoluteView:{
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center'
    },
    textView:{
        //flex: 1,
        fontSize: 15,
        color: '#4e4e4e',
        minHeight: 40,
        fontFamily: Constant.font500,
        backgroundColor: '#fff',
        marginLeft:18,
        paddingRight:18,
        paddingTop: 30,
        paddingBottom: 10,
        lineHeight: 24
    },
    // textView:{
    //     // flex: 1,
    //     fontSize: 15,
    //     color: '#4e4e4e',
    //     minHeight: 40,
    //     fontFamily: Constant.font500,
    //     backgroundColor: '#fff',
    //     marginLeft:18,
    //     paddingRight:18,
    //     paddingTop: 30,
    //     paddingBottom: 10,
    //     lineHeight:24
    // },
});


const mapStateToProps = state => {
    return {
        currentGoal:state.statistic.currentGoal,
        exercise_number_letters: state.metaData.metaData.exercise_number_letters || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    updateMetaData, updateLetters
})(LetterYourSelfActivity);