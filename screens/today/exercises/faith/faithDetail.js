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
import FaithInit from './faithInit';
import HTML from 'react-native-render-html';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';

class Faith extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            faithDetail: ``,
            isNextVisible: false,
            isInstruction: true,
            isLoaded : false,
            faithData: ``,
            params: props.navigation.state.params,
            exercise_number_faith: props.exercise_number_faith,
        };
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        callTodayScreenEcentListner(false);
        let exeNo = this.props.exercise_number_faith;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 100){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_faith: exeNo
        });


        this.getStoryDetail(exeNo);
    }

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }

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
            let activityNo = this.props.exercise_number_faith;
            if(activityNo >= 100){
                if(activityNo > 100){
                    activityNo = 1;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_faith: activityNo }, this.state.params.improve || []);
            if(this.state.params.isOptional){
                this.props.navigation.navigate("completeOptionalActivity",
                    {title: "Faith exercise complete", data: ["Faith"]});
            }else{
                if(this.state.params.isLast){
                    this.props.navigation.navigate("completeMorningRoutine");
                }else{
                    this.state.params.makeFadeInAnimation();
                    this.props.navigation.goBack()
                }
            }
        }
    };

    getStoryDetail = (exNo) => {
        let url = "https://davidsdomainblog.wordpress.com/category/faith-"+ exNo +"/feed";
        let that = this;
        this.setState({
            faithDetail: "",
            isNextVisible: false
        });
        const parseString = require('react-native-xml2js').parseString;
        axios.get(url).then(res => {
            parseString(res.data, function (err, result) {
                if(err == null) {
                    that.setState({
                        faithData: `${result.rss.channel[0].item[0]["content:encoded"][0]}`,
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
                faithDetail:`<p>Fail to get scripture detail</p>`,
                isLoaded: true
            });
        });
    };

    //Instruction Page
    onCloseButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack()
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setState({
            faithDetail: this.state.faithData,
            isInstruction: false
        }, () =>{
            // this.refs.mainScroll.scrollTo({x: 0, y: 10, animated: true});
        });
        if(this.refs.view1){
            this.refs.view1.fadeInDown(0);
            this.refs.view1.fadeInUp(300);
        }
    };

    renderInitComponent = () => {
        return(
            <FaithInit
                excerciseNumber = {this.state.exercise_number_faith}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {this.state.isLoaded}
            />
        )
    };


    render() {
        const {container,  bottomButton } = styles;
        let desc = this.state.faithDetail
            .replace(new RegExp('<p', 'g'), '<span')
            .replace(new RegExp('<p>', 'g'), '<span>')
            .replace(new RegExp('</p>', 'g'), '</span>')
            .replace(new RegExp('1em', 'g'), '100%')
            .replace(new RegExp('#3b3b3b', 'g'), '#FFF');
        // .replace(new RegExp('<br />', 'g'), '');

        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(25,165,202)'/>

                <View style={container}>
                    {
                        (this.state.isNextVisible) &&

                        <Animatable.View ref="view1" style={{flex:1,
                        alignSelf: 'center', width:"80%",
                        justifyContent: 'center'}}>
                            <View>
                                <HTML
                                    html={desc}
                                    tagsStyles={storyStyle}/>
                            </View>

                            <View style={{left: 0, right: 0, bottom: 36, position: 'absolute', paddingTop: Constant.screenHeight*0.86 }}>
                                <TouchableHighlight onPress={() => this.onBtnDonePress() }
                                                    underlayColor={Constant.transparent}>
                                    <Image source={{uri:'button_tick_circle'}}
                                           style={bottomButton}
                                           resizeMode={"contain"}/>
                                </TouchableHighlight>
                            </View>

                        </Animatable.View>

                        || null
                    }
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
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF',
    fontFamily: Constant.font500,
    marginBottom: 20,
    lineHeight: 24,
};


const storyStyle = {
    span: {
        fontSize: 17,
        color: '#FFF',
        fontFamily: Constant.font500,
        margin: 0,
        textAlign: 'center',
        lineHeight: 24,
    },
    p: {
        textAlign: 'center',
        fontSize: 17,
        color: '#FFF',
        fontFamily: Constant.font500,
        margin: 0,
        padding:0,
        lineHeight: 24,
    },
    ul: {
        fontSize: 17,
        textAlign: 'center',
        color: '#FFF',
        marginTop: 0,
        fontFamily: Constant.font500,
        lineHeight: 24,
    },
    li: {
        textAlign: 'center',
        marginTop: 0,
        fontSize: 17,
        color: '#FFF',
        fontFamily: Constant.font500,
        lineHeight: 24,
    },
    a:styleObj,
    ol:styleObj,
    div:styleObj,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(25,165,202)'//'rgb(30,146,138)',
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
        //marginTop:Constant.screenHeight*0.86,
        width: 56,
        height: 56,
        alignSelf:"center",
    }
});

const mapStateToProps = state => {
    return {
        exercise_number_faith: state.metaData.metaData.exercise_number_faith || 1,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(Faith);