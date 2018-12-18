import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    NativeEventEmitter,
    NativeModules,
    StatusBar
} from 'react-native';
import { updateMetaData } from '../../../../actions/metadataActions';
import Constant from '../../../../helper/constant';
import EmotionalActivityInit from './emotionalGrowthInit';
import { connect } from 'react-redux';
let customVideoPlayer = require('NativeModules').customVideoPlayer;
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner, showThemeAlert} from "../../../../helper/appHelper";
import RNAudioStreamer from "react-native-audio-streamer";
import {checkAccessAvailable} from "../../../../services/apiCall";
let isAlreadyClicked = false;

const emotionalURL = [
    "https://player.vimeo.com/external/245278306.sd.mp4?s=505578bd11293d05431667b0573d1627300f0f6e&profile_id=165&download=1",
    "https://player.vimeo.com/external/245667175.sd.mp4?s=ad57a53a3f08d085f437b79839c27a34e495f1b8&profile_id=165&download=1",
    "https://player.vimeo.com/external/246036401.sd.mp4?s=2c186f0ccc20f72a435742fa1bd97bf88803d49c&profile_id=165&download=1",
    "https://player.vimeo.com/external/246717910.sd.mp4?s=99a7ec83ac07d1795b88a541f88ac36d1a4499e6&profile_id=165&download=1",
    "https://player.vimeo.com/external/246736356.sd.mp4?s=17eb46dc02bd4488a1f477870b16e870ea3926cf&profile_id=165&download=1"];

class EmotionalActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state={
            exercise_number_emotion: props.exercise_number_emotion || 1,
            params: props.navigation.state.params
        }
    }

    componentDidMount(){
        callTodayScreenEcentListner(false);
        isAlreadyClicked = false;
    }

    componentWillMount(){
        let exeNo = this.props.exercise_number_emotion;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 5){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_emotion: exeNo
        });

        //https://s3.amazonaws.com/brainbuddyhostingapp/Emotion/emotion-[emotion exercise number].mp4
        // let url = "https://s3.amazonaws.com/brainbuddyhostingapp/Emotion/emotion-"+ exeNo +".mp4";
        let url = emotionalURL[0];
        if(exeNo <= 5){
            let index = exeNo - 1;
            url = emotionalURL[index];
        }
        customVideoPlayer.showVideoPlayer(url);
        // customVideoPlayer.showVideoPlayer("https://s3.amazonaws.com/brainbuddyhostingapp/Emotion/emotion-1.mp4");
        const playerStatus = new NativeEventEmitter(customVideoPlayer);
        this.eventListener = playerStatus.addListener('sayHello', (data) => {
            if(data === 'Ready'){
                setTimeout(() => {
                    this.setState({
                        isBuffering:true
                    })
                },3000)
            }else if(data === 'Finish'){
                if(this.eventListener){
                    this.eventListener.remove();
                }
                this.onCompleteVideo();
            }else if(data === 'DonePress'){
                if(this.eventListener){
                    this.eventListener.remove();
                }
                // customVideoPlayer.killPlayerInstance();
                //this.props.navigation.navigate("today",{isFadeToday: true})
                // callTodayScreenEcentListner();
                // this.props.navigation.dispatch(NavigationActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
                //     ]
                // }));
                //this.props.navigation.goBack();
                this.props.navigation.popToTop();
            }
        })
        if(this.props.isConnected){
            //URL Access
            return checkAccessAvailable("https://player.vimeo.com").then(res=>{
            }).catch(err=>{
                showThemeAlert({
                    message: "Server error - Check media access is allowed on your network.",
                    leftBtn: 'OK'
                });
            });
        }
    }

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }

    state = {
        paused: false,
        isBuffering: false,
    };

    onCompleteVideo = () => {
        // customVideoPlayer.killPlayerInstance();
        StatusBar.setHidden(false);
        if(this.state.params.isReplay) {
            this.state.params.makeFadeInAnimation();
            setTimeout(()=>{
                this.props.navigation.goBack();
            },0);
        }else{
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            let activityNo = this.props.exercise_number_emotion;
            if(activityNo >= 5){
                if(activityNo > 5){
                    activityNo = 1;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.props.updateMetaData({ exercise_number_emotion: activityNo }, this.state.params.improve || []);
            if(this.state.params.isLast){
                this.props.navigation.navigate("completeMorningRoutine");
            }else{
                this.manageMorningRoutine()
            }
        }
    };

    manageMorningRoutine = () => {
        let morningRoutine = this.props.morningRoutine;
        let obj = _.find(morningRoutine,{pageName: this.state.params.pageName});
        let nextIndex = morningRoutine.indexOf(obj) + 1;
        let isLast = (morningRoutine.length-1 == nextIndex);
        let length = morningRoutine.length;
        let introTitle= (nextIndex + 1) + " of " + length;
        this.props.navigation.navigate(morningRoutine[nextIndex].pageName,
            {pageName: morningRoutine[nextIndex].pageName,
                setDoneMorningRoutine: this.state.params.setDoneMorningRoutine,
                isLast: isLast,
                isOptional: false,
                improve: morningRoutine[nextIndex].improve,
                onCompleteExercises: this.state.params.onCompleteExercises,
                makeFadeInAnimation: this.state.params.makeFadeInAnimation,
                isReplay: false,
                introTitle: introTitle,
                scrollToTopToday: this.state.params.scrollToTopToday});
    };

    //Instruction Page
    onCloseButtonPress = () => {
        customVideoPlayer.killPlayerInstance();
        if(this.eventListener){
            this.eventListener.remove();
        }
        //this.props.navigation.goBack();
        //this.props.navigation.navigate("today",{isFadeToday: true})
        setTimeout(()=>{
            // this.props.navigation.dispatch(NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
            //     ]
            // }));
            this.props.navigation.popToTop();
        },0);

    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        if(!isAlreadyClicked){
            customVideoPlayer.PlayVideo();
            isAlreadyClicked = true;
        }
        //this.setState({ isInstruction: false, paused: false });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Dopamine"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <EmotionalActivityInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = {this.state.exercise_number_emotion}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={this.state.isBuffering}
                per={per}/>
        )
    };

    renderCustomSkin() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {
                        this.renderInitComponent()
                    }
                </View>
            </View>
        );
    }

    render() {
        return  this.renderCustomSkin();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'rgb(241,86,129)',
    },
});

const mapStateToProps = state => {
    return {
        exercise_number_emotion: state.metaData.metaData.exercise_number_emotion || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
        isConnected: state.user.isConnected,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(EmotionalActivity);