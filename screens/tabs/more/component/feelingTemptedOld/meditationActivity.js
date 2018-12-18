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
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import MeditationImage from '../../../../today/component/exerices/meditationComponent/meditationImage';
import Constant from "../../../../../helper/constant";
import RNAudioStreamer from 'react-native-audio-streamer';
import Pagination from '../../../../today/exercises/meditation/mediationPagination';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import BackgroundTimer from 'react-native-background-timer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStatusBar from '../../../../commonComponent/statusBar';
let Sound = require('react-native-sound');
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
let interval2 = null;
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
            title: "Silence",
            progressVal: 0,
            isPlaying: true,
            interval1Id: null,
            topLabel: minutes + " minutes remaining",
            showLoader: false,
            isPageChanged: false
        };
        isCompleted = false;
    }

    componentWillMount(){
        interval1=null;
        interval2=null;
        interval5=null;
        finalTimer=null;
        counter = 0;
    }

    componentDidMount() {
        this.setTitle(this.state.currentIndex);
        this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this));
        this.setPlayer();
        this.setDemoTimer();
    }

    componentWillUnmount() {
        if(this.subscription){
            this.subscription.remove();
        }
        this.clearIntervals();
    }

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
        this.clearIntervals();
        //this.props.navigation.goBack();
        this.props.navigation.state.params.onGoBack();
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
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
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
                    if(!isCompleted){
                        isCompleted = true;
                        RNAudioStreamer.pause();
                        setTimeout(()=>{
                            setTimeout(()=>{
                                this.onEndPlaySound();
                                setTimeout(()=>{
                                    this.onCompleteActivity();
                                },2000);
                            },2000);
                        },900);
                    }
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
        // this.props.navigation.goBack();
        this.props.navigation.state.params.onGoBack();
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
        this.clearIntervals();
        // this.props.navigation.goBack();
        this.props.navigation.state.params.onGoBack();
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
        const {container, timeText, silentView, backView,
            titleText, cancelText, cancelView, pageText, points, pointsAndroid} = styles;
        return (
            <View style={container}>
                <AppStatusBar isHidden={true}/>
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
                                            borderWidth:20,borderColor:'transparent',borderRadius:70,
                                            backgroundColor:'transparent',
                                            width:140, justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            <Image resizeMode="contain" style={{height:100,backgroundColor:'transparent',
                                                width:100,transform: [{ rotate: '90deg', }]}}
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
                            color={"#FFF"}/>
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

                <TouchableHighlight onPress={() => this.onCancel()}
                                    style={[backView,{top:10+this.props.safeAreaInsetsDefault.top}]}
                                    underlayColor={Constant.transparent}>
                    <Ionicons name='ios-arrow-back'
                              size={35}
                              color="#FFF"/>
                </TouchableHighlight>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5c065'
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
    backView:{
        height:60,
        width:60,
        position:'absolute',
        // top:10,
        left:10,
        paddingLeft:5,
        paddingTop:10,
        backgroundColor: Constant.transparent
    },
    pointsAndroid: {
        alignSelf:'center',
    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsDefault:state.user.safeAreaInsetsDefault,
        meditationTime: state.metaData.meditationTime || 10,
    };
};

export default connect(mapStateToProps, {
})(MeditationActivity);

/*
 <TouchableOpacity onPress={()=> this.onCancel()}
 style={[cancelView,{backgroundColor:'transparent'}]}>
 <Text style={cancelText}>
 Cancel
 </Text>
 </TouchableOpacity>
 * */