import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Text,
    ScrollView,
    Animated,
    BackHandler,
    AsyncStorage
} from 'react-native';
import NavBar from '../components/quiz/titleQuiz';
import QuestionCom from '../components/quiz/questionComponent';
import AnswerCom from '../components/quiz/answerComponent';
import Constant from '../../../../helper/constant';
import UserDetail from '../components/quiz/getUserDetail';
import * as Animatable from 'react-native-animatable';
import AppStatusBar from '../../../commonComponent/statusBar';

export default class Quiz extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            questions: [],
            answers: {},
            questionNo: 0,
            resultNumber: 0,
            selectedAnswer: [],
        };
        this.userDetail = new Animated.ValueXY(0,0);
    }

    componentDidMount(){
        AsyncStorage.setItem('isIntroQuizSkip',"false");
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        this.questionList();
    }

    _handleBackPress = () => {
        return true;
    };

    onSelectAnswer = (questionNo, val, selectedAns) => {
        let allAnswers = this.state.selectedAnswer;
        allAnswers.push(selectedAns);
        let ques = this.state.answers[questionNo.toString()];
        this.setState({
            resultNumber: this.state.resultNumber + val,
            questionNo: questionNo,
            selectedAnswer: allAnswers
        });
        if(questionNo != 18) {
            if(this.refs.mainScroll) {
                this.refs.mainScroll.scrollTo({x: (Constant.screenWidth) * questionNo, y: 0, animated: true});
            }
        }else{
            this.refs.navView.slideOutUp();
            Animated.timing(this.userDetail, {
                toValue: {x:0, y:Constant.screenHeight}, duration:500
            }).start();
            setTimeout(()=>{
                this.props.navigation.navigate('assessmentComplete',{resultNumber: this.state.resultNumber});
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
                }, 800);
        }
    };

    questionList = () => {
        let questions = [
            'At what age did you begin looking at porn?',
            'Has your porn use increased since you first started?',
            'At what age did you first have sex?',
            'On average, how often do you look at porn?',
            'How often do you masturbate?',
            'What best describes your living situation?',
            'What is your current relationship statue?',
            'Have you had successful sex with another person before?',
            'Do you use porn to escape from emotional pain?',
            'Do you use porn to escape from stress?',
            'Have you ever used porn because you were bored?',
            'Do you struggle to gain an erection or become aroused without porn?',
            'Do you find you use more graphic or extreme porn than you used to?',
            'Do you often feel tired, unmotivated or anxious?',
            'What is your sexual orientation?',
            'What motivates you?',
            'What is your gender?',
            'A little more about you'
        ];
        let ans = {
            "1": [
                {ans: "Younger than 12", val: 5},
                {ans: "12 to 16", val: 4},
                {ans: "17 to 15 ", val: 3},
                {ans: "Older than 25", val: 0}
            ],
            "2": [
                {ans: "Yes", val: 2},
                {ans: "No", val: 0}
            ],
            "3": [
                {ans: "Younger than 12", val: 0},
                {ans: "13 to 17", val: 0},
                {ans: "Older than 18", val: 0},
                {ans: "I haven’t had sex yet", val: 0}
            ],
            "4": [
                {ans: "More than once a day", val: 79},
                {ans: "Once a day", val: 73},
                {ans: "A few times a week", val: 65},
                {ans: "Less than once a week", val: 40}
            ],
            "5": [
                {ans: "More than once a day", val: 0},
                {ans: "Once a day", val: 0},
                {ans: "A few times a week", val: 0},
                {ans: "Less than once a week", val: 0}
            ],
            "6": [
                {ans: "I live by myself", val: 0},
                {ans: "I live with my partner", val: 0},
                {ans: "I live with family", val: 0},
                {ans: "I live with friends", val: 0}
            ],
            "7": [
                {ans: "Single", val: 0},
                {ans: "In a casual relationship", val: 0},
                {ans: "In a serious relationship", val: 0},
                {ans: "Married", val: 0},
            ],
            "8": [
                {ans: "Yes", val: 0},
                {ans: "No", val: 1}
            ],
            "9": [
                {ans: "Yes", val: 0},
                {ans: "No", val: 0}
            ],
            "10":  [
                {ans: "Yes", val: 0},
                {ans: "No", val: 0}
            ],
            "11":  [
                {ans: "Yes", val: 0},
                {ans: "No", val: 0}
            ],
            "12": [
                {ans: "Always", val: 5},
                {ans: "Often", val: 4},
                {ans: "Sometimes", val: 3},
                {ans: "Never", val: 0},
            ],
            "13": [
                {ans: "Yes", val: 2},
                {ans: "No", val: 0}
            ],
            "14": [
                {ans: "Yes", val: 0},
                {ans: "No", val: 0}
            ],
            "15": [
                {ans: "Heterosexual - straight", val: 0, dbValue: "heterosexual"},
                {ans: "Homosexual - gay", val: 0, dbValue: "homosexual"},
                {ans: "Bisexual", val: 0, dbValue: "bisexual"},
                {ans: "Other", val: 0, dbValue: "bisexual"}
            ],
            "16": [
                {ans: "Quitting porn", val: 0, dbValue: "porn"},
                {ans: "Quitting masturbation", val: 0, dbValue: "masturbation"},
                {ans: "Quitting porn & masturbation", val: 0, dbValue: "both"}
            ],
            "17": [
                {ans: "Male", val: 0, dbValue: "male"},
                {ans: "Female", val: 0, dbValue: "female"}
            ],
            "18": [{ans: "Yes", val: 2}, {ans: "No", val: 0}]
        };
        this.setState({
            questions: questions,
            answers:ans
        });
    };

    onSkipTest = () => {
        AsyncStorage.setItem('isIntroQuizSkip',"true");
        this.props.navigation.navigate("symptoms");
    };

    render() {
        return (
            <Animatable.View style={{flex:1, backgroundColor: 'rgb(241,241,241)'}} ref="mainView">
                <AppStatusBar backColor="#01536d"/>
                <Animatable.View ref="navView">
                    <NavBar title="Porn Addiction Test" questionNo={this.state.questionNo}/>
                </Animatable.View>

                <ScrollView style={{flex:1}}
                            bounces={false}
                            pagingEnabled={true}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            ref="mainScroll">
                    {
                        this.state.questions.map((que, index) => {
                            return(
                                (index != 17) ?
                                    <View style={{width: Constant.screenWidth,
                                    height: Constant.screenHeight - 74, paddingLeft: 24, paddingRight: 24}}
                                          key={index}>
                                        <QuestionCom questionText={que} key={index}/>
                                        {
                                            (this.state.answers[(index+1).toString()].map((obj, i) => {
                                                return(
                                                    <AnswerCom onSelectAnswer={this.onSelectAnswer}
                                                               backNum={(i+1).toString()}
                                                               backName={obj.ans}
                                                               val={obj.val}
                                                               answerObj={obj}
                                                               key={index+"-"+i}
                                                               questionNo={index+1}/>
                                                )
                                            }))
                                        }
                                    </View>
                                    :
                                    <Animated.View style={[{width: Constant.screenWidth,
                                                             height: Constant.screenHeight - 70,
                                                             paddingLeft: 24, paddingRight: 24},
                                                             this.userDetail.getLayout()]}
                                                   key={index}>
                                        <QuestionCom questionText={"A little more about you"}/>
                                        <UserDetail questionNo={index+1}
                                                    selectedAnswers={this.state.selectedAnswer}
                                                    onSelectAnswer={this.onSelectAnswer}/>
                                    </Animated.View>
                            );
                        })
                    }

                </ScrollView>

                <View style={{top:Constant.screenHeight*0.92, left:0, right:0, bottom:0,
                                  position: 'absolute', alignItems: 'center'}}>
                    <TouchableHighlight onPress={()=> this.onSkipTest()}
                                        underlayColor={Constant.transparent}>
                        <Text style={styles.txtBottom}>
                            Skip test
                        </Text>
                    </TouchableHighlight>
                </View>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    txtBottom:{
        fontSize: 14,
        color: '#acacac',
        textAlign: 'center',
        fontFamily: Constant.font500,
        padding: 10
    }
});