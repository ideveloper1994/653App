import React, { Component } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import SmallButton from '../../../commonComponent/smallButton';
import ProgressBar from '../../../commonComponent/progressBar';
import { connect } from 'react-redux';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import {NavigationActions} from 'react-navigation';
import ProfilePopup from './profilePopup';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from './../../../commonComponent/statusBar';

class AboutYouComplete extends React.PureComponent {

    constructor(props) {
        super(props);
        let per = (props.navigation.state.params.activityNo) && Math.round(((props.navigation.state.params.activityNo - 1)/8)*100) || "0";
        if(per > 100){
            per = 100;
        }
        per =  per + "%";
        this.state={
            backColor: "#58c0f4",
            topText: "CONTINUES TOMORROW",
            showList: false,
            showPopUp: false,
            activityNo: props.navigation.state.params.activityNo,
            profilePer: per,
            barColor: 'rgb(79,167,224)',
        };
        this.position = new Animated.ValueXY(0,Constant.screenHeight*0.5-70);
        this.showAnimation = true;
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        Animated.timing(this.position, {
            toValue: {x:0, y:Constant.screenHeight*0.5-70}, duration:0
        }).start();
    }

    _handleBackPress = () => {
        // this.onContinuePress();
        return true;
    };

    componentDidMount(){
        this.setState({
            barColor: 'rgb(90,194,189)'
        });
        if(this.showAnimation) {
            setTimeout(()=>{
                this.setState({
                    showList:false
                },()=>{
                    setTimeout(()=>{
                        Animated.timing(this.position, {
                            toValue: {x:0, y:Constant.screenHeight*0.115}, duration:400
                        }).start(()=>{
                            this.setState({
                                showList:true
                            });
                        });
                    },500);
                });
            },700);
            this.showAnimation = false;
        }
    }

    onContinuePress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
        callTodayScreenEcentListner();
        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));
        this.props.navigation.popToTop();
    };

    onClosePopup = () => {
        this.setState({
            showPopUp: false
        });
    }

    onViewButton = () => {
        this.setState({
            showPopUp: true
        });
    }

    render() {
        return (
            <View style={[styles.container,{backgroundColor:'rgb(79,167,224)'}]}>
                <AppStatusBar backColor={this.state.barColor}/>
                <Animatable.View style={styles.container} animation="fadeIn" duration={500}>
                <Animated.View style={[{height:Constant.screenHeight, width:Constant.screenWidth, alignItems:'center'},
                    this.position.getLayout()]}>
                        <Animatable.Image source={{uri:'complete_large_tick_icon'}}
                                          style={styles.mainIcon}
                                          easing="ease-out-back"
                                          useNativeDriver={true}
                                          animation="zoomIn"
                                          ref="imgCircle"
                                          duration={400}
                                          delay={400}
                                          resizeMode={"contain"}/>
                        <Animatable.Text style={styles.titleText}
                                         animation="fadeIn"
                                         useNativeDriver={true}
                                         delay={400}
                                         duration={400}>
                            {"Profile updated"}
                        </Animatable.Text>

                </Animated.View>

                    {
                        (this.state.showList) &&
                        <Animatable.View style={{top:0, left:0, right:0, bottom:0,position: 'absolute',
                            alignItems: 'center', backgroundColor:'transparent'}}
                                         useNativeDriver={true} animation="fadeIn" duration={500}>

                            {
                                (this.state.profilePer !== "100%") &&
                                <View style={{top: Constant.screenHeight*0.115+142, left:0, right:0, bottom:0,
                                    backgroundColor: 'transparent',position: 'absolute', alignItems: 'center'}}>
                                    <View style={{backgroundColor: this.state.backColor,borderRadius: 5,
                                        height: 24, paddingLeft:10, paddingRight:10, justifyContent: 'center' }}>
                                        <Text style={styles.subTitleText}>
                                            {this.state.topText}
                                        </Text>
                                    </View>
                                </View>
                                || null
                            }

                            <View style={{top:Constant.screenHeight*0.43, left:0, right:0, bottom:0,
                                position: 'absolute', alignItems: 'center'}}>
                                <Text style={styles.textTop}>
                                    {"Your profile"}
                                </Text>

                                <View style={{width:"80%"}}>
                                    <ProgressBar otherColor="rgba(255,255,255,0.3)"
                                                 progressVal={this.state.profilePer}
                                                 fillBarColor="rgb(139,232,145)"/>
                                </View>

                                <Text style={styles.textPre}>
                                    {this.state.profilePer + " complete"}
                                </Text>
                            </View>

                            <View style={{top:Constant.screenHeight*0.70, left:0, right:0, bottom:0,
                                position: 'absolute', alignItems: 'center'}}>
                                <Text style={styles.textTitleQue}>
                                    {"WHY THESE QUESTIONS?"}
                                </Text>

                                <Text style={styles.txtDetail}>
                                    {"Your profile helps us understand you and the nature of your porn use, find patterns in the community," +
                                    " and create tailored exercises that help you recover effectively."}
                                </Text>
                            </View>

                            <View style={{top:0, left:0, right:0, bottom:0,position: 'absolute', alignItems: 'center'}}>
                                <TouchableHighlight onPress={()=> this.onContinuePress()}
                                                    style={{width:"100%", paddingTop:Constant.screenHeight*0.92-10}}
                                                    underlayColor={Constant.transparent}>
                                    <Text style={styles.txtBottom}>
                                        TAP TO CONTINUE
                                    </Text>
                                </TouchableHighlight>
                            </View>


                            <View style={{top:Constant.screenHeight*0.43+91,position: 'absolute', left:"30%", right:"30%",
                                alignItems: 'center'}}>
                                <SmallButton backColor="rgba(0,0,0,0.08)"
                                             textColor="#FFF"
                                             titleText={"View components"}
                                             onPress={this.onViewButton}/>
                            </View>

                        </Animatable.View>

                        || null
                    }

                {
                    (this.state.showPopUp) &&

                    <ProfilePopup onClosePopup={this.onClosePopup}
                                  avtarId={this.props.userDetail.avatar_id || 0}
                                  activityNo={this.state.activityNo}
                                  appTheme={this.props.appTheme}
                                  gender={this.props.userDetail.gender || ""}
                    />
                    || null
                }
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgb(90,194,189)',
        alignItems: 'center'
    },
    mainIcon: {
        height: 88,
        width: 88
    },
    titleText:{
        fontSize: 20,
        color: '#FFF',
        fontFamily: Constant.font300,
        marginTop:14
    },
    subTitleText:{
        fontSize: 12,
        color: '#FFF',
        fontFamily: Constant.font700,
    },
    txtSubTitle:{
        marginTop: 12,
        fontSize: 12,
        color: '#b9e2e0',
        textAlign: 'center',
        fontFamily: Constant.font700,
    },
    txtDetail:{
        fontSize: 13,
        color: '#e4f4f3',
        textAlign: 'center',
        fontFamily: Constant.font700,
        width: "80%",
        lineHeight: 20,
    },
    txtBottom:{
        //marginTop:Constant.screenHeight*0.92-10,
        fontSize: 12,
        color: '#b9e2e0',
        textAlign: 'center',
        fontFamily: Constant.font700,
        padding: 10
    },
    textTop:{
        fontSize: 13,
        color: '#FFF',
        fontFamily: Constant.font700,
        marginBottom:17
    },
    textPre:{
        fontSize: 12,
        color: '#FFF',
        fontFamily: Constant.font500,
        marginBottom:19,
        marginTop: 17
    },
    textTitleQue:{
        marginBottom: 15,
        fontSize: 12,
        color: '#b9e2e0',
        textAlign: 'center',
        fontFamily: Constant.font700,
    }

});

const mapStateToProps = state => {
    return {
        userDetail:state.user.userDetails,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
})(AboutYouComplete);