import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    StatusBar,
    Alert,
    BackHandler
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import EmotionalActivityInit from './emotionalGrowthInit';
import Constant from '../../../../helper/constant';
import AppStatusBar from '../../../commonComponent/statusBar';
import _ from 'lodash';
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner, showThemeAlert} from "../../../../helper/appHelper";
import KeepAwake from 'react-native-keep-awake';
import {checkAccessAvailable} from "../../../../services/apiCall";

let count = 0;
const emotionalURL = [
    "https://player.vimeo.com/external/245278306.sd.mp4?s=505578bd11293d05431667b0573d1627300f0f6e&profile_id=165&download=1",
    "https://player.vimeo.com/external/245667175.sd.mp4?s=ad57a53a3f08d085f437b79839c27a34e495f1b8&profile_id=165&download=1",
    "https://player.vimeo.com/external/246036401.sd.mp4?s=2c186f0ccc20f72a435742fa1bd97bf88803d49c&profile_id=165&download=1",
    "https://player.vimeo.com/external/246717910.sd.mp4?s=99a7ec83ac07d1795b88a541f88ac36d1a4499e6&profile_id=165&download=1",
    "https://player.vimeo.com/external/246736356.sd.mp4?s=17eb46dc02bd4488a1f477870b16e870ea3926cf&profile_id=165&download=1"];

class EmotionalActivity extends Component {

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
        this.state= {
            exercise_number_emotion: props.exercise_number_emotion || 1,
            params: props.navigation.state.params,
            isShowing: true,
            isLoad:true,
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            controls: false,
            paused: false,
            skin: 'custom',
            ignoreSilentSwitch: null,
            isBuffering: false,
            isInstruction: true,
            url: emotionalURL[0],
            position: 'relative'
        }
    }


    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
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
        this.setState({
            exercise_number_emotion: exeNo,
            url: url
        });
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

    componentDidMount(){
        callTodayScreenEcentListner(false);
    }

    onCompleteVideo = () => {
        KeepAwake.deactivate();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }

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

    onLoad(data) {
        // this.setState({
        //     duration: data.duration,
        // });
        this.setState({ isLoad:false, paused: true });
    }

    onProgress(data) {
        this.setState({currentTime: data.currentTime});
    }

    onBuffer({ isBuffering }) {
        // if(this.state.isInstruction) {
        //     alert("call1")
        //     if(!isBuffering && count != 0) {
        //         alert("call")
        //         this.setState({ isLoad:false, paused: true });
        //     }
        //     ++count;
        // }
    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }

    //Instruction Page
    onCloseButtonPress = () => {
        KeepAwake.deactivate();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));
        this.props.navigation.popToTop();
    };

    onActivityButtonPress = () => {
        KeepAwake.activate();
        this.state.params.scrollToTopToday();
        this.setState({ isInstruction: false, paused: false, controls: true, position: 'absolute' });
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
                isClickable={!this.state.isLoad}
                per={per}/>
        )
    };

    renderCustomSkin() {
        // const flexCompleted = this.getCurrentTimePercentage() * 100;
        // const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
//https://s3.amazonaws.com/brainbuddyhostingapp/Imagine/imagine-3.mp4
        //<TouchableOpacity style={styles.fullScreen} onPress={() => {this.setState({paused: !this.state.paused})}}>
        //</TouchableOpacity>
        return (
            <View style={styles.container}>
                <AppStatusBar backColor={"#000"}/>
                <Video
                    source={{ uri: this.state.url}}
                    style={[styles.fullScreen,{
                           position: this.state.position
                       }]}
                    rate={this.state.rate}
                    paused={this.state.paused}
                    volume={this.state.volume}
                    muted={this.state.muted}
                    ignoreSilentSwitch={this.state.ignoreSilentSwitch}
                    resizeMode={this.state.resizeMode}
                    onLoad={this.onLoad}
                    onBuffer={this.onBuffer}
                    onProgress={this.onProgress}
                    onEnd={() => this.onCompleteVideo()}
                    repeat={false}
                    controls={true}/>

                <TouchableHighlight onPress={() => this.onCloseButtonPress()}
                                    style={styles.backView}
                                    underlayColor={Constant.transparent}>
                    <Ionicons name='ios-arrow-back'
                              size={35}
                              color="#FFF"/>
                </TouchableHighlight>
                {
                    (this.state.isInstruction) &&
                    this.renderInitComponent() || null
                }

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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    fullScreen: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        backgroundColor: "transparent",
        borderRadius: 5,
        position: 'absolute',
        bottom: 10,
        left: 5,
        right: 5,
    },
    backView:{
        height:60,
        width:60,
        position:'absolute',
        top:10,
        left:10,
        paddingLeft:5,
        paddingTop:10,
        backgroundColor:Constant.transparent
    },
    outerView:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: Constant.transparent,
        height:50,
        bottom: 10,
        left: 5,
        right: 5,
        position: 'absolute'
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 2,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 5,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 5,
        backgroundColor: '#2C2C2C',
    },
    generalControls: {
        flex: 1,
        flexDirection: 'row',
        // overflow: 'hidden',
        justifyContent: 'center',
        alignItems:'center'
    },
    skinControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    rateControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    volumeControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resizeModeControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ignoreSilentSwitchControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    controlOption: {
        alignSelf: 'center',
        fontSize: 11,
        color: "white",
        paddingLeft: 2,
        paddingRight: 2,
        lineHeight: 12,
    },
    nativeVideoControls: {
        top: 184,
        height: 300
    }
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