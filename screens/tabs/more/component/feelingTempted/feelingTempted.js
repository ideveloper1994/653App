import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    BackHandler,
    Text, Animated,
    TouchableOpacity,
    Image
} from 'react-native';
import Constant from '../../../../../helper/constant';
import NavigationBar from '../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import {removeSafeArea} from "../../../../../actions/userActions";
import {callTodayScreenEcentListner} from "../../../../../helper/appHelper";
import DeepBreath from './components/deepBreath';
import AnswerSelection from './components/answerSelection';
import FeelingTemptedSlider from './components/temptedSlider';
import * as Animatable from 'react-native-animatable';
import AppStatusBar from '../../../../commonComponent/statusBar';
import KeepAwake from 'react-native-keep-awake';

let arrRandom=[];
let questionNumber = 1;

let askForTempted = {
    question:"Are you in control of your temptation?",
    correctAnswer:"",
    answers:["Yes","No"],
    isExtraQuestion: true
};
let askForIknow = {
    question:"This urge will pass, and controlling yourself will make you stronger.",
    correctAnswer:"",
    answers:["I know"],
    isExtraQuestion: true
};
let askForFeelAfter = {
    question:"If you give in to temptation, how will you feel after?",
    correctAnswer:"",
    answers:["Fantastic","Guilty and ashamed"],
    isExtraQuestion: true
};

class FeelingTempted extends Component {

    constructor(props) {
        super(props);
        this.state = {
            temptedTitle: "Take a deep breath in",
            isBreathing: true,
            selectedQuestions: [],
            currentQuestion: {},
            isFinalView: false,
        };
        this.position = new Animated.Value(52);
        this.intervalId1 = null;
        this.intervalId2 = null;
    }

    componentDidMount() {
        KeepAwake.activate();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        arrRandom=[];
        questionNumber = 2;
        // this.setNewQuestion();
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount() {
        this.props.removeSafeArea(true);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onBackButtonPress = () => {
        KeepAwake.deactivate();
        this.props.removeSafeArea(true);
        this.props.navigation.goBack();
    };

    setTitleText = (title) => {
        this.setState({
            temptedTitle: title
        });
    }

    generateRandom = () => {
        let maximun=104,minimum=0;
        let randomnumber = Math.floor(Math.random() * (maximun - minimum + 1)) + minimum;
        if(arrRandom.indexOf(randomnumber) < 0) {
            arrRandom.push(randomnumber);
            return randomnumber;
        } else{
            return this.generateRandom();
        }
    };

    setNewQuestion = () => {
        try{
            switch (questionNumber) {
                case 1:
                case 7:
                case 13:
                    //breathing
                    if (this.refs.questionText && this.refs.centerView) {
                        this.refs.centerView.fadeOut(300);
                        this.refs.questionText.fadeOut(300).then(() => {
                            this.setState({
                                isBreathing: true,
                                temptedTitle: "Take a deep breath in",
                            }, () => {
                                if(this.refs.centerView) {
                                    this.refs.centerView.fadeIn(1500);
                                    this.refs.questionText.fadeIn(1500);
                                }
                            });
                        });
                    }
                    break;
                case 2:
                case 6:
                case 14:
                    //yes, no
                    if (this.state.isBreathing) {
                        setTimeout(() => {
                            if (this.refs.questionText && this.refs.centerView) {
                                this.refs.questionText.fadeOut(300);
                                this.refs.centerView.fadeOut(300).then(() => {
                                    this.setState({
                                        currentQuestion: askForTempted
                                    }, () => {
                                        setTimeout(() => {
                                            this.setState({
                                                temptedTitle: askForTempted.question,
                                                isBreathing: false
                                            }, () => {
                                                this.refs.questionText.fadeIn(300);
                                                setTimeout(() => {
                                                    if(this.refs.centerView){
                                                        this.refs.centerView.fadeIn(500);
                                                    }
                                                }, 300);
                                            });
                                        }, 200);
                                    })
                                });
                            }
                        }, 1500);
                    } else {
                        if (this.refs.questionText && this.refs.centerView) {
                            this.refs.centerView.fadeOut(300);
                            this.refs.questionText.fadeOut(300).then(() => {
                                this.setState({
                                    currentQuestion: askForTempted,
                                    temptedTitle: askForTempted.question,
                                    isBreathing: false
                                }, () => {
                                    if(this.refs.centerView) {
                                        this.refs.centerView.fadeIn(300);
                                        this.refs.questionText.fadeIn(300);
                                    }
                                });
                            })
                        }
                    }
                    break;
                case 3:
                case 4:
                case 5:
                case 9:
                case 10:
                case 11:
                    if(this.refs.questionText && this.refs.centerView){
                        this.refs.centerView.fadeOut(300);
                        this.refs.questionText.fadeOut(300).then(() => {
                            let jsonData = require('../../../../../helper/feelingTemptedQuestions');
                            let randomNumber = this.generateRandom();
                            let newQuestion = jsonData[randomNumber];
                            let selectedQuestions = this.state.selectedQuestions;
                            selectedQuestions.push(newQuestion);
                            this.setState({
                                selectedQuestions: selectedQuestions,
                                currentQuestion: newQuestion,
                                temptedTitle: newQuestion.question,
                                isBreathing: false
                            }, () => {
                                if(this.refs.centerView) {
                                    this.refs.centerView.fadeIn(300);
                                    this.refs.questionText.fadeIn(300);
                                }
                            });
                        });
                    }
                    //question
                    break;
                case 8:
                    //I know
                    if (this.state.isBreathing) {
                        setTimeout(() => {
                            if(this.refs.questionText && this.refs.centerView){
                                this.refs.questionText.fadeOut(300);
                                this.refs.centerView.fadeOut(300).then(() => {
                                    this.setState({
                                        currentQuestion: askForIknow
                                    },()=> {
                                        setTimeout(()=>{
                                            this.setState({
                                                temptedTitle: askForIknow.question,
                                                isBreathing: false
                                            }, () => {
                                                this.refs.questionText.fadeIn(300);
                                                setTimeout(()=>{
                                                    if(this.refs.centerView){
                                                        this.refs.centerView.fadeIn(500);
                                                    }
                                                },300);
                                            });
                                        },200);
                                    })
                                });
                            }
                        }, 1500);
                    } else {
                        if(this.refs.questionText && this.refs.centerView){
                            this.refs.centerView.fadeOut(300);
                            this.refs.questionText.fadeOut(300).then(() => {
                                this.setState({
                                    currentQuestion: askForIknow,
                                    temptedTitle: askForIknow.question,
                                    isBreathing: false
                                }, () => {
                                    if(this.refs.centerView) {
                                        this.refs.centerView.fadeIn(300);
                                        this.refs.questionText.fadeIn(300);
                                    }
                                });
                            })
                        }
                    }
                    break;
                case 12:
                    //ask for Feeling
                    if(this.refs.questionText && this.refs.centerView){
                        this.refs.centerView.fadeOut(300);
                        this.refs.questionText.fadeOut(300).then(() => {
                            this.setState({
                                currentQuestion: askForFeelAfter,
                                temptedTitle: askForFeelAfter.question,
                                isBreathing: false
                            }, () => {
                                if(this.refs.centerView){
                                    this.refs.centerView.fadeIn(300);
                                    this.refs.questionText.fadeIn(300);
                                }
                            });
                        })
                    }
                    break;
                case 15:
                    //final one
                    if(this.refs.questionText && this.refs.centerView) {
                        this.refs.centerView.fadeOut(300);
                        this.refs.questionText.fadeOut(300).then(() => {
                            this.setState({
                                isBreathing: false,
                                isFinalView: true
                            });
                        });
                    }
                    break;
            }
            questionNumber += 1;
        }catch (e){
            if(__DEV__){
                alert(e)
            }
        }
    }

    temptationAnswer = (answer) => {
        if(answer == 'Yes'){
            this.onBackButtonPress();
        }else{
            this.setNewQuestion();
        }
    }

    onEscapeActivityPress = () => {
        this.props.navigation.navigate('escapeMeditationActivityCard',
            {onGoBack: this.onBackButtonPress,
                transition: "myCustomSlideRightTransition"});
    }

    render() {
        return (
            <View style={[styles.container]}>
                <AppStatusBar backColor={'rgb(49,165,159)'}/>
                <View style={{flex:1}}>
                    <Animatable.Text style={styles.titleText} ref={"questionText"}
                                     animation="fadeIn" duration={500} delay={300}>
                        {this.state.temptedTitle}
                    </Animatable.Text>
                    <Animatable.View style={styles.centerView} duration={1200} delay={1200}
                                     ref={"centerView"}
                                     animation="fadeIn">
                        {
                            (this.state.isBreathing) &&
                            <DeepBreath setTitleText={this.setTitleText}
                                        setNewQuestion={this.setNewQuestion}/> ||
                            <AnswerSelection optionsData={this.state.currentQuestion}
                                             setNewQuestion={this.setNewQuestion}
                                             temptationAnswer={this.temptationAnswer}/>
                        }
                    </Animatable.View>
                </View>
                <TouchableOpacity onPress={()=> this.onBackButtonPress()}
                                  style={styles.cancelView}>
                    <Animatable.Text style={styles.cancelText} animation="fadeIn" duration={500} delay={500}>
                        Cancel
                    </Animatable.Text>
                </TouchableOpacity>
                {
                    (this.state.isFinalView) &&
                    <View style={{top:0, left:0, right:0, bottom:0, position: 'absolute', backgroundColor: 'rgb(49,165,159)',
                        alignItems:'center', paddingTop: 100}}>
                        <FeelingTemptedSlider onFeelingBetterPress={this.onBackButtonPress}
                                              onEscapeActivityPress={this.onEscapeActivityPress}/>
                    </View>
                    || null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(49,165,159)'
    },
    cancelView:{
        position: 'absolute',
        top: Constant.fullScreenHeight*0.90,
        left:0, right:0,
        alignItems:'center',
        backgroundColor:'transparent'
    },
    cancelText:{
        paddingBottom:10,
        textAlign:'center',
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize: 15,
        opacity: 0.7,
        backgroundColor:'transparent'
    },
    titleText:{
        alignSelf: 'center',
        color: '#FFF',
        fontFamily: Constant.font500,
        fontSize: 18,
        marginTop:Constant.screenHeight*0.13,
        textAlign:'center',
        maxWidth:'80%',
        lineHeight:25
    },
    centerView: {
        left:0,
        bottom:0,
        top:0,
        right:0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    removeSafeArea
})(FeelingTempted);