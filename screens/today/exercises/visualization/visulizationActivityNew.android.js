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
import VisualizationInit from './visualizationInit';
import Constant from '../../../../helper/constant';
import AppStatusBar from '../../../commonComponent/statusBar';
import {NavigationActions} from 'react-navigation';
import KeepAwake from 'react-native-keep-awake';
import _ from 'lodash';
import {callTodayScreenEcentListner, showThemeAlert} from "../../../../helper/appHelper";
import {checkAccessAvailable} from "../../../../services/apiCall";

let count = 0;

const visulizationURL = [
    "https://player.vimeo.com/external/253886611.sd.mp4?s=9b27bef92807ddcead7114c3f931d1506256485e&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886632.sd.mp4?s=ff7ea39e7ede21c0c6b00b18053d5c2dc3e7a49f&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887169.sd.mp4?s=8e1b71911de751a7a815275e01b479964db50299&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887445.sd.mp4?s=842bb8e497cb7bf35e27f10d762c7ee4473db668&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886654.sd.mp4?s=d22c6bfc92ae098a460b4e877542e101b1fe85a3&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886681.sd.mp4?s=0dfb535d6f14aefbb850bee341c29e5234bb3747&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886614.sd.mp4?s=56e41b18fd341f3e8fa19b6ef75c6bff3a4c532a&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887185.sd.mp4?s=2815730ee78c615bc1be1711d16f4aa02f050d67&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886665.sd.mp4?s=72e67b81a314a1dcea7880ed838343fc68e39fb6&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887466.sd.mp4?s=26cd39a9a231ad3e874f9e49b26ed2f51064b391&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887193.sd.mp4?s=ebcd04fb004c7dc170539641d6b9b452c5c584fb&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886693.sd.mp4?s=407bf916b12c4339ac6f1630e67adb6020b79c86&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887205.sd.mp4?s=cf39f84b1bb1a041211a78d5f617c2229e5bc6e5&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886741.sd.mp4?s=04f0af98736dbef8d49e5b22dee5a57c4b2c0fd9&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886764.sd.mp4?s=d864cd7942a58d3bb711a33fe0c1b267a2eebc0c&profile_id=165&download=1",
    "https://player.vimeo.com/external/253887226.sd.mp4?s=f2ed2f864f793f5019319f23262dc50189eed58c&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886797.sd.mp4?s=7d8f3a5aa3bf85e46a3bc6c88ff70a3d62c66c0d&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886711.sd.mp4?s=9de93ec2d0b33bc30ba143f05c69fd738336c6a9&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886723.sd.mp4?s=bd16acc49f44308313d89aeb1572183465dc65e0&profile_id=165&download=1",
    "https://player.vimeo.com/external/253886786.sd.mp4?s=de0dbdc1eb2f07b35be6c72f05a7e47bc67d4812&profile_id=165&download=1",
];

class VisulizationActivity1 extends Component {

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
        this.state= {
            exercise_number_visualization: props.exercise_number_visualization,
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
            url: visulizationURL[0],
            position: 'relative'
        }
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        count = 0;
        StatusBar.setHidden(false);
        let exeNo = this.props.exercise_number_visualization;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 20){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_visualization: exeNo
        });
        let url = visulizationURL[0];
        if(exeNo <= 20){
            let index = exeNo - 1;
            url = visulizationURL[index];
        }
        this.setState({
            exercise_number_visualization: exeNo,
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

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }
    onCompleteVideo = () => {
        KeepAwake.deactivate();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setHidden(false);
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            let activityNo = this.props.exercise_number_visualization;
            // activityNo = (activityNo >= 20) ? 1 : ++activityNo;
            if(activityNo >= 20){
                if(activityNo > 20){
                    activityNo = 1;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_visualization: activityNo }, this.state.params.improve || []);
            if(this.state.params.isLast){
                this.props.navigation.navigate("completeMorningRoutine");
            }else{
                this.manageMorningRoutine();
            }
        }
    };

    manageMorningRoutine = () => {
        let morningRoutine = this.props.morningRoutine;
        let obj = _.find(morningRoutine, {pageName: this.state.params.pageName});
        let nextIndex = morningRoutine.indexOf(obj) + 1;

        let length = morningRoutine.length;
        let introTitle= (nextIndex + 1) + " of " + length;

        let isLast = (morningRoutine.length - 1 == nextIndex);

        this.props.navigation.navigate(morningRoutine[nextIndex].pageName,
            {
                pageName: morningRoutine[nextIndex].pageName,
                setDoneMorningRoutine: this.state.params.setDoneMorningRoutine,
                isLast: isLast,
                isOptional: false,
                improve: morningRoutine[nextIndex].improve,
                onCompleteExercises: this.state.params.onCompleteExercises,
                makeFadeInAnimation: this.state.params.makeFadeInAnimation,
                isReplay: false,
                introTitle: introTitle,
                scrollToTopToday: this.state.params.scrollToTopToday,
            });
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
            <VisualizationInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = {this.state.exercise_number_visualization}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={!this.state.isLoad}
                per={per}
            />
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
                <Video source={{ uri: this.state.url}}
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
        exercise_number_visualization: state.metaData.metaData.exercise_number_visualization || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
        isConnected: state.user.isConnected,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(VisulizationActivity1);