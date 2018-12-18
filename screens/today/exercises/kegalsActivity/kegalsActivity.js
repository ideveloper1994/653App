import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import * as Animatable from 'react-native-animatable';
let Sound = require('react-native-sound');
import KegalsActivityInit from './kegalsActivityInit';
import KegalInstruction from './kegalsInstruction';
import KeepAwake from 'react-native-keep-awake';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';

let counter = 1;
let totalTimeOut = 0;
let intervalId1 = null;
let intervalId2 = null;

class KegalsActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isMute: false,
            intervalId: null,
            roundText: 'Get ready',
            activityTimeOut: null,
            labelInterval: null,
            labelText: "",
            step: 1,
            counter: 0,
            isBreak: false,
            isInstruction: true,
            modalVisible: false,
            params: props.navigation.state.params,
            exercise_number_kegals: props.exercise_number_kegals,
        };
        this.playbackInstance = null;
        this.position = new Animated.Value(300);
    }

    componentWillMount(){
        callTodayScreenEcentListner(false);
        let exeNo = this.props.exercise_number_kegals;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo -= 1;
            }
            this.setState({
                exercise_number_kegals: exeNo
            });
        }
    }

    componentWillUnmount() {
        KeepAwake.deactivate();
        callTodayScreenEcentListner();
        this.clearAllInterval();
    }

    //api call and update state when complete activity
    onCompleteActivity = () => {
        this.clearAllInterval();
        KeepAwake.deactivate();
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            let activityNo = this.props.exercise_number_kegals;
            activityNo = (activityNo >= 50) ? 1 : ++activityNo;
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_kegals: activityNo }, this.state.params.improve || []);
            if(this.state.params.isOptional){
                this.props.navigation.navigate("completeOptionalActivity",
                    {title: "Kegals exercise complete", data: ["Kegal"]});
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

    setAnimation = () => {
        this.clearAllInterval();
        counter = 1;
        this.setState({ counter: 1 });
        let intervalId = setInterval(() => {
            let lblCounter = this.state.counter;
            if(lblCounter == 10) {
                if(this.state.step != 3) {
                    this.clearAllInterval();
                    this.setState({ isBreak: true});
                    Animated.timing(this.position, {
                        toValue: 300,
                        duration: 0
                    }).start();
                    setTimeout(() => {
                        //this.setState({isBreak: false, step: ++this.state.step});
                        this.setAnimation();
                    }, 6500);
                    setTimeout(() => {
                        this.setState({isBreak: false, step: ++this.state.step});
                        //this.setAnimation();
                    }, 10000);
                }else {
                    this.onCompleteActivity();
                }
            }else {
                if(counter % 2 == 0) {
                    this.setSound("kegals_release.mp3");
                    this.setState({ roundText: "Release", counter: lblCounter });
                    //this.refs.roundView.zoomIn(7000);
                    Animated.timing(this.position, {
                        toValue: 300,
                        duration: 5000
                    }).start();
                }else {
                    if (lblCounter == 1 && counter == 1) {
                    } else {
                        ++lblCounter;
                    }
                    //this.refs.roundView.zoomOut(7000);
                    Animated.timing(this.position, {
                        toValue: 150,
                        duration: 5000
                    }).start();
                    this.setSound("kegals_contract.mp3");
                    this.setState({roundText: "Contract", counter: lblCounter});
                }
                ++counter
            }
        }, 7000);
        this.setState({
            intervalId: intervalId,
        });
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
                    this.playbackInstance = whoosh;
                }
            });
    };

    //Clear Interval
    clearAllInterval = () => {
        if(this.state.intervalId != null){
            clearInterval(this.state.intervalId);
        }
    };

    showModal = () =>{
//        this.props.navigation.navigate("kegalsInstruction");
    };

    onShowModal = (flag) => {
        this.setState({modalVisible: flag});
    };

    //Instruction Page
    onCloseButtonPress = () => {
        KeepAwake.deactivate();
        this.clearAllInterval();
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack();
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setAnimation();
        KeepAwake.activate();
        this.setState({ isInstruction: false });
    };

    renderInitComponent = () => {
        return(
            <KegalsActivityInit
                excerciseNumber = {this.state.exercise_number_kegals}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {true}
            />)
    };

    render() {
        const {container, bottomView, topView, textCount, animatedView, vwRound,
            middleView, middleText, bottomText, txtBottom} = styles;
        const circleStyle = {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#80cbe7',
            height: this.position,
            width: this.position,
            borderRadius:  150
        };
        return (
            <View style={container}>
                <AppStatusBar backColor="#5bb6de"/>
                <View style={container}>
                    <View style={{left:0, bottom:0, top:0, right:0, position: 'absolute',
                        alignItems: 'center', justifyContent: 'center'}}>
                        {
                            (this.state.isBreak) ?
                                <View style={middleView}>
                                    <Text style={middleText}>
                                        {"Take a 10 second break"}</Text>
                                </View>
                                :
                                <View style={{left:0, bottom:0, top:0, right:0, position: 'absolute', alignItems: 'center',
                                    justifyContent: 'center'}}>
                                    <Animated.View style={circleStyle}/>
                                    <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#a4daee',
                                        height: 160,width: 160,borderRadius:  80, position: 'absolute' }}>
                                        <Text style={{color: '#fff', fontSize: 17, fontFamily: Constant.font500,}}>
                                            {this.state.roundText}</Text>
                                    </View>
                                </View>
                        }
                    </View>
                    <View style={{marginTop: Constant.screenHeight*0.05 + this.props.safeAreaInsetsDefault.top,
                        alignItems: 'center',justifyContent: 'center'}}>
                        <Text style={{color: '#fff', fontSize: 16,fontFamily: Constant.font500,}}>
                            { "Set " + this.state.step }</Text>
                    </View>

                    <View style={{top: Constant.screenHeight*0.05-8 + this.props.safeAreaInsetsDefault.top, right: 10, position: 'absolute'}}>
                        <TouchableHighlight onPress={() => this.onVolumeBtnPress()}
                                            underlayColor={Constant.transparent}>
                            <Image source={(this.state.isMute) && {uri:'icon_sound_mute'} || {uri:'icon_sound'}}
                                   style={{ height:35, width:35}}/>
                        </TouchableHighlight>
                    </View>

                    <Text style={textCount}>
                        { this.state.counter + " of 10" }
                    </Text>
                    <TouchableOpacity onPress={() => this.onShowModal(true)}  style={bottomView}>
                        <Text style={bottomText}>Instructions</Text>
                    </TouchableOpacity>
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
                    <Modal animationType="slide"
                           transparent={false}
                           visible={this.state.modalVisible}>
                        <KegalInstruction onClosePress={this.onShowModal}/>
                    </Modal>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#5bb6de',
    },
    animatedView: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#80cbe7',//'rgba(255,255,255,0.3)',
        height: 300,
        width: 300,
        borderRadius: 150
    },
    vwRound: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a4daee',//'rgb(156,214,233)',
        height: 160,
        width: 160,
        borderRadius: 80,
        position: 'absolute'
    },
    middleView: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    middleText:{
        color: '#fff',
        fontSize: 15,
        fontFamily: Constant.font500,
        textAlign:'center',
    },
    textCount:{
        position:'absolute',
        top: Constant.screenHeight*0.12,
        color: '#b3e0f0',
        fontSize: 15,
        fontFamily: Constant.font500,
        alignSelf:'center',
        textAlign:'center'
    },
    bottomView:{
        top:Constant.screenHeight*0.85-20,
        left:0,
        padding:20,
        right:0, position: 'absolute',
    },
    bottomText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: Constant.font500,
        alignSelf:'center',
        textAlign:'center',
    },
    txtBottom:{
        fontSize: 15,
        color: '#bddfee',
        textAlign: 'center',
        fontFamily: Constant.font500,
        padding: 10
    },
});

const mapStateToProps = state => {
    return {
        exercise_number_kegals: state.metaData.metaData.exercise_number_kegals || 1,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(KegalsActivity);

/*
 <View style={middleView}>
 <Animatable.View ref="roundView" >
 <View style={animatedView}/>
 </Animatable.View>

 <View style={vwRound}>
 <Text style={{color: '#fff', fontSize: 17,fontFamily: Constant.font500}}>
 {this.state.roundText}</Text>
 </View>
 </View>
 * */