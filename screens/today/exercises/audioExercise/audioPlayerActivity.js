import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import RewiringExerciseInit from './rewiringExerciseInit';
import RNAudioStreamer from 'react-native-audio-streamer';
import AudioContainer from '../../component/exerices/audioActivity/audioViewContainer';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';
import audioActivity from "../../../tabs/more/component/audioExercises/audioActivity";
let Sound = require('react-native-sound');

let intervalId = null;
let totalDuration = 0;
let isMoving = false;

class AudioActivity extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            progressVal: 0,
            isLoading: true,
            isPlaying: false,
            isInstruction: true,
            status: "",
            params: props.navigation.state.params,
            exercise_number_audio: props.exercise_number_audio || 1,
        };
        isMoving = false;
    }

    componentWillMount() {
        try{
            let exeNo = this.props.exercise_number_audio;
            if(this.props.navigation.state.params.isReplay){
                if(exeNo > 1){
                    exeNo = exeNo - 1;
                }
            }else{
                if(exeNo > 35){
                    exeNo = 1;
                }
            }
            this.setPlayer(exeNo);
            this.setState({
                exercise_number_audio: exeNo
            });
            totalDuration = 0;
            this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this));
            callTodayScreenEcentListner(false);
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    }

    componentWillUnmount() {
        try{
            this.clearTimer();
            RNAudioStreamer.pause();
            callTodayScreenEcentListner();
            if(this.subscription){
                this.subscription.remove();
            }
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    }

    _statusChanged (status){
        try{
            if(status == "BUFFERING" && this.state.isLoading){

            }
            if(status == "PLAYING" && this.state.isLoading){
                RNAudioStreamer.pause();
                this.setState({
                    isLoading: false,
                });
            }
            if(status == "FINISHED") {
                setTimeout(()=>{
                    this.onEndPlaySound();
                    setTimeout(()=>{
                        this.setState({isPlaying: false, progressVal: 0, status: "FINISHED"});
                        this.onCompleteAudio();
                        if(this.subscription){
                            this.subscription.remove();
                        }
                    },2000);
                },2000);
                this.clearTimer();
            }else{
                this.setState({status: status});
            }
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    };

    clearTimer() {
        if(intervalId) {
            clearInterval(intervalId);
        }
    }

    setTimer() {
        intervalId =  setInterval(() => {
            this.getCurrentTime()
        }, 1000);
    }

    getCurrentTime = () => {
        try{
            let audioDuration = 0;
            RNAudioStreamer.duration((err, duration) => {
                if (!err) {
                    audioDuration = duration;
                    totalDuration = audioDuration;
                }
            });

            RNAudioStreamer.currentTime((err, currentTime)=>{
                if(!err) {
                    if(this.state.isPlaying && audioDuration > 0) {
                        let progress = parseInt((currentTime * 100)/audioDuration);
                        if(!isMoving){
                            this.setState({ progressVal:(progress >= 98) ? 100 : progress});
                        }
                    }
                }
            });
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    };

    updateProgressValue = (value) => {
        // let progress = value;
        this.setState({ progressVal:value});
        isMoving = true;
    }

    seekToTime = (angle, fillVal) => {
        let seekToTime = angle*totalDuration/360;
        if(seekToTime<totalDuration){
            RNAudioStreamer.seekToTime(seekToTime);
            this.setState({ progressVal:fillVal});
        }
        setTimeout(()=>{
            isMoving = false;
        },200)
    }

    setPlayer = (exNo, isFinished = false) => {
        try{
            RNAudioStreamer.pause();
            let audioUrl = "https://s3.amazonaws.com/brainbuddyhostingapp/Exercises/exercise" + exNo + ".mp3";
            // let audioUrl = "https://s3.amazonaws.com/brainbuddyhostingapp/Exercises/exercise5.mp3";
            // let audioUrl = "https://8cdxlx00-a.akamaihd.net/downloads/ringtones/files/mp3/kamariyapagalworldorgringtoneringtone-42682.mp3";
            RNAudioStreamer.setUrl(audioUrl);
            //RNAudioStreamer.pause();
            RNAudioStreamer.play();
            this.setTimer();
            if(isFinished){
                RNAudioStreamer.play();
                this.setTimer();
                this.setState({isPlaying: true});
            }
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    }

    onPlayPausePressed = () => {
        if(this.state.isPlaying){
            RNAudioStreamer.pause();
            this.setState({isPlaying: false});
            this.clearTimer();
        }else {
            if(this.state.status == "FINISHED"){
                this.setPlayer(this.state.exercise_number_audio, true)
            }else{
                RNAudioStreamer.play();
                this.setTimer();
                this.setState({isPlaying: true});
            }
        }
    };

    getTimestamp() {
        if(totalDuration != 0){
            let minTime = Math.round(totalDuration/60);
            return minTime + ' minutes';
        }
        return '';
    }

    onEndPlaySound = () => {
        Sound.setCategory('Playback');
        let whoosh = new Sound("time_done.mp3",Sound.MAIN_BUNDLE,
            (error) => {
                if (error) {
                    return;
                }else{
                    whoosh.play((success) => {
                        if (success) {
                        } else {
                        }
                    });
                }
            });
    }

    onCompleteAudio = () => {
        try{
            this.clearTimer();
            RNAudioStreamer.pause();
            if(this.state.params.isReplay){
                this.state.params.makeFadeInAnimation();
                callTodayScreenEcentListner();
                this.props.navigation.goBack();
            }else{
                let activityNo = this.props.exercise_number_audio;
                if(activityNo >= 35){
                    AsyncStorage.setItem('completedAllAudioExercises', "Completed");
                    this.props.updateMetaData({audio_exercises_completed: true});
                    if(activityNo > 35){
                        activityNo = 1;
                    }else{
                        activityNo = activityNo + 1;
                    }
                }else{
                    activityNo = activityNo + 1;
                }
                this.state.params.onCompleteExercises(this.state.params.pageName);
                this.props.updateMetaData({ exercise_number_audio: activityNo }, this.state.params.improve || []);
                if(this.state.params.isOptional) {
                    this.props.navigation.navigate("completeOptionalActivity",{title: "Audio activity complete", data: ["Wisdom"]})
                }else{
                    this.state.params.makeFadeInAnimation();
                    this.props.navigation.goBack();
                    callTodayScreenEcentListner();
                }
            }
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    };

    onBackButtonPress = () => {
        this.clearTimer();
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack();
    };

    //Instruction Page
    onCloseButtonPress = () => {
        this.clearTimer();
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack();
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        RNAudioStreamer.play();
        this.setState({ isInstruction: false, isPlaying: true });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Wisdom"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <RewiringExerciseInit
                excerciseNumber = {this.state.exercise_number_audio}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {!this.state.isLoading}
                per={per}/>
        )
    };

    render() {
        const {container,cancelText,cancelView} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(49,165,159)'/>
                <View style={container}>
                    <AudioContainer exercise_number_audio={this.state.exercise_number_audio}
                                    progressVal={this.state.progressVal}
                                    isLoading={this.state.isLoading}
                                    isPlaying={this.state.isPlaying}
                                    onPlayPausePressed={this.onPlayPausePressed}
                                    getTimestamp={this.getTimestamp()}
                                    isHideBackBtn={true}
                                    updateProgressValue={this.updateProgressValue}
                                    seekToTime={this.seekToTime}
                                    status={this.state.status}
                                    onBackButtonPress={this.onBackButtonPress}/>

                    <TouchableOpacity onPress={()=> this.onBackButtonPress()} style={cancelView}>
                        <Text style={cancelText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    {(this.state.isInstruction) ?
                        this.renderInitComponent()
                        : null }

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: Constant.getContainer("rgb(49,165,159)"),
    cancelText:{
        paddingBottom:10,
        textAlign:'center',
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize: 15,
        opacity: 0.7,
    },
    cancelView:{
        position: 'absolute',
        top: Constant.screenHeight*0.92,
        left:0, right:0,
        alignItems:'center',
    },
});

const mapStateToProps = state => {
    return {
        rewiringPlay: state.user.rewiringPlay,
        exercise_number_audio: state.metaData.metaData.exercise_number_audio || 1,
        metaData: state.metaData.metaData,
        rewiringProgress: state.metaData.rewiringProgress,
    };
};

export default connect(mapStateToProps, {
    updateMetaData,
})(AudioActivity);