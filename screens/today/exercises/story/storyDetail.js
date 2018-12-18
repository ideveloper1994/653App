import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    ScrollView,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import StoryInit from './storyInit';
import HTML from 'react-native-render-html';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import {NavigationActions} from 'react-navigation';
import { callTodayScreenEcentListner } from '../../../../helper/appHelper';
import AppStatusBar from '../../../commonComponent/statusBar';

class Story extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            storyDetail: ``,
            isNextVisible: false,
            isInstruction: true,
            isLoaded : false,
            storyData: ``,
            exercise_number_story: props.exercise_number_story || 1,
            params: props.navigation.state.params
        };
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        let exeNo = this.props.exercise_number_story;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 80){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_story: exeNo
        });
        this.getStoryDetail(exeNo);
        callTodayScreenEcentListner(false);
    }

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.state.exercise_number_story != nextProps.exercise_number_story){
            this.getStoryDetail();
        }
    };

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    onBtnDonePress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            let activityNo = this.props.exercise_number_story;
            // activityNo = (activityNo >= 80) ? 1 : ++activityNo;
            if(activityNo >= 80){
                if(activityNo > 80){
                    activityNo = 1;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_story: activityNo }, this.state.params.improve || []);
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            if(this.state.params.isLast){
                this.props.navigation.navigate("completeMorningRoutine");
            }else{
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
        }catch (e){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.popToTop();
        }
    };

    getStoryDetail = (exno = 0) => {
        let activity = this.state.exercise_number_story;
        if(exno != 0){
            activity = exno;
        }
        let url = "https://davidsdomainblog.wordpress.com/category/story-" + activity + "/feed/";
        let that = this;
        this.setState({
            storyDetail: "",
            isNextVisible: false
        });
        const parseString = require('react-native-xml2js').parseString;
        axios.get(url).then(res => {
            parseString(res.data, function (err, result) {
                if(err == null){
                    that.setState({
                        storyData: `${result.rss.channel[0].item[0]["content:encoded"][0]}`,
                        isNextVisible: true,
                        isLoaded: true
                    }, () =>{
                        // that.refs.mainScroll.scrollTo({x: 0, y: 10, animated: true});
                    });
                    // that.refs.view1.fadeInDown(0);
                    // that.refs.view1.fadeInUp(300);
                }
            });
        }).catch(err => {
            that.setState({
                storyDetail:`<p>Fail to get story detail</p>`
            });
        });

    };

    //Instruction Page
    onCloseButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        //this.props.navigation.navigate("today",{isFadeToday: true})
        callTodayScreenEcentListner();
        this.props.navigation.popToTop();
        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setState({
            storyDetail: this.state.storyData,
            isInstruction: false
        }, () =>{
            if(this.refs.mainScroll) {
                this.refs.mainScroll.scrollTo({x: 0, y: 10, animated: true});
            }
            if(this.refs.view1){
                this.refs.view1.fadeInDown(0);
                this.refs.view1.fadeInUp(300);
            }
        });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Wisdom"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <StoryInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = {this.state.exercise_number_story}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {this.state.isLoaded}
                per={per}/>
        )
    };

    render() {
        const {container, textTitle, bottomButton} = styles;
        let desc = this.state.storyDetail
            // .replace(new RegExp('<p', 'g'), '<span')
            // .replace(new RegExp('<p>', 'g'), '<span>')
            // .replace(new RegExp('</p>', 'g'), '</span>')
            .replace(new RegExp('1em', 'g'), '100%')
            .replace(new RegExp('#3b3b3b', 'g'), '#FFF');
        // .replace(new RegExp('<br />', 'g'), '');

        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(49,165,159)'/>
                <View style={container}>
                    <ScrollView style={[container,{paddingLeft:20, paddingRight:20}]} ref="mainScroll"
                                automaticallyAdjustContentInsets={false}
                                removeClippedSubviews={false}>
                        {
                            (this.state.isNextVisible) &&

                            <Animatable.View ref="view1">
                                <Text style={textTitle}>Story</Text>
                                <HTML html={desc}
                                    tagsStyles={storyStyle}/>
                                <TouchableHighlight onPress={() => this.onBtnDonePress() }
                                                    underlayColor={Constant.transparent}>
                                    <Image source={{uri:'button_tick_circle'}}
                                           style={bottomButton}
                                           resizeMode={"contain"}/>
                                </TouchableHighlight>
                            </Animatable.View>
                            || null
                        }

                    </ScrollView>
                    {
                        (this.state.isInstruction) ?
                            this.renderInitComponent()
                            : null
                    }
                </View>
            </View>
        );
    }
}

let styleObj = {
    fontSize: 15.5,
    color: '#FFF',
    fontFamily: Constant.font500,
    marginBottom: 20,
    lineHeight: 23
};

const storyStyle = {
    span: {
        fontSize: 15.5,
        color: '#FFF',
        fontFamily: Constant.font500,
        marginBottom: 20,
        lineHeight: 23,
    },
    p: {
        fontSize: 15.5,
        color: '#FFF',
        fontFamily: Constant.font500,
        padding:0,
        lineHeight: 23,
        marginBottom: 20,
    },
    ul: {
        fontSize: 15.5,
        color: '#FFF',
        marginTop: 0,
        fontFamily: Constant.font500,
        lineHeight: 23
    },
    li: {
        marginTop: 0,
        fontSize: 15.5,
        color: '#FFF',
        fontFamily: Constant.font500,
        lineHeight: 23
    },
    a:styleObj,
    ol:styleObj,
    div:styleObj,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(49,165,159)',
    },
    textDetail: {
        fontSize:15,
        color:'#FFF',
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: Constant.font500,
    },
    textTitle: {
        fontSize:24,
        textAlign: 'center',
        color:'#FFF',
        marginTop:55,
        marginBottom: 40,
        fontFamily: Constant.font300,
    },
    bottomButton:{
        width: 56,
        height: 56,
        borderRadius: 28,
        alignSelf:"center",
        marginTop:20,
        marginBottom: 50
    }
});

const mapStateToProps = state => {
    return {
        exercise_number_story: state.metaData.metaData.exercise_number_story || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(Story);