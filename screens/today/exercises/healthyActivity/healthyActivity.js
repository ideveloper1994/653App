import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
    BackHandler,
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import HealthyActivityInit from './healthyActivityInit';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import Button from './../../../commonComponent/button';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';

let activityImage=[
    'healthy_activity_1',
    'healthy_activity_1',
    'healthy_activity_2',
    'healthy_activity_3',
    'healthy_activity_4',
    'healthy_activity_5',
    'healthy_activity_6',
    'healthy_activity_7',
    'healthy_activity_8',
    'healthy_activity_9',
    'healthy_activity_10',
    'healthy_activity_11',
    'healthy_activity_12',
    'healthy_activity_13',
    'healthy_activity_14',
    'healthy_activity_15',
    'healthy_activity_16',
    'healthy_activity_17',
    'healthy_activity_18',
    'healthy_activity_19',
    'healthy_activity_20',
    'healthy_activity_21',
    'healthy_activity_22',
    'healthy_activity_23',
    'healthy_activity_24',
    'healthy_activity_25',
    'healthy_activity_26',
    'healthy_activity_27',
    'healthy_activity_28',
    'healthy_activity_29',
    'healthy_activity_30',
    'healthy_activity_31',
    'healthy_activity_32',
    'healthy_activity_33',
    'healthy_activity_34',
    'healthy_activity_35',
    'healthy_activity_36',
    'healthy_activity_37',
    'healthy_activity_38',
    'healthy_activity_39',
    'healthy_activity_40',
    'healthy_activity_41',
    'healthy_activity_42',
    'healthy_activity_43',
    'healthy_activity_44'
];

class HealthyActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isInstruction: true,
            params: props.navigation.state.params,
            exercise_number_activity: props.exercise_number_activity,
        };
        this.offset = new Animated.Value(Constant.screenHeight);
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        callTodayScreenEcentListner(false);
        let exeNo = this.props.exercise_number_activity;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 44){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_activity: exeNo
        });
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    onBtnActivityPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            this.state.params.onCompleteExercises(this.state.params.pageName);
            let activityNo = this.props.exercise_number_activity;
            // activityNo = (activityNo >= 44) ? 2 : ++activityNo;
            if(activityNo >= 44){
                if(activityNo > 44){
                    activityNo = 2;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.props.updateMetaData({ exercise_number_activity: activityNo }, this.state.params.improve || []);
            if(this.state.params.isOptional){
                this.props.navigation.navigate("completeOptionalActivity",
                    {title: "Healthy activity complete", data: ["Dopamine"]});
            }else{
                if(this.state.params.isLast) {
                    this.props.navigation.navigate("completeMorningRoutine");
                }else{
                    this.state.params.makeFadeInAnimation();
                    this.props.navigation.goBack();
                }
            }
        }
    };

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }

    //Instruction Page
    onCloseButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack();
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setState({ isInstruction: false },()=>{
            Animated.timing(this.offset, {
                duration: 400,
                easing: Easing.out(Easing.quad),
                toValue: 0,
                delay: 100,
                useNativeDriver: true
            }).start();
        });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Dopamine"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <HealthyActivityInit
                excerciseNumber = {this.state.exercise_number_activity}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={true}
                per={per}
            />
        )
    };

    onCompleteAnimation = () => {
        this.refs.mainOuter.fadeOut(500);
    };

    render() {
        const {container,textSubTitle,absoluteView,animatedView,containerView,imgStyle,txtActivity,txtStyle,btnStyle, outerPopUp} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(239,76,129)'/>
                <Animatable.View style={animatedView} animation="fadeIn" duration={500} ref="mainOuter">
                    <Animated.View style={[outerPopUp,{transform: [{translateY: this.offset}]}]}>
                        <TouchableOpacity style={absoluteView}
                                          onPress={()=>this.onCloseButtonPress()}>
                            <Text style={textSubTitle}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={containerView}>
                            <Image resizeMode={'contain'}
                                   source={{uri:activityImage[this.state.exercise_number_activity]}}
                                   style={imgStyle}/>
                            <Text style={txtActivity}>
                                TODAYS ACTIVITY
                            </Text>
                            <Text style={txtStyle}>
                                { this.getDescriptionText(this.state.exercise_number_activity) }
                            </Text>
                            <Button title="Activity complete"
                                    backColor="rgb(239,76,129)"
                                    color="#FFF"
                                    otherStyle={btnStyle}
                                    otherTextStyle={{fontFamily: Constant.font700,fontSize:15}}
                                    onPress={this.onBtnActivityPress}/>
                        </View>
                    </Animated.View>

                    { (this.state.isInstruction) ?
                        this.renderInitComponent()
                        : null}
                </Animatable.View>
            </View>
        );
    }

    getDescriptionText = (number) => {
        switch (number){
            case 1:
                return "Remove all traces of porn from your computer and devices";

            case 2:
                return "Go for a walk";

            case 3:
                return "Wear a rubber band on your wrist and snap it when you think of porn";

            case 4:
                return "Watch a good movie";

            case 5:
                return "Make a list of five role models that you admire";

            case 6:
                return "Read a good book";

            case 7:
                return "Clean your room or house";

            case 8:
                return "Call a friend for a chat";

            case 9:
                return "Visit a place you've never been before";

            case 10:
                return "Do as many pushups as you can";

            case 11:
                return "Listen to some good music, especially childhood favorites";

            case 12:
                return "Learn something new. Try the random article button on Wikipedia.";

            case 13:
                return "Watch something funny";

            case 14:
                return "Go for a run";

            case 15:
                return "Have a bubble bath";

            case 16:
                return "Write a short story";

            case 17:
                return "Play a board game";

            case 18:
                return "Make a feel good playlist";

            case 19:
                return "Try yoga";

            case 20:
                return "Play a sport";

            case 21:
                return "Learn a magic trick";

            case 22:
                return "Make a list of ten things you like about yourself";

            case 23:
                return "Watch a new TV show";

            case 24:
                return "Do situps";

            case 25:
                return "Have a nap";

            case 26:
                return "Draw something";

            case 27:
                return "Find some new music";

            case 28:
                return "Design your dream home";

            case 29:
                return "Do jumping jacks";

            case 30:
                return "Make a list of things in life you're grateful for";

            case 31:
                return "Take a great photo and make it your wallpaper for a week";

            case 32:
                return "Learn to juggle";

            case 33:
                return "Have a go at cooking something new";

            case 34:
                return "Learn how to say hello in ten different languages";

            case 35:
                return "Spend some time in nature";

            case 36:
                return "Learn origami";

            case 37:
                return "Play a video game";

            case 38:
                return "Listen to a good podcast";

            case 39:
                return "Buy a $5 stock. Do some research first and see how it goes over a month";

            case 40:
                return "Organize your music library";

            case 41:
                return "Solve a puzzle";

            case 42:
                return "Do some shopping";

            case 43:
                return "Play some sedoku";

            case 44:
                return "Find a new tv show";
            default:
                return "Null";
        }
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(241,86,129)',
    },
    animatedView:{
        flex:1,
        backgroundColor: 'rgb(239,76,129)',
        justifyContent:'center',
        alignItems:'center'
    },
    containerView:{
        backgroundColor: '#FFF',
        width:'90%',
        maxWidth:340,
        borderRadius:10,
        alignItems:'center'
    },
    txtActivity:{
        fontSize:12,
        color:'#aaa',
        marginBottom:16,
        fontFamily: Constant.font700,
    },
    txtStyle:{
        fontFamily: Constant.font700,
        fontSize:15,
        marginBottom:28,
        textAlign: 'center',
        width: "90%",
        color:'#3b3b3b',
        lineHeight: 21
    },
    btnStyle:{
        marginBottom:28,
        height:60,
        width:250,
        marginTop:0,
        marginLeft: 0,
        marginRight: 0
    },
    imgStyle:{
        height:112,
        width:112,
        marginTop:28,
        marginBottom:25
    },
    absoluteView:{
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        top: Constant.screenHeight*0.93
    },
    textSubTitle: {
        fontSize:13,
        color:'#eeb8c7',
        fontFamily: Constant.font500,
    },
    outerPopUp:{
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'transparent', alignItems:'center', justifyContent:'center'
    },
});


const mapStateToProps = state => {
    return {
        exercise_number_activity: state.metaData.metaData.exercise_number_activity || 1,
        rewiringProgress: state.metaData.rewiringProgress,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(HealthyActivity);