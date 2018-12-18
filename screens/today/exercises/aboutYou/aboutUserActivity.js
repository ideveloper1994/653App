import React,{Component} from 'react';
import {View, Text, ScrollView, Image, Alert, StyleSheet, TouchableOpacity, Animated, Easing} from 'react-native';
import Constant from './../../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import UpdateProfileComponent from './subComponent/profileQuestionComponent';
import ProgressBar from './subComponent/profileProgress';
import {connect} from "react-redux";
import Button from '../../../commonComponent/button';
import { updateMetaData } from '../../../../actions/metadataActions';
import AppStatusBar from './../../../commonComponent/statusBar';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";

let allQuestions=[{},{
    "profile_psychology": [

        { questions: "Would you describe yourself as creative or analytical?",
            answer: [
                {answerStr: "Creative", val: 1},
                {answerStr: "Analytical", val: 2},
                {answerStr: "Unsure", val:3},
            ]
        },
        { questions: "Do you consider yourself to have a ‘big ego’?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        { questions: "Do you consider yourself to be highly emotional or ‘overly sensitive’?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        { questions: "Do you consider yourself to be religious or spiritual?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        { questions: "Do you fear failure or rejection?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        { questions: "When you make a promise…",
            answer: [
                {answerStr: "I always keep it", val: 1},
                {answerStr: "I try to keep it", val: 2},
                {answerStr: "I rarely keep it", val: 3},
            ]
        },
        { questions: "Do you prefer a good book or a good film?",
            answer: [
                {answerStr: "A good book", val: 1},
                {answerStr: "A good film", val: 2},
                {answerStr: "Both equally", val: 3},
            ]
        },
        { questions: "How would your describe your knowledge about technology?",
            answer: [
                {answerStr: "Above average", val: 1},
                {answerStr: "Average", val: 2},
                {answerStr: " Below average", val: 3},
            ]
        }
    ]},
    {"profile_anxiety":[
        {
            questions: "Do you have trouble sleeping?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        {
            questions:"Do you have trouble relaxing?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        {
            questions:"How often do you feel restless? Like you can’t sit still?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        {
            questions:"Do you consider yourself easily annoyed or irritable?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ],
        },
        {
            questions:"How often do you feel afraid, as if something awful may happen at any moment?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        {
            questions:"Do you worry about things that are outside your control?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        }
    ]},
    {"profile_selfesteem":[
        {
            questions:"Do you compare yourself to others?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3}
            ]
        },
        {
            questions:"Do you feel that you are inferior to others?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: "2"},
                {answerStr: "Rarely", val: 3}
            ]
        },
        {
            questions:"Do you worry what other people think of you?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3}
            ]
        },
        {
            questions:"Are you sensitive to criticism?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        {
            questions:"How often do you think positively about yourself?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3}
            ]
        },
        {
            questions:"Is it important that the people you meet like you?",
            answer: [
                {answerStr: "Very", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "Not really", val: 3},
            ]
        }
    ]},
    {"profile_stress":[
        {
            questions:"Do you feel like you have enough time to relax?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        {
            questions:"How often do you feel ‘burnt out’?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        {
            questions:"Do you ever smoke or drink to excess as a way of dealing with stress?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        {
            questions:"How do you feel about the future?",
            answer: [
                {answerStr: "Optimistic", val: 1},
                {answerStr: "Indifferent", val: 2},
                {answerStr: "Pessimistic", val: 3},
            ]
        },
        {
            questions:"How do you feel when you wake up in the morning?",
            answer: [
                {answerStr: "Enthusiastic", val: 1},
                {answerStr: "Indifferent", val: 2},
                {answerStr: "Unhappy", val: 3},
            ]
        },
        {
            questions:"How often do you feel fatigued or tired?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        }
    ]},
    {"profile_relationship":[
        {
            questions:"Do you have a supportive family?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        {
            questions:"Do you have a strong support network of good friends?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        {
            questions:"At what age did you have your first serious relationship?",
            answer: [
                {answerStr: "Younger than 18", val: 1},
                {answerStr: "Older than 18", val: 2},
                {answerStr: "Not applicable", val: 3},
            ]
        },
        {
            questions:"Have you ever suffered a traumatic breakup?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        {
            questions:"Have you shared your issue with porn with anyone close to you?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "No", val: 2},
            ]
        },
        {
            questions:"When it comes to helping and supporting others...",
            answer: [
                {answerStr: "I am generous", val: 1},
                {answerStr: "I can be selfish", val: 2},
                {answerStr: "I can be both", val: 3},
            ]
        },
        {
            questions:"Have you even chosen to use porn instead of socialising with others?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Never", val: 3},
            ]
        },
        {
            questions:"How would you describe your personal relationships without porn use?",
            answer: [
                {answerStr: "Improved", val: 1},
                {answerStr: "The same", val: 2},
                {answerStr: "Worse", val: 3},
            ]
        },

    ]},
    {"profile_behaviour":[
        {
            questions:"How much time do you spend viewing screens? Your TV, computer, phone, etc?",
            answer: [
                {answerStr: "Above average", val: 1},
                {answerStr: "Average", val: 2},
                {answerStr: "Below average", val: 3},
            ]
        },
        {
            questions:"How often do you check your phone each day?",
            answer: [
                {answerStr: "Above average", val: 1},
                {answerStr: "Average", val: 2},
                {answerStr: "Below average", val: 3},
            ]
        },
        {
            questions:"Do you feel bored when you’re not using technology?",
            answer: [
                {answerStr: "Extremely", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "Not really", val: 3}
            ]
        },
        {
            questions:"Do you feel anxious when you’re not using technology?",
            answer: [
                {answerStr: "Extremely", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "Not really", val: 3}
            ]
        },
        {
            questions:"From your perspective, how often do you use social media?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Never", val: 3}
            ]
        },
        {
            questions:"When did you get your first computer, tablet or phone?",
            answer: [
                {answerStr: "12 or younger", val: 1},
                {answerStr: "13 to 16", val: 2},
                {answerStr: "17 or older", val: 3}
            ]
        },

    ]},
    {"profile_activity":[
        {
            questions:"Do you lead an active lifestyle?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3},
            ]
        },
        {
            questions:"Do you exercise?",
            answer: [
                {answerStr: "Frequently", val: 1},
                {answerStr: "Occasionally", val: 2},
                {answerStr: "Rarely", val: 3},
            ]
        },
        {
            questions:"Do you enjoy exercising?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3}
            ]
        },
        {
            questions:"What appeals more - solo exercise or team sport?",
            answer: [
                {answerStr: "Solo sport", val: 1},
                {answerStr: "Team sport", val: 2},
                {answerStr: "Unsure", val: 3}
            ]
        },
        {
            questions:"Do you enjoy being outdoors?",
            answer: [
                {answerStr: "Yes", val: 1},
                {answerStr: "Somewhat", val: 2},
                {answerStr: "No", val: 3}
            ]
        }
    ]},
    {"profile_dietary":[
            {
                questions:"How would you describe your diet?",
                answer: [
                    {answerStr: "Good", val: 1},
                    {answerStr: "Average", val: 2},
                    {answerStr: "Poor", val: 3},
                ]
            },
            {
                questions:"Do you have trouble saying no to unhealthy foods? Such as chocolate, ice cream etc?",
                answer: [
                    {answerStr: "Frequently", val: 1},
                    {answerStr: "Occasionally", val: 2},
                    {answerStr: "Rarely", val: 3},
                ]
            },{
                questions:"Do you ‘eat emotionally’? In response to stress or difficult feelings?",
                answer: [
                    {answerStr: "Frequently", val: 1},
                    {answerStr: "Occasionally", val: 2},
                    {answerStr: "Rarely", val: 3},
                ]
            },
        ]},
];

const profileTitle = [
    "Psychology Profile",
    "Psychology Profile",
    "Anxiety Profile",
    "Self-esteem Profile",
    "Stress Profile",
    "Relationship Profile",
    "Behaviour Profile",
    "Activity Profile",
    "Dietary Profile",
    "Dietary Profile",
];

//avatar_id:state.user.userDetails.avatar_id,
class UpdateProfile extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state={
            progressValue:'1.54%',
            questions : [],//allQuestions[props.exercise_number_profile]["Psychology"],
            questionNo: 0,
            selectedAnswers: {},
            isShowFirst: props.exercise_number_profile === 1,
            params: props.navigation.state.params,
            profileKey: "",
            profileType: ""
        }
        this.currentVisiblePageNo = 0;
        let val = (props.exercise_number_profile === 1) && Constant.screenHeight || 0;
        this.offset = new Animated.Value(val);
    }

    componentWillMount = () => {
        try{
            callTodayScreenEcentListner(false);
            let exeNo = this.props.exercise_number_profile;
            if(this.props.exercise_number_profile > 8){
                exeNo = 8;
            }
            if(this.props.navigation.state.params.isReplay){
                if(exeNo > 1){
                    exeNo -= 1;
                }
            }
            let questions = allQuestions[exeNo+""];
            let mainKey = Object.keys(questions)[0];
            this.setState({
                questions: allQuestions[exeNo][mainKey],
                profileKey: mainKey,
                profileType: profileTitle[exeNo]
            });
        }catch (e){
        }
    };

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }

    onSelectAnswer = (questionNo, question, answer) => {
        let anserKey = this.state.profileKey + "_" + questionNo;
        this.state.selectedAnswers[anserKey] = answer.val;

        if(questionNo != this.state.questions.length) {
            this.setState({
                questionNo: questionNo,
            },()=>{
                // this.refs.popup.fadeIn(400)
            });
            if(this.refs.mainScroll) {
                this.refs.mainScroll.scrollTo({x: (Constant.screenWidth) * questionNo, y: 0, animated: true});
            }
        }else{
            this.setState({
                questionNo: questionNo,
            });
            this.onCompleteActivity();
            this.refs.mainView.fadeOut(600);
        }
    }

    onCompleteActivity = () => {
        this.state.params.scrollToTopToday();
        let metaData = this.state.selectedAnswers;
        let activityNo = this.props.exercise_number_profile;
        if(!this.state.params.isReplay) {
            activityNo = ++activityNo;
            this.state.params.onCompleteExercises(this.state.params.pageName);
            metaData.exercise_number_profile = activityNo
            }
        setTimeout(()=>{
            this.props.navigation.navigate("aboutYouComplete",{ activityNo: activityNo });
        },900);
        this.props.updateMetaData(metaData);
    };

    onCloseButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.props.navigation.goBack();
    }

    onContinueBtnPress = () => {
        if(this.refs.firstView){
            this.refs.firstView.fadeOut(300).then(()=>{
                this.setState({
                    isShowFirst: false
                },()=>{
                    Animated.timing(this.offset,    {
                        // duration: 250,
                        // easing: Easing.bezier(0.39, 0.575, 0.565, 1.2),
                        duration: 400,
                        easing: Easing.out(Easing.quad),
                        toValue: 0,
                        useNativeDriver: true
                    }).start();
                });
            });
        }
    };

    render(){

        const {mainContainer,linkStyle,cancelStyle,profileTextStyle, firstView, titleText, descriptionText} = styles;
        return(
            <View style={[mainContainer]}>
                <AppStatusBar backColor='rgb(79,167,224)'/>

                <Animatable.View style={[mainContainer, {paddingTop: this.props.safeAreaInsetsData.top}]} ref="mainView">
                <Animatable.Text style={profileTextStyle} animation="fadeIn" duration={300} delay={200}>
                    {this.state.profileType}
                </Animatable.Text>
                <ProgressBar otherColor={'rgb(62,156,217)'}
                             totalQuestion={this.state.questions.length}
                             questionNo={this.state.questionNo}
                             fillBarColor={'#FFF'}/>

                <Animated.View ref="outerView" style={{transform: [{translateY: this.offset}]}}>

                <Animatable.View style={(Constant.isIOS) && {width: Constant.screenWidth,
                    height: Constant.screenHeight - (75 + this.props.safeAreaInsetsData.top)*2,
                    backgroundColor: 'transparent', top:-12, left:0, position:'absolute', bottom: (75 + this.props.safeAreaInsetsData.top)*2} || {width: Constant.screenWidth}}
                                 ref="popup" animation="fadeIn" duration={300} delay={200}>

                <ScrollView bounces={false}
                                pagingEnabled={true}
                                scrollEventThrottle={9}
                                horizontal={true}
                                scrollEnabled={false}
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={this.onScrollEnd}
                                ref="mainScroll">
                                {
                                    this.state.questions.map((data,key)=>{
                                        return(
                                            <View style={(Constant.isIOS) && {alignItems:'center', width: Constant.screenWidth, flex:1,
                                                justifyContent:'center',backgroundColor: 'transparent'} || {alignItems:'center', width: Constant.screenWidth}} key={key}>
                                                <UpdateProfileComponent
                                                    avtarId={this.props.userDetail.avatar_id || 0}
                                                    gender={this.props.userDetail.gender || ""}
                                                    mainQuestionNo={this.state.questionNo}
                                                    onSelectAnswer={this.onSelectAnswer}
                                                    questionNo={key+1}
                                                    key={key}
                                                    rowData={data}/>
                                            </View>
                                        )
                                    })
                                }

                            </ScrollView>
                        </Animatable.View>
                    </Animated.View>

                    {
                        (this.props.exercise_number_profile === 1 && this.state.isShowFirst) &&
                        <View style={firstView}>
                            <Animatable.View animation="fadeIn" duration={300} delay={200}
                                             style={{alignItems:'center'}} ref="firstView">
                                <Text style={titleText}>
                                    YOUR PRIVACY MATTERS
                                </Text>
                                <Text style={descriptionText}>
                                    {
                                        "The information gathered from these questions is used to look for patterns in our community and " +
                                        "to improve the effectiveness of your recovery program.\n\n" +
                                        "All data collected is anonymous."
                                    }
                                </Text>
                                <Button title={"Continue"}
                                        backColor="#FFF"
                                        color="rgb(79,167,224)"
                                        otherStyle={{height: 50,width: '86%',marginTop: 33, width: 190}}
                                        otherTextStyle={{fontSize:15, fontFamily: Constant.font700}}
                                        onPress={this.onContinueBtnPress}/>
                            </Animatable.View>
                        </View>
                        || null
                    }

                    <TouchableOpacity style={linkStyle}
                                      onPress={()=>  this.onCloseButtonPress()}>
                        <Animatable.Text style={cancelStyle} animation="fadeIn" duration={300} delay={200}>Cancel</Animatable.Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: (Constant.isIOS) && {
        backgroundColor :'rgb(79,167,224)',
        height:Constant.screenHeight,
        width:Constant.screenWidth,
        // alignItems:'center',
        flex:1
    } || {
        backgroundColor :'rgb(79,167,224)',
        height:Constant.screenHeight,
        width:Constant.screenWidth,
        alignItems:'center'
    },
    profileTextStyle: (Constant.isIOS) && {
        marginTop:50,
        marginBottom:10,
        color:'#FFF',
        fontSize:13,
        fontFamily: Constant.font500,
        alignSelf:'center',
        textAlign:'center'
    } || {
        marginTop:50,
        marginBottom:10,
        color:'#FFF',
        fontSize:13,
        fontFamily: Constant.font500
    },
    linkStyle:{
        top: Constant.screenHeight*0.93, bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center'
    },
    cancelStyle:{
        fontFamily:Constant.font500,fontSize:13,color:'#b5d7f1'
    },
    firstView:{
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        backgroundColor :'rgb(79,167,224)',
        justifyContent:"center",
        paddingBottom: 15
    },
    titleText: {
        color:'#b5d7f1',
        fontSize:14,
        fontFamily: Constant.font700
    },
    descriptionText:{
        marginTop: 29,
        color:'#FFF',
        fontSize:15,
        fontFamily: Constant.font700,
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 24,
    }
})

const mapStateToProps = state => {
    return {
        userDetail:state.user.userDetails,
        exercise_number_profile: state.metaData.metaData.exercise_number_profile || 1,
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(UpdateProfile);