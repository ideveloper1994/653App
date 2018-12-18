import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import BrainTrainingInit from './brainTrainingInit';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import {NavigationActions} from 'react-navigation';
import KeepAwake from 'react-native-keep-awake';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';


let text1 = "";
let text2 = "";
let text3 = "";
let count = 1;
let isCompleted = false;

class BrainActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            text1: "",
            text2: "",
            text3: "",
            displayText: "",
            fontSize: 12,
            backgroundColor: '#aee7e4',
            isInstruction: true,
            exercise_number_brain_training: props.exercise_number_brain_training || 1,
            params: props.navigation.state.params
        };
        this.timeOutInstance = null;
    }

    componentDidMount(){
    }

    componentWillUnmount(){
        callTodayScreenEcentListner();
        this.clearIntervals();
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        callTodayScreenEcentListner(false);
        let exeNo = this.props.exercise_number_brain_training;

        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 10){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_brain_training: exeNo
        });
        count = 1;
        this.getDescriptionText(exeNo);
        this.getStyle(count);
        isCompleted = false;
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    clearIntervals = () => {
        if(this.state.intervalId){
            clearInterval(this.state.intervalId);
        }
        if(this.timeOutInstance != null){
            clearTimeout(this.timeOutInstance);
        }
    };

    onCompleteActivity = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        KeepAwake.deactivate();
        this.clearIntervals();
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            this.state.params.onCompleteExercises(this.state.params.pageName);
            let activityNo = this.props.exercise_number_brain_training;
            // activityNo = (activityNo >= 10) ? 1 : ++activityNo;
            if(activityNo >= 10){
                if(activityNo > 10){
                    activityNo = 1;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.props.updateMetaData({ exercise_number_brain_training: activityNo }, this.state.params.improve || []);
            if(this.state.params.isLast){
                this.props.navigation.navigate("howDidUDo",{nextPage: 'completeMorningRoutine', isPassObj: false});
            }else{
                this.manageMorningRoutine();
            }
        }
    };

    manageMorningRoutine = () => {
        try{
            let morningRoutine = this.props.morningRoutine;
            let obj = _.find(morningRoutine,{pageName: this.state.params.pageName});
            let length = morningRoutine.length;
            let nextIndex = morningRoutine.indexOf(obj) + 1;
            let introTitle= (nextIndex + 1) + " of " + length;
            let isLast = (morningRoutine.length-1 == nextIndex);
            this.props.navigation.navigate('howDidUDo',{nextPage: morningRoutine[nextIndex].pageName,
                isPassObj: true,
                passObj: {pageName: morningRoutine[nextIndex].pageName,
                    setDoneMorningRoutine: this.state.params.setDoneMorningRoutine,
                    isLast: isLast,
                    isOptional: false,
                    improve: morningRoutine[nextIndex].improve,
                    onCompleteExercises: this.state.params.onCompleteExercises,
                    makeFadeInAnimation: this.state.params.makeFadeInAnimation,
                    isReplay: false,
                    introTitle: introTitle,
                    scrollToTopToday: this.state.params.scrollToTopToday,
                }
            });
        }catch (e){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.popToTop();
        }

    };

    //Instruction Page
    onCloseButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        KeepAwake.deactivate();
        this.clearIntervals();
        // this.props.navigation.navigate("today",{isFadeToday: true})
        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));
        this.props.navigation.popToTop();
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        KeepAwake.activate();
        this.setState({ isInstruction: false });
        ++count;
        let interval = setInterval(() => {
            this.refs.textView.fadeOut();
            this.timeOutInstance = setTimeout(() => {
                if(count != 31) {
                    this.getStyle(count);
                    this.refs.textView.fadeIn();
                    ++count;
                }else{
                    if(!isCompleted){
                        this.onCompleteActivity();
                        isCompleted = true;
                    }
                }
            }, 300);
        }, 3500);

        this.setState({
            intervalId: interval
        });
        this.refs.textView.fadeIn();
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Dopamine"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <BrainTrainingInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = {this.state.exercise_number_brain_training}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {true}
                per={per}/>
        )
    };

    render() {
        const {container, textDetail, txtBottom} = styles;
        return (
            <View style={{flex:1, backgroundColor: "rgb(241,86,129)"}}>
                <AppStatusBar backColor={this.state.backgroundColor}/>
                <View style={{flex:1}}>
                    <View style={[container, { backgroundColor: this.state.backgroundColor }]}>
                        <Animatable.Text ref="textView" style={[textDetail, { fontSize: this.state.fontSize }]}>
                            { this.state.displayText }
                        </Animatable.Text>
                        <View style={{top:Constant.screenHeight*0.92-10, left:0, right:0, bottom:0,
                            position: 'absolute', alignItems: 'center'}}>
                            <TouchableHighlight onPress={()=> this.onCloseButtonPress()}
                                                underlayColor={Constant.transparent}>
                                <Text style={txtBottom}>
                                    Cancel
                                </Text>
                            </TouchableHighlight>
                        </View>
                        {(this.state.isInstruction) ?
                            <View style={{flex:1, left:0, right:0, top:0, bottom:0, position:'absolute',
                                backgroundColor: "rgb(241,86,129)"}}>
                                {this.renderInitComponent()}
                            </View>
                            : null }

                    </View>
                </View>
            </View>
        );
    }

    getDescriptionText = (number) => {
        switch (number){
            case 1:
                text1 = "I’m finished with porn";
                text2 =  "I choose to be healthy";
                text3 =  "I choose to be happy";
                break;

            case 2:
                text1 = "Pixels on a screen aren't real";
                text2 = "I'm turned on by genuine connection";
                text3 = "I choose real sex and real love";
                break;

            case 3:
                text1 = "Porn is artificial";
                text2 = "Porn is a waste of time";
                text3 = "I want to experience the real world";
                break;

            case 4:
                text1 = "I am not who I used to be";
                text2 = "I am free from addiction";
                text3 = "I am happy and healthy";
                break;

            case 5:
                text1 = "I am in control of my sexual urges";
                text2 = "I am in control of my mind";
                text3 = "I am in control of my life";
                break;

            case 6:
                text1 = "My willpower is strong";
                text2 = "I find it easy to say no to sexual urges";
                text3 = "I am living a life free from addiction";
                break;

            case 7:
                text1 = "I choose love, not porn";
                text2 = "I choose freedom, not slavery";
                text3 = "My attitude towards sex is positive";
                break;

            case 8:
                text1 = "I have matured";
                text2 = "Porn is no longer of interest to me";
                text3 = "Real relationships are more satisfying";
                break;

            case 9:
                text1 = "Life is short";
                text2 =  "Porn is a waste of time";
                text3 =  "There are so many things I choose to do instead";
                break;

            case 10:
                text1 = "The decision to quit makes me happy";
                text2 = "My future is full of joy";
                text3 = "I have quit porn forever";
                break;

            default:
                return "Null";
        }
    };

    getStyle = (number) => {
        switch (number){
            case 1:
                this.setState({
                    fontSize: 12,
                    displayText: text1,
                    backgroundColor: '#aee7e4'
                });
                break;

            case 2:
                this.setState({
                    fontSize: 15,
                    displayText: text2,
                    backgroundColor: '#92d5d1'
                });
                break;

            case 3:
                this.setState({
                    fontSize: 18,
                    displayText: text3,
                    backgroundColor: '#71c4be'
                });
                break;

            case 4:
                this.setState({
                    fontSize: 21,
                    backgroundColor: '#55aea8',
                    displayText: text1
                });
                break;

            case 5:
                this.setState({
                    fontSize: 24,
                    backgroundColor: '#3b928b',
                    displayText: text2
                });
                break;

            case 6:
                this.setState({
                    fontSize: 27,
                    backgroundColor: '#2c7a73',
                    displayText: text3
                });
                break;

            case 7:
                this.setState({
                    fontSize: 12,
                    backgroundColor: '#d4d3fe',
                    displayText: text1
                });
                break;

            case 8:
                this.setState({
                    fontSize: 15,
                    backgroundColor: '#c0c1fd',
                    displayText: text2
                });
                break;

            case 9:
                this.setState({
                    fontSize: 18,
                    backgroundColor: '#a6a6fc',
                    displayText: text3
                });
                break;

            case 10:
                this.setState({
                    fontSize: 21,
                    backgroundColor: '#8a8af0',
                    displayText: text1
                });
                break;

            case 11:
                this.setState({
                    fontSize: 24,
                    backgroundColor: '#7071e2',
                    displayText: text2
                });
                break;

            case 12:
                this.setState({
                    fontSize: 27,
                    backgroundColor: '#585cd3',
                    displayText: text3
                });
                break;

            case 13:
                this.setState({
                    fontSize: 12,
                    backgroundColor: '#ace6f6',
                    displayText: text1
                });
                break;

            case 14:
                this.setState({
                    fontSize: 15,
                    backgroundColor: '#90def4',
                    displayText: text2
                });
                break;

            case 15:
                this.setState({
                    fontSize: 18,
                    backgroundColor: '#63d3f6',
                    displayText: text3
                });
                break;

            case 16:
                this.setState({
                    fontSize: 21,
                    backgroundColor: '#47caf8',
                    displayText: text1
                });
                break;

            case 17:
                this.setState({
                    fontSize: 24,
                    backgroundColor: '#3eb5df',
                    displayText: text2
                });
                break;

            case 18:
                this.setState({
                    fontSize: 27,
                    backgroundColor: '#3298bc',
                    displayText: text3
                });
                break;

            case 19:
                this.setState({
                    fontSize: 12,
                    backgroundColor: '#aee7e4',
                    displayText: text1
                });
                break;

            case 20:
                this.setState({
                    fontSize: 15,
                    backgroundColor: '#92d5d1',
                    displayText: text2
                });
                break;
            case 21:
                this.setState({
                    fontSize: 18,
                    backgroundColor: '#71c4be',
                    displayText: text3
                });
                break;

            case 22:
                this.setState({
                    fontSize: 21,
                    backgroundColor: '#55aea8',
                    displayText: text1
                });
                break;

            case 23:
                this.setState({
                    fontSize: 24,
                    backgroundColor: '#3b928b',
                    displayText: text2
                });
                break;

            case 24:
                this.setState({
                    fontSize: 27,
                    backgroundColor: '#2c7a73',
                    displayText: text3
                });
                break;

            case 25:
                this.setState({
                    fontSize: 12,
                    backgroundColor: '#d4d3fe',
                    displayText: text1
                });
                break;

            case 26:
                this.setState({
                    fontSize: 15,
                    backgroundColor: '#c0c1fd',
                    displayText: text2
                });
                break;

            case 27:
                this.setState({
                    fontSize: 18,
                    backgroundColor: '#a6a6fc',
                    displayText: text3
                });
                break;

            case 28:
                this.setState({
                    fontSize: 21,
                    backgroundColor: '#8a8af0',
                    displayText: text1
                });
                break;

            case 29:
                this.setState({
                    fontSize: 24,
                    backgroundColor: '#7071e2',
                    displayText: text2
                });
                break;

            case 30:
                this.setState({
                    fontSize: 27,
                    backgroundColor: '#585cd3',
                    displayText: text3
                });
                break;

            default:
                return "Null";
        }
    }

}


const styles = StyleSheet.create({
    container: Object.assign(Constant.getContainer("#FFF"), {
        alignItems:'center',
        justifyContent:'center',
        paddingLeft: 22,
        paddingRight:22,
    }),
    textDetail:{
        color: '#FFF',
        fontFamily: Constant.font700,
        textAlign: 'center',
        alignSelf: 'center'
    },
    txtBottom:{
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        fontFamily: Constant.font500,
        padding: 10
    },
});

const mapStateToProps = state => {
    return {
        exercise_number_brain_training: state.metaData.metaData.exercise_number_brain_training || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(BrainActivity);