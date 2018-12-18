import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    Modal,
} from 'react-native';
import QuestionCom from '../../account/welcome/components/quiz/questionComponent';
import AnswerCom from '../component/checkup/answerComponent';
import NextCom from '../component/checkup/nextConponent';
import Constant from '../../../helper/constant';
import NavigationBar from '../component/checkup/checkupNavigation';
import _ from 'lodash';
import { connect } from 'react-redux';
import { setCheckupData, addNewCheckupQuestion } from '../../../actions/metadataActions'
import { removeSafeArea,managePopupQueue } from '../../../actions/userActions'
import AddNewComponent from '../component/checkup/addNewComponent';
import {callTodayScreenEcentListner, showNoInternetAlert} from '../../../helper/appHelper';

let isLoadingAPI = false;

class Checkup extends Component {

    constructor(props){
        super(props);
        this.state = {
            questions: {},
            answers: {},
            questionKey: "1",
            pageNo: 0,
            selectedAnswer: {},
            isBack: false,
            allQuestions: props.allQuestions,
            modalVisible: false,
            questionNoForAddNewOption: 0,
            isFailToCheckup: false
        };
    }

    componentWillMount() {
        this.props.removeSafeArea();
        callTodayScreenEcentListner(false);
        let obj = this.props.popupQueue;
        obj.checkup = true;
        this.props.managePopupQueue(obj);
        Object.keys(this.state.allQuestions).map((key)=>{
            this.state.allQuestions[key].isSelected = false;
        });
        this.state.questions["1"] = this.state.allQuestions["1"];
    }

    componentDidMount() {
        setTimeout(()=>{
            if(this.props.navigation.state.params && this.props.navigation.state.params.scrollToTopToday){
                this.props.navigation.state.params.scrollToTopToday()
            }
        },2000)
    }

    onSelectAnswer = (strQuestionNo, hasNext) => {
        let pageNo = this.state.questions && Object.keys(this.state.questions).length - 1;
        this.setState({
            pageNo: pageNo,
            isBack: Object.keys(this.state.questions).length > 1
        });
        if(hasNext) {
            if(this.refs && this.refs.mainScroll) {
                this.refs.mainScroll.scrollTo({x: (Constant.screenWidth) * pageNo, y: 0, animated: true});
            }
        }
    };

    setNextQuestion = (strQuestionNo, selectedObj) => {
        try{
            if(this.state.selectedAnswer[strQuestionNo] != undefined && this.state.questions[strQuestionNo].isMultipleSelection){
                let objectIndex = (this.state.selectedAnswer[strQuestionNo]).indexOf(selectedObj);
                let selectedAnswer = this.state.selectedAnswer[strQuestionNo];
                if(objectIndex >= 0){
                    selectedAnswer.splice(objectIndex, 1);
                }else{
                    selectedAnswer.push(selectedObj);
                }
                this.state.selectedAnswer[strQuestionNo] = selectedAnswer;
            }else{
                this.state.selectedAnswer[strQuestionNo] = [selectedObj];
            }
            this.setState({});
            if(selectedObj.nexQuestion != 0) {
                let nextIndex = selectedObj.nexQuestion.toString();
                if (selectedObj.nexQuestion == 16) {
                    let ans = this.state.selectedAnswer["1"][0].str;
                    if (ans == "No") {
                        nextIndex = "17"
                    }
                }
                let questions = this.state.questions;
                questions[nextIndex] = this.state.allQuestions[nextIndex];
                this.setState({
                    questions: questions,
                    questionKey: selectedObj.nexQuestion.toString()
                });
            }
        }catch (e){
            console.log(e.message)
        }
    };

    //Here manage new Reason
    onAddNewPress = (strQuestionNo, selectedObj) => {
        this.setState({
            questionNoForAddNewOption: strQuestionNo,
            modalVisible: true
        });
    };

    //Add new modal colse
    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false
        });
    };

    newQuestionAdded = (questionKey, txtReason) => {
        let newObj = _.cloneDeep(this.state.allQuestions[questionKey].answer[0]);
        let isNew = _.find(this.state.allQuestions[questionKey].answer,
            function (o) { return o.str.toString().toLowerCase() ==  txtReason.toString().toLowerCase(); });
        if(isNew == undefined){
            newObj.str = txtReason;
            newObj.isAddedNewObj = true;
            this.state.allQuestions[questionKey].answer.splice(this.state.allQuestions[questionKey].answer.length-1, 0, newObj);
            this.setNextQuestion(questionKey, newObj);
        }
    };

    onBackButtonPress = () => {
        try{
            if(this.state.pageNo > 0) {
                let keys = Object.keys(this.state.questions);
                this.setState({
                    selectedKey: keys[keys.length - 2]
                });
                let data = _.omit(this.state.questions,keys[keys.length - 1]);
                let pages = Object.keys(data).length;
                if(this.refs.mainScroll) {
                    this.refs.mainScroll.scrollTo({x: (Constant.screenWidth) * (pages - 1), y: 0, animated: true});
                }
                this.setState({
                    pageNo: pages,
                    isBack: Object.keys(data).length > 1
                });

                let visiblePageKey = keys[keys.length - 2];

                if(this.state.questions[visiblePageKey] != undefined){
                    let isMultipleSelection = this.state.questions[visiblePageKey].isMultipleSelection;
                    // if(isMultipleSelection){
                    let selectedAnswer = _.omit(this.state.selectedAnswer,visiblePageKey);
                    this.setState({
                        selectedAnswer: selectedAnswer
                    });
                    // }
                }
                setTimeout(()=>{
                    this.setState({
                        questions: data,
                        pageNo: pages,
                    });
                },500);
            }
        }catch (e){
            console.log(e.message);
        }
    };

    onCheckupComplete = () => {
        try{
            let isPornFreeDay = false;
            let ans = this.state.selectedAnswer[1][0]["str"] || "";
            if(ans === "Yes"){
                isPornFreeDay = true;
            }
            if(this.props.isConnected && !isLoadingAPI){
                this.props.addNewCheckupQuestion(this.state.allQuestions);
                isLoadingAPI = true
                if(this.props.navigation.state.params.isYesterday){
                    this.props.setCheckupData(this.state.selectedAnswer, true).then(res=>{
                        isLoadingAPI = false;
                        this.props.navigation.navigate("checkUpComplete", {isFromToday: this.props.navigation.state.params.isFromToday,
                            navigationKey: this.props.navigation.state.key, onBackToTabView: this.props.navigation.state.params.onBackToTabView,
                            scrollToTopToday: this.props.navigation.state.params.scrollToTopToday,
                            isPornFreeDay: isPornFreeDay});
                    }).catch((error) => {
                        isLoadingAPI = false;
                        this.setState({
                            isFailToCheckup: true
                        });
                        console.log(error)
                    });
                }else{
                    let ans = this.state.selectedAnswer[1][0]["str"] || "";
                    if(ans === "Yes"){
                        isPornFreeDay = true;
                    }
                    this.props.setCheckupData(this.state.selectedAnswer).then(res=>{
                        isLoadingAPI = false;
                        this.props.navigation.navigate("checkUpComplete", {isFromToday: this.props.navigation.state.params.isFromToday,
                            navigationKey: this.props.navigation.state.key, onBackToTabView: this.props.navigation.state.params.onBackToTabView,
                            scrollToTopToday: this.props.navigation.state.params.scrollToTopToday,
                            isPornFreeDay: isPornFreeDay});
                    }).catch((error) => {
                        isLoadingAPI = false;
                        this.setState({
                            isFailToCheckup: true
                        });
                        console.log(error)
                    });
                }
                //  this.props.navigation.navigate("checkUpComplete", {isFromToday: this.props.navigation.state.params.isFromToday,
                // navigationKey: this.props.navigation.state.key});
            }else{
                if(!this.props.isConnected){
                    showNoInternetAlert();
                }
                this.setState({
                    isFailToCheckup: true
                });
            }
        }catch (e){
            if(__DEV__){
                alert(e);
            }
        }
    };

    // onBackButtonPress = () => {
    //     this.props.navigation.goBack();
    // };

    render() {
        return (
            <View style={{flex:1, backgroundColor: 'rgb(241,241,241)'}} ref="mainView">
                <NavigationBar onBackButtonPress={this.onBackButtonPress}
                               title="Checkup"
                               top={this.props.safeAreaInsetsData.top}
                               isBack={this.state.isBack}
                               appTheme={this.props.appTheme}/>

                <ScrollView style={{flex:1}}
                            bounces={false}
                            pagingEnabled={true}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            ref="mainScroll">
                    {
                        Object.keys(this.state.questions).map((key, index) => {
                            let questionStr = (this.props.navigation.state.params.isYesterday) ?
                                this.state.questions[key].question.replace("today", "yesterday") :
                                this.state.questions[key].question;
                            questionStr = (this.props.gender === "female" && questionStr.includes("spontaneous"))
                                ? "Did you feel sexually aroused today?" : questionStr;
                            return(
                                <ScrollView
                                    scrollEnabled={true}
                                    contentContainerStyle={{paddingBottom:50}}
                                    showsVerticalScrollIndicator={false}
                                    style={{width: Constant.screenWidth,
                                        height: Constant.screenHeight - 70, paddingLeft: 24, paddingRight: 24}}
                                    key={index}>
                                    <View>
                                        <QuestionCom questionText={questionStr} key={index} />
                                        {
                                            (this.state.questions[key].answer.map((obj, i) => {
                                                let isSelected = (this.state.selectedAnswer[key] !== undefined) &&
                                                    (this.state.selectedAnswer[key]).indexOf(obj) >= 0 || false;
                                                if(questionStr === "Did you have sex today?"){
                                                    obj.icon = "G";
                                                }
                                                return(
                                                    <AnswerCom onSelectAnswer={this.onSelectAnswer}
                                                               key={index+"-"+i}
                                                               answerObj={obj}
                                                               questionKey={key}
                                                               questionIndex={(i+1).toString()}
                                                               isSelected={isSelected}
                                                               isMultipleSelection={this.state.questions[key].isMultipleSelection}
                                                               onAddNewPress={this.onAddNewPress}
                                                               setNextQuestion={this.setNextQuestion}/>
                                                )
                                            }))
                                        }
                                        {
                                            (this.state.questions[key] && this.state.questions[key].isMultipleSelection) &&
                                            <NextCom onSelectAnswer={this.onSelectAnswer}
                                                     questionKey={key}
                                                     appTheme={this.props.appTheme}
                                                     isAnswered={(this.state.selectedAnswer[key] !== undefined &&
                                                         ((this.state.selectedAnswer[key]).length > 0))}
                                                     onCheckupComplete={this.onCheckupComplete}
                                                     hasNext={(key !== "16" && key !== "17")}
                                                     isFailToCheckup={this.state.isFailToCheckup}/>
                                            || null
                                        }
                                    </View>

                                </ScrollView>
                            );
                        })
                    }
                </ScrollView>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <AddNewComponent onClosePress={this.onCloseBtnPress}
                                     top={this.props.safeAreaInsetsData.top}
                                     questionNo={this.state.questionNoForAddNewOption}
                                     appTheme={this.props.appTheme}
                                     newQuestionAdded={this.newQuestionAdded}/>
                </Modal>
                {(false)&&
                <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.0)',
                    justifyContent:'center', alignItems:'center'}}/>
                ||<View/>
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        p_array: state.statistic.pornDetail.p_array,
        m_array: state.statistic.mosturbutionDetail.m_array,
        metaData: state.metaData.metaData,
        allQuestions: state.metaData.checkupQuestions,
        gender :state.user.userDetails.gender,
        isConnected: state.user.isConnected,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        popupQueue: state.user.popupQueue,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    setCheckupData,
    addNewCheckupQuestion,
    managePopupQueue,
    removeSafeArea
})(Checkup);