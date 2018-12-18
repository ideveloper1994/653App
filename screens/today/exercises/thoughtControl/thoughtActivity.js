import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    Animated,
    Easing,
    BackHandler
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import ThoughtActivityInit from './thoughtActivityInit';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import KeepAwake from 'react-native-keep-awake';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';

// import axios from 'axios';
// var Buffer = require('buffer/').Buffer;

let isCompleted = false;

class ThoughtActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isTimerStart: false,
            disVal: "Get ready",
            intervalId: null,
            counter: 61,
            imageHeight: Constant.screenHeight/3,
            isInstruction: true,
            isLoaded: false,
            exercise_number_thought_control: props.exercise_number_thought_control,
            params: props.navigation.state.params,
            base64Icon: null
        };
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        callTodayScreenEcentListner(false);
        isCompleted = false;
        let exeNo = this.props.exercise_number_thought_control;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 50){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_thought_control: exeNo
        });
        Image.prefetch("https://s3.amazonaws.com/brainbuddyhostingapp/Thought-Control/image-" + exeNo + ".png")
            .then(res => {
                setTimeout(()=>{
                    this.setState({isLoaded: true});
                },2000);
            }).catch(err => {
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        KeepAwake.deactivate();
        this.clearAllInterval();
        callTodayScreenEcentListner();
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    startTimer = () => {
        let timer2 = setTimeout(() => { this.setState({isTimerStart: true});}, 4000);
        let timer3 = setTimeout(() => {this.setState({ isTimerStart: true, disVal: "Go" });
            let intervalId =  setInterval(() => {
                if(this.state.counter == 0) {
                    clearInterval(this.state.intervalId);
                    this.clearAllInterval();
                    if(!isCompleted){
                        this.onBtnDonePress();
                    }
                    isCompleted = true;
                }else{
                    this.setState({
                        disVal: (--this.state.counter).toString()
                    })
                }
            }, 1000);
            this.setState({intervalId: intervalId});
        },5000);
        this.setState({ timerId2: timer2, timerId3: timer3});
    };

    onBtnDonePress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.clearAllInterval();
        KeepAwake.deactivate();
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            let activityNo = this.props.exercise_number_thought_control;
            // activityNo = (activityNo >= 50) ? 1 : ++activityNo;
            if(activityNo >= 50){
                if(activityNo > 50){
                    activityNo = 1;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_thought_control: activityNo }, this.state.params.improve || []);
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            if(this.state.params.isLast){
                // this.props.navigation.navigate("completeMorningRoutine"));
                this.props.navigation.navigate("howDidUDo", {nextPage: 'completeMorningRoutine', isPassObj: false});
            }else{
                //this.props.navigation.goBack();
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
                    scrollToTopToday: this.state.params.scrollToTopToday}
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
        this.clearAllInterval();
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack();
    };

    clearAllInterval = () => {
        if(this.state.intervalId != null) {
            clearInterval(this.state.intervalId);
        }
        if(this.state.timerId2){
            clearTimeout(this.state.timerId2);
        }
        if(this.state.timerId3){
            clearTimeout(this.state.timerId3);
        }
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        KeepAwake.activate();
        this.setState({ isInstruction: false });
        this.startTimer();

    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Hypofrontality"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <ThoughtActivityInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = { this.state.exercise_number_thought_control }
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={this.state.isLoaded}
                per={per}
            />
        )
    };

    // onCompleteImgLoad = () =>{
    //     setTimeout(()=>{
    //         this.setState({isLoaded: true});
    //     },2000);
    // };

    // getBase64 = (url) => {
    //     return axios
    //         .get(url, {
    //             responseType: 'arraybuffer'
    //         })
    //         .then(response => {
    //             let tmp = new Buffer(response.data, 'binary').toString('base64');
    //             let base64Icon = 'data:image/png;base64,'+tmp;
    //             this.setState({
    //                 base64Icon: base64Icon,
    //             },()=>{
    //                 this.setState({
    //                     isLoaded:true
    //                 });
    //             });
    //         }).catch(err=> {
    //
    //         })
    // };

    render(){
        const {container, backView, titleText, textDetail, outerView, absoluteView, txtBottom} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor="#f0b45a"/>
                <View style={container}>
                    {
                        (this.state.isTimerStart) ?
                            <View style={outerView}>
                                <Text style={[titleText, {fontSize: 30, fontFamily: Constant.font500}]}>
                                    {this.state.disVal}
                                </Text>
                            </View>
                            :
                            <View style={{flex:1}}>
                                <View style={[absoluteView,{top:Constant.screenHeight*0.156, alignItems:'center'}]}>
                                    <Text style={textDetail}>{"Don't think about"}</Text>
                                    <Text style={[titleText,{ marginTop: 15 }]}>
                                        {this.getTitleText(this.state.exercise_number_thought_control)}</Text>
                                </View>
                                <View style={[absoluteView,{top:Constant.screenHeight*0.365, alignItems:'center',
                                    backgroundColor:'transparent'}]} ref="imgView">
                                    <Image source={{ uri: "https://s3.amazonaws.com/brainbuddyhostingapp/Thought-Control/image-" +
                                        this.state.exercise_number_thought_control + ".png"}}
                                           style={{height: Constant.screenHeight/2.8, width: Constant.screenHeight/2.8}}
                                           resizeMode="contain"/>
                                </View>
                                <View style={[absoluteView,{top:Constant.screenHeight*0.83, alignItems:'center'}]}>
                                    <Text style={textDetail}>{"For 60 seconds"}</Text>
                                </View>
                            </View>
                    }

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
                        this.renderInitComponent()
                        : null }
                </View>
            </View>
        );
    }
    getTitleText = (number) => {
        switch (number){
            case 1:
                return "The elephant";

            case 2:
                return "The tree";

            case 3:
                return "The lion";

            case 4:
                return "The bacon";

            case 5:
                return "The orange";

            case 6:
                return "The house";

            case 7:
                return "The clock";

            case 8:
                return "The flower";

            case 9:
                return "The turtle";

            case 10:
                return "The boat";

            case 11:
                return "The book";

            case 12:
                return "The plant";

            case 13:
                return "The table";

            case 14:
                return "The car";

            case 15:
                return "The zebra";

            case 16:
                return "The sword";

            case 17:
                return "The fish";

            case 18:
                return "The motorbike";

            case 19:
                return "The broccoli";

            case 20:
                return "The bird";

            case 21:
                return "The dolphin";

            case 22:
                return "The bicycle";

            case 23:
                return "The pen";

            case 24:
                return "The phone";

            case 25:
                return "The glass";

            case 26:
                return "The spoon";

            case 27:
                return "The banana";

            case 28:
                return "The couch";

            case 29:
                return "The bottle";

            case 30:
                return "The lamp";

            case 31:
                return "The paintbrush";

            case 32:
                return "The money";

            case 33:
                return "The sharpener";

            case 34:
                return "The television";

            case 35:
                return "The chocolate";

            case 36:
                return "The crate";

            case 37:
                return "The cat";

            case 38:
                return "The piano";

            case 39:
                return "The dog";

            case 40:
                return "The chair";

            case 41:
                return "The calculator";

            case 42:
                return "The screw";

            case 43:
                return "The watch";

            case 44:
                return "The toothbrush";

            case 45:
                return "The bread";

            case 46:
                return "The pencil";

            case 47:
                return "The bed";

            case 48:
                return "The carrot";

            case 49:
                return "The tomato";

            case 50:
                return "The apple";

            default:
                return "Null";
        }
    }
}

const styles = StyleSheet.create({
    container: Constant.getContainer("#f0b45a"),
    textDetail: {
        fontSize:15,
        color:'#ebeafd',
        textAlign: 'center',
        fontFamily: Constant.font500,
    },
    titleText:{
        color: '#FFF',
        textAlign: 'center',
        fontSize: 24,
        fontFamily: Constant.font300,
    },
    backView:{
        height:60,
        width:60,
        position:'absolute',
        top:10,
        left:10,
        paddingLeft:5,
        paddingTop:10,
        backgroundColor: Constant.transparent
    },
    outerView:{
        flex:1,
        alignItems:'center',
        justifyContent: 'center'
    },
    absoluteView:{
        bottom:0,
        left:0,
        right:0,
        position: 'absolute'
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
        exercise_number_thought_control: state.metaData.metaData.exercise_number_thought_control || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(ThoughtActivity);