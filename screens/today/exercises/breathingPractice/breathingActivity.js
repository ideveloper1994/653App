import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    Animated,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import SpeedControl from '../../component/exerices/breathingComponent/bottomSpeedControl'
import * as Animatable from 'react-native-animatable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
let Sound = require('react-native-sound');
import _ from 'lodash';
import BreathingPracticeInit from './breathingPracticeInit';
import KeepAwake from 'react-native-keep-awake';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';


let zoomIn = 4000, zoomOut = 3000;
let totalTimeOut = 0;
let intervalId1 = null;
let intervalId2 = null;
let isMounted = false;

let isCompleted = false;

class BreathingActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            breathingTempo: "Normal",
            breathingTempoNo: 3,
            isMute: false,
            roundText: 'Get ready',
            isAnimationStarted: false,
            activityTimeOut: null,
            labelInterval: null,
            labelText: "",
            isInstruction: true,
            interval1: null,
            interval2: null,
            params: props.navigation.state.params,
            exercise_number_breathing: props.exercise_number_breathing,
        };
        this.playbackInstance = null;
        this.position = new Animated.Value(150);
    }

    componentWillUnmount() {
        isMounted = false;
        this.clearAllIntervals();
        callTodayScreenEcentListner();
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        callTodayScreenEcentListner(false);
        let exeNo = this.props.exercise_number_breathing;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo -= 1;
            }
            this.setState({
                exercise_number_breathing: exeNo
            });
        }
        isMounted = true
        isCompleted = false;
    };

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    clearAllIntervals = () => {
        if(this.state.activityTimeOut){
            clearTimeout(this.state.activityTimeOut);
            clearInterval(this.state.labelInterval);
        }
        if(intervalId1){
            clearTimeout(intervalId1);
        }
        if(intervalId2){
            clearTimeout(intervalId2);
        }
    };

    // getTempNo = () => {
    //     switch (this.state.breathingTempo || "Normal") {
    //         case 'Slowest':
    //             return 1;
    //         case 'Slow':
    //             return 2;
    //         case 'Normal':
    //             return 3;
    //         case 'Fast':
    //             return 4;
    //         case 'Fastest':
    //             return 5;
    //         default:
    //             return 3;
    //     }
    // };

    //Call when activity started
    startActivity = () => {
        let timeOut = 0;
        let completed =  this.state.exercise_number_breathing;
        if(completed >= 15) {
            timeOut = 60000 * 10;
            totalTimeOut = 10;
        }else if(completed >= 10) {
            timeOut = 60000 * 8;
            totalTimeOut = 8;
        }else if(completed >= 5) {
            timeOut = 60000 * 5;
            totalTimeOut = 5;
        }else{
            timeOut = 60000 * 3;
            totalTimeOut = 3;
        }
        let activityTimeOut = setTimeout(() => {
            setTimeout(()=>{
                if(!isCompleted && isMounted){
                    this.onCompleteActivity();
                }
                isCompleted = true;
            },3000);
        }, timeOut);

        let labelInterval = setInterval(() => {
            if(totalTimeOut > 1){
                totalTimeOut = totalTimeOut - 1;
                this.setState({
                    labelText: (totalTimeOut == 1) && totalTimeOut + " minute remaining" || totalTimeOut + " minutes remaining"
                });
            }
        }, 60000);

        this.setState({
            labelText: (totalTimeOut == 1) && totalTimeOut + " minute remaining" || totalTimeOut + " minutes remaining",
            labelInterval: labelInterval,
            activityTimeOut: activityTimeOut
        });
    };

    //api call and update state when complete activity
    onCompleteActivity = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.clearAllIntervals();
        KeepAwake.deactivate();
        if(this.playbackInstance != null) {
            this.playbackInstance = null
        }
        isMounted = false;
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            let activityNo = this.props.exercise_number_breathing;
            this.state.params.onCompleteExercises(this.state.params.pageName);
            activityNo += 1;
            this.props.updateMetaData({ exercise_number_breathing: activityNo }, this.state.params.improve || []);

            if(this.state.params.isOptional){
                // this.props.navigator.push(Router.getRoute("completeOptionalActivity",
                //     {title: "Breathing exercise complete", data: ["Stress"]}));
                this.props.navigation.navigate('completeOptionalActivity',{title: "Breathing exercise complete", data: ["Stress"]})
            }else{
                if(this.state.params.isLast){
                    this.props.navigation.navigate("completeMorningRoutine");
                }else{
                    this.state.params.makeFadeInAnimation();
                    this.props.navigation.goBack();
                }
            }
        }
    };

    onCancelBtnPress=()=>{
        this.clearAllIntervals();
    };

    //Set Mute and unMute
    onVolumeBtnPress = () => {
        if(this.playbackInstance != null) {
            if(this.state.isMute) {
                this.playbackInstance.setVolume(1);
            }else{
                this.playbackInstance.setVolume(0);
            }
        }
        this.setState({
            isMute: !this.state.isMute,
        });
    };

    //Breathing Animation
    //Slowest    in - 6  pause=1.5   out=5
    //Slow      in - 5  pause=1.5   out=4
    //Normal   in - 4  pause=1.5   out=3
    //fast    in - 3.2  pause=1.5   out=2.5
    //fastest    in - 3  pause=1.5   out=2
    setAnimationCircle() {
        if(isMounted){
            intervalId1 = setTimeout(() => {
                this.playSound(1);
                this.setState({roundText: "Breathe in"});
                Animated.timing(this.position, {
                    toValue: 300,
                    duration: zoomIn
                }).start(() => {
                    intervalId2 = setTimeout(() => {
                        if(isMounted){
                            this.playSound(2);
                        }
                        this.setState({roundText: "Breathe out"});
                        Animated.timing(this.position, {
                            toValue: 150,
                            duration: zoomOut
                        }).start(() => {
                            this.setAnimationCircle()
                        });
                    }, 1500);
                });
            }, 1500);
        }else{
            this.clearAllIntervals();
        }
    }

    //Play sound
    playSound = (breathingMode) => {
        let tempo = this.state.breathingTempo;
        let fileName = "";
        switch (tempo) {
            case 'Slowest':
                fileName = (breathingMode == 1) ? "breathe_in_slowest.mp3" : "breathe_out_slowest.mp3";
                break;
            case 'Slow':
                fileName = (breathingMode == 1) ? "breathe_in_slow.mp3" : "breathe_out_slow.mp3";
                break;
            case 'Normal':
                fileName = (breathingMode == 1) ? "breathe_in_normal.mp3" : "breathe_out_normal.mp3";
                break;
            case 'Fast':
                fileName = (breathingMode == 1) ? "breathe_in_fast.mp3" : "breathe_out_fast.mp3";
                break;
            case 'Fastest':
                fileName = (breathingMode == 1) ? "breathe_in_fastest.mp3" : "breathe_out_fastest.mp3";
                break;
            default:
                fileName = (breathingMode == 1) ? "breathe_in_slowest.mp3" : "breathe_out_slowest.mp3";
                break;
        }
        this.setSound(fileName);
    };

    //Set Sound Instance
    setSound = (fileName) => {
        if (this.playbackInstance != null) {
            this.playbackInstance.stop();
            this.playbackInstance = null;
        }
        Sound.setCategory('Playback');
        let whoosh = new Sound(fileName,Sound.MAIN_BUNDLE,
            (error) => {
                if (error) {
                    return;
                }else{
                    whoosh.play((success) => {
                        if (success) {
                        } else {
                        }
                    });
                    if(this.state.isMute) {
                        whoosh.setVolume(0);
                    }else{
                        whoosh.setVolume(1);
                    }
                    // whoosh.setNumberOfLoops(-1);
                    this.playbackInstance = whoosh;
                }
            });
    };

    //Set Breathing Animation interval on press speed
    setValues = (tempo = "Normal") => {
        this.setState({ breathingTempo: tempo });
        //Change the sound
        switch (tempo) {
            case 'Slowest':
                zoomIn = 6000;
                zoomOut = 5000;
                break;
            case 'Slow':
                zoomIn = 5000;
                zoomOut = 4000;
                break;
            case 'Normal':
                zoomIn = 4000;
                zoomOut = 3000;
                break;
            case 'Fast':
                zoomIn = 3500;//3200
                zoomOut = 2500;
                break;
            case 'Fastest':
                zoomIn = 3000;
                zoomOut = 2000;
                break;
            default:
                zoomIn = 4000;
                zoomOut = 3000;
                break;
        }
//        this.setAnimation();

    };

    //Instruction Page
    onCloseButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.clearAllIntervals();
        this.state.params.makeFadeInAnimation();
        KeepAwake.deactivate();
        this.props.navigation.goBack();
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        setTimeout(()=>{
            this.setAnimationCircle();
            this.startActivity();
            KeepAwake.activate();
        },2000);
        this.setState({ isInstruction: false });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Stress"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <BreathingPracticeInit
                excerciseNumber = {this.state.exercise_number_breathing}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={true}
                per={per}
            />
        )
    };

    render() {
        const circleStyle = {
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.3)',
            height: this.position,
            width: this.position,
            borderRadius:  150
        };
        const {container, bottomText,txtBottom} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(122,121,255)'/>
                <View style={{flex:1}}>

                    <View style={{left:0, bottom:0, top:0, right:0, position: 'absolute',
                        alignItems: 'center', justifyContent: 'center'}}>
                        <Animated.View style={circleStyle}/>
                        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(200,200,255)',
                            height: 160,width: 160,borderRadius:  80, position: 'absolute' }}>
                            <Text style={{color: '#fff', fontSize: 17, fontFamily: Constant.font500,}}>
                                {this.state.roundText}</Text>
                        </View>
                    </View>

                    <View style={{marginTop: (Constant.screenHeight*0.05-5) + this.props.safeAreaInsetsDefault.top,
                        flexDirection: 'row',alignItems: 'center', justifyContent: 'center',
                        paddingLeft: 10, paddingRight: 10}}>
                        <View style={{ height:35, width:35}} />
                        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: 15,fontFamily: Constant.font500}}>
                                { "Breathing" } </Text>
                        </View>
                        <TouchableHighlight onPress={() => this.onVolumeBtnPress()}
                                            underlayColor={Constant.transparent}>
                            <Image source={(this.state.isMute) && {uri:'icon_sound_mute'} || {uri:'icon_sound'}}
                                   style={{ height:35, width:35}}/>
                        </TouchableHighlight>
                    </View>
                    <View style={{alignItems: 'center',marginTop: Constant.screenHeight*0.02}}>
                        <Text style={{color: '#c4c3fa', fontSize: 14,fontFamily: Constant.font500}}>
                            { this.state.labelText }</Text>
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row',
                        width: "82%", alignSelf:'center',position:'absolute', height:30, top: Constant.screenHeight*0.83}}>
                        <SpeedControl speed="Slowest" speedNo = {1} breathingTempo={this.state.breathingTempo}
                                      setValues={this.setValues} breathingTempoNo={this.state.breathingTempoNo}/>

                        <SpeedControl speed="Slow" speedNo = {2} breathingTempo={this.state.breathingTempo}
                                      setValues={this.setValues} breathingTempoNo={this.state.breathingTempoNo}/>

                        <SpeedControl speed="Normal" speedNo= {3} breathingTempo={this.state.breathingTempo}
                                      setValues={this.setValues} breathingTempoNo={this.state.breathingTempoNo}/>

                        <SpeedControl speed="Fast" speedNo = {4} breathingTempo={this.state.breathingTempo}
                                      setValues={this.setValues} breathingTempoNo={this.state.breathingTempoNo}/>

                        <SpeedControl speed="Fastest" speedNo = {5} breathingTempo={this.state.breathingTempo}
                                      setValues={this.setValues} breathingTempoNo={this.state.breathingTempoNo}/>

                    </View>
            <View style={{top:Constant.screenHeight*0.92-10, left:0, right:0, bottom:0,
                        position: 'absolute', alignItems: 'center'}}>
                        <TouchableOpacity onPress={()=> this.onCloseButtonPress()}
                                          underlayColor={Constant.transparent}>
                            <Text style={txtBottom}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {(this.state.isInstruction) ?
                        this.renderInitComponent()
                        : null }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: Constant.getContainer("rgb(122,121,255)"),
    bottomText:{
        textAlign: 'center',
        color: '#FFF',
        fontSize: 15,
        fontFamily: Constant.font500,
    },
    txtBottom:{
        fontSize: 15,
        color: '#c4c3fa',
        textAlign: 'center',
        fontFamily: Constant.font500,
        padding: 10
    },
});

const mapStateToProps = state => {
    return {
        exercise_number_breathing: state.metaData.metaData.exercise_number_breathing || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,

    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(BreathingActivity);