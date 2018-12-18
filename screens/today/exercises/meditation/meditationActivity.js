import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableHighlight,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import MeditationImage from '../../component/exerices/meditationComponent/meditationImage';
import Constant from "../../../../helper/constant";
import RNAudioStreamer from 'react-native-audio-streamer';
import MeditationInit from './meditationInit';
import Pagination from './mediationPagination';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {NavigationActions} from 'react-navigation';
import BackgroundTimer from 'react-native-background-timer';
import KeepAwake from 'react-native-keep-awake';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
let random = Math.random();
let Sound = require('react-native-sound');

import AppStatusBar from '../../../commonComponent/statusBar';

const ImageList = {
    ImageRainforest:{uri: 'meditation_bg_blur_rain'},
    AudioRainforest:'https://s3.amazonaws.com/brainbuddyhostingapp/Escape/rainforest.mp3',

    ImageBeach:{uri: 'meditation_bg_blur_waves'},
    AudioBeach:'https://s3.amazonaws.com/brainbuddyhostingapp/Escape/beach.mp3',

    ImageCreek:{uri: 'meditation_bg_blur_creek'},
    AudioCreek:'https://s3.amazonaws.com/brainbuddyhostingapp/Escape/creek.mp3',

    ImageThunder:{uri: 'meditation_bg_blur_storm'},
    AudioThunder:'https://s3.amazonaws.com/brainbuddyhostingapp/Escape/thunderstorm.mp3',

    ImageMoon:{uri: 'meditation_bg_blur_moonlight'},
    AudioMoon:'https://s3.amazonaws.com/brainbuddyhostingapp/Escape/moonlight.mp3',
};
let currentSeconds = 0;
let counter = 1;
let interval1 = null;
let  interval2 = null;
let interval5 = null;
let finalTimer = null;

let isCompleted = false;

class MeditationActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        let minutes = props.meditationTime || 10;
        this.state = {
            currentIndex: 0,
            minutes: minutes,
            isInstruction: true,
            title: "Silence",
            progressVal: 0,
            isPlaying: true,
            interval1Id: null,
            topLabel: minutes + " minutes remaining",
            exercise_number_meditation: props.exercise_number_meditation,
            params: props.navigation.state.params,
            showLoader: false,
            isPageChanged: false
        };
    }

    componentWillMount(){
        callTodayScreenEcentListner(false);
        if(this.props.navigation.state.params.isReplay){
            let exeNo = this.props.exercise_number_meditation;
            if(exeNo > 1){
                exeNo -= 1;
                this.setState({
                    exercise_number_meditation: exeNo
                });
            }
        }
        interval1=null;
        interval2=null;
        interval5=null;
        finalTimer=null;
        counter = 1;
        isCompleted = false;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.setTitle(this.state.currentIndex);
        this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this));
    }

    componentWillUnmount() {
        if(this.subscription){
            this.subscription.remove();
        }
        this.clearIntervals();
        callTodayScreenEcentListner();
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    _statusChanged (status) {
        if(status == "BUFFERING" && !this.state.showLoader && this.state.isPageChanged){
            this.setState({
                showLoader:true
            })
        }
        if(status == "PLAYING" && this.state.showLoader){
            this.setState({
                showLoader:false,
                isPageChanged:false
            })
        }
        if(status === "FINISHED") {
        }
    };

    setPlayer(pageNum = 0) {
        RNAudioStreamer.pause();
        let audioUrl = this.getAudioURL(pageNum);
        if(audioUrl !== "") {
            RNAudioStreamer.setUrl(audioUrl);
            if(this.state.isPlaying){
                RNAudioStreamer.play();
            }else{
                RNAudioStreamer.pause();
            }
            // RNAudioStreamer.seekToTime(1) //seconds
            RNAudioStreamer.duration((err, duration) => {
                if (!err) {
                }
            });
        }
    }

    onCompleteActivity = () => {
        if(this.subscription){
            this.subscription.remove();
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        KeepAwake.deactivate();
        this.clearIntervals();
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            // this.props.navigation.goBack();

            this.props.navigation.navigate("howDidUDo", {nextPage: 'completeMorningRoutine', isPassObj: false, transition: "fadeIn"});
        }else{
            let activityNo = this.props.exercise_number_meditation;
            activityNo += 1;
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_meditation: activityNo }, this.state.params.improve || []);
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            if(this.state.params.isLast){
                this.props.navigation.navigate("howDidUDo", {nextPage: 'completeMorningRoutine', isPassObj: false, transition: "fadeIn"});
            }else{
                this.manageMorningRoutine();
            }
        }
    };

    manageMorningRoutine = () => {
        try{
            let morningRoutine = this.props.morningRoutine;
            let obj = _.find(morningRoutine,{pageName: this.state.params.pageName});
            let nextIndex = morningRoutine.indexOf(obj) + 1;
            let isLast = (morningRoutine.length-1 == nextIndex);
            let length = morningRoutine.length;
            let introTitle= (nextIndex + 1) + " of " + length;
            this.props.navigation.navigate("howDidUDo", {nextPage: morningRoutine[nextIndex].pageName,
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
                    scrollToTopToday: this.state.params.scrollToTopToday,},
                transition: "fadeIn",
            });
        }catch (e){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.popToTop();
        }

    };

    getAudioURL = (pageNum = 0) => {
        let currentIndex = pageNum;//this.state.currentIndex;
        if(currentIndex == 1) {
            return ImageList.AudioRainforest;
        }else if(currentIndex == 2){
            return ImageList.AudioBeach;
        }else if(currentIndex == 3){
            return ImageList.AudioCreek;
        }else if(currentIndex == 4){
            return ImageList.AudioThunder;
        }else if(currentIndex == 5) {
            return ImageList.AudioMoon;
        }else{
            return "";
        }
    };

    setTitle = (currentIndex) => {
        if(currentIndex == 1){
            this.setState({ title: "Rain"});
        }else if(currentIndex == 2){
            this.setState({ title: "Waves"});
        }else if(currentIndex == 3){
            this.setState({ title: "Creek"});
        }else if(currentIndex == 4){
            this.setState({ title: "Storm"});
        }else if(currentIndex == 5) {
            this.setState({ title: "Moonlight"});
        }else{
            this.setState({ title: "Silence"});
        }
    };

    onScrollEnd = (e) => {
        try{
            let contentOffset = e.nativeEvent.contentOffset;
            let viewSize = e.nativeEvent.layoutMeasurement;
            // Divide the horizontal offse
            // t by the width of the view to see which page is visible
            let pageNum = Math.floor(contentOffset.x / viewSize.width);
            this.setTitle(pageNum);
            if(this.state.currentIndex != pageNum) {
                this.setState({
                    currentIndex: pageNum,
                    isPageChanged: true
                });
                this.setPlayer(pageNum);
            }
            if(pageNum == 0){
                this.setState({
                    showLoader: false,
                    isPageChanged: false
                });
            }
        }catch (e){
            //alert(error)
        }
    };

    setDemoTimer () {
        interval5 = BackgroundTimer.setInterval(() => {
            if(this.state.isPlaying) {
                ++counter;
                let RemainingTime = (this.props.meditationTime * 60 - counter) / (60);
                if(RemainingTime>0) {
                    // let time = Math.round(RemainingTime);
                    let counterVal = (counter*100)/(this.props.meditationTime*60);
                    let remainnig = (Math.round(RemainingTime)).toString();
                    if(remainnig == "0"){
                        remainnig = "1";
                    }

                    this.setState({
                        progressVal: counterVal,//(10 * (10 - RemainingTime)),
                        topLabel: (remainnig == "1") &&
                        remainnig + " minute remaining"
                        || remainnig + " minutes remaining",
                    })
                }else{
                    setTimeout(()=>{
                        if(!isCompleted){
                            RNAudioStreamer.pause();
                            setTimeout(()=>{
                                this.onEndPlaySound();
                                setTimeout(()=>{
                                    this.onCompleteActivity();
                                },2000);
                            },2000);
                            this.clearIntervals();
                            isCompleted = true;
                        }
                    },900);
                }
            }
        },900)
    }

    clearIntervals = () => {
        if(this.state.interval1Id != null) {
            BackgroundTimer.clearInterval(this.state.intervalId);
        }
        if(interval1 != null) {
            BackgroundTimer.clearInterval(interval1);
        }
        if(interval2 != null) {
            BackgroundTimer.clearInterval(interval2);
        }
        if(interval5 != null) {
            BackgroundTimer.clearInterval(interval5);
        }
        RNAudioStreamer.pause();
    };

    //Instruction Page
    onCloseButtonPress = () => {
        this.clearIntervals();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        KeepAwake.deactivate();
        callTodayScreenEcentListner();
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
        this.setDemoTimer();
        this.setState({ isInstruction: false, minutes: 10 });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Hypofrontality"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <MeditationInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = {this.state.exercise_number_meditation}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={true}
                per={per}
            />
        )
    };

    onPlayPausePressed = () => {
        if(this.state.isPlaying){
            RNAudioStreamer.pause();
            if(this.state.showLoader){
                this.setState({isPlaying: false, topLabel: "Paused", showLoader: false});
            }else{
                this.setState({isPlaying: false, topLabel: "Paused"});
            }
        }else {
            RNAudioStreamer.play();
            this.setState({isPlaying: true});
        }
    };

    onCancel = () => {
        KeepAwake.deactivate();
        this.clearIntervals();
        //this.props.navigation.navigate("today",{isFadeToday: true})
        callTodayScreenEcentListner();
        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));
        this.props.navigation.popToTop();
    };

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

    render() {
        const {container, timeText, silentView,
            titleText, cancelText, cancelView, pageText, points, pointsAndroid} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor="#000" isHidden={true}/>
                <View style={container}>
                    <ScrollView style={container}
                                bounces={false}
                                pagingEnabled={true}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={this.onScrollEnd}>

                        <View style={silentView}/>

                        <MeditationImage ImageSource={ImageList.ImageRainforest}/>

                        <MeditationImage ImageSource={ImageList.ImageBeach}/>

                        <MeditationImage ImageSource={ImageList.ImageCreek}/>

                        <MeditationImage ImageSource={ImageList.ImageThunder}/>

                        <MeditationImage ImageSource={ImageList.ImageMoon}/>

                    </ScrollView>

                    <Text style={[titleText,{backgroundColor:'transparent'}]}>
                        Meditation
                    </Text>

                    <Text style={[timeText,{backgroundColor:'transparent'}]}>
                        {this.state.topLabel}
                    </Text>


                    <View style={{alignItems:'center', alignSelf:'center', position:'absolute',
                        top: Constant.fullScreenHeight/2-80}}>
                        <AnimatedCircularProgress style={{transform: [{ rotate: '270deg'}], backgroundColor:'transparent'}}
                                                  size={160}
                                                  width={10}
                                                  linecap={'round'}
                                                  fill={this.state.progressVal}
                                                  tintColor="rgb(255,255,255)"
                                                  backgroundColor="rgba(255,255,255,0.4)">
                            {
                                (fill) => (
                                    <View style={Constant.isIOS && points || pointsAndroid}>
                                        <TouchableHighlight
                                            underlayColor={Constant.transparent}
                                            onPress={() => this.onPlayPausePressed()}
                                            disabled={this.state.isLoading}>
                                            <View style={{height:140,
                                                borderWidth:20,borderColor:'transparent',borderRadius:70,backgroundColor:'transparent',
                                                width:140, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image resizeMode="contain" style={{height:100,backgroundColor:'transparent',
                                                    width:100,transform: [{ rotate: '90deg'}]}}
                                                       source={(this.state.isPlaying) && {uri: 'button_pause'} || {uri: 'button_play'}}/>
                                            </View>

                                        </TouchableHighlight>
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress>
                    </View>

                    {
                        (this.state.showLoader) &&
                        <View style={{top: Constant.fullScreenHeight*0.77-42, position:'absolute', alignSelf:'center'}}>
                            <ActivityIndicator
                                animating={true}
                                size="small"
                                color={"#fff"}/>
                        </View>
                        || null
                    }

                    <Text style={[pageText,{backgroundColor:'transparent'}]}>
                        {this.state.title}
                    </Text>

                    <View style={{top: Constant.fullScreenHeight*0.77+38, position:'absolute', alignSelf:'center'}}>
                        <Pagination noOfPages={6}
                                    selectedIndex={this.state.currentIndex}
                                    activeDotColor="#FFF"
                                    inActiveDotColor="rgba(255,255,255,0.5)"/>
                    </View>

                    <TouchableOpacity onPress={()=> this.onCancel()}
                                      style={[cancelView,{backgroundColor:'transparent'}]}>
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
    container: {
        flex: 1,
        backgroundColor: "#f5c065"
    },
    silentView:{
        backgroundColor: "#f5c065",
        width: Constant.screenWidth,
        height: Constant.fullScreenHeight
    },
    titleText:{
        position: 'absolute',
        top: Constant.fullScreenHeight*0.125,
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font300,
        fontSize: 24,
    },
    timeText: {
        position: 'absolute',
        top: Constant.fullScreenHeight*0.186,
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize: 15,
        opacity: 0.7
    },
    pageText:{
        position: 'absolute',
        top: Constant.fullScreenHeight*0.77,
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize: 18
    },
    cancelView:{
        position: 'absolute',
        top: Constant.fullScreenHeight*0.92,
        left:0, right:0,
        alignItems:'center',
    },
    cancelText:{
        paddingBottom:10,
        textAlign:'center',
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize: 15,
        opacity: 0.7,
    },
    points: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top:0,
        height:140,
        width:140,
        alignSelf:'center',
        borderRadius:70
    },
    pointsAndroid: {
        alignSelf:'center',
    },

});

const mapStateToProps = state => {
    return {
        exercise_number_meditation: state.metaData.metaData.exercise_number_meditation || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
        meditationTimeOnBackground: state.user.meditationTimeOnBackground,
        meditationTime: state.metaData.meditationTime || 10,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(MeditationActivity);