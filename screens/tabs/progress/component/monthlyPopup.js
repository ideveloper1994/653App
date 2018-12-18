import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing
} from 'react-native';
import Constant from '../../../../helper/constant';
import ProgressBar from '../../../commonComponent/progressBar';
import * as Animatable from 'react-native-animatable';
import {getCurrentMonth} from "../../../../helper/appHelper";

export default  class MonthlyPopUp extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isTouchEnable: false
        };
        this.offset = new Animated.Value(Constant.screenHeight)
        this.animatedValue = new Animated.ValueXY(0,0);
    }

    componentWillMount() {
        this.animatedValue = new Animated.ValueXY(0,0);
    }

    componentDidMount () {
        if(this.props.monthlyDetail  && this.props.monthlyDetail.isAchieved){
            this.cycleAnimation();
        }
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),
            toValue: 0,
            useNativeDriver: true
        }).start(()=>{
            this.setState({
                isTouchEnable: true
            });
        });
    }

    cycleAnimation() {
        this.animatedValue.setValue({x:0,y:-((Constant.screenWidth*10.67)-Constant.screenHeight)});
        Animated.timing(this.animatedValue, {
            toValue: {x:0,y:0},
            duration: 90000,
            easing: Easing.linear
        },{useNativeDriver: true}).start(() => {
            setTimeout(() => {
                this.cycleAnimation();
            },0)
        });
    }

    onPopupPress = () => {
        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(()=>{
            this.props.onHidePopup();
        });
    };

    render() {
        const {year, month, description, title, iconType, progressPer, actualProgress} = this.props.monthlyDetail;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <View style={styles.outerView}>
                <View style={[styles.transparentView,{backgroundColor: appColor.todayPopupBackgroundColor,
                    opacity: appColor.todayPopupBackOpacity}]}/>

                {
                    (this.props.monthlyDetail  && this.props.monthlyDetail.isAchieved) &&
                    <View style={{position:'absolute',width:'100%',height:Constant.screenHeight}}>
                        <Animated.View style={{width:Constant.screenWidth, height:Constant.screenWidth*10.67,
                            marginTop:this.animatedValue.y}}>
                            <Image source={{uri:'intro_slider_confetti8000'}}
                                   resizeMode={"contain"}
                                   style={{width:Constant.screenWidth, height:Constant.screenWidth*10.67, opacity:0.3}}/>
                        </Animated.View>
                    </View>
                }

                <Animated.View style={[styles.innerPopupView,{transform: [{translateY: this.offset}]}]}>
                    <View style={{height: 65,width: 63, alignItems:'center'}}>
                        <Image style={{height: "100%",width: "100%",alignSelf: 'center'}}
                               resizeMode={'contain'}
                               source={appColor.specialAchievementIcon[iconType][month]}/>
                        <Text style={{top:34, fontSize:7, color: appColor.iconYearText[iconType], position:'absolute',
                                fontFamily:Constant.font700}}>{year}</Text>
                    </View>

                    <Text style={styles.topTitle}>
                        {description}
                    </Text>
                    <Text style={styles.subTitle}>
                        {title}
                    </Text>
                    <View style={{width: "76%", marginTop: 42}}>
                        <ProgressBar otherColor='rgba(255,255,255, 0.3)'
                                     progressVal={progressPer || "4%"}
                                     fillBarColor={'rgb(153,235,147)'}/>
                    </View>
                    <Text style={styles.bottomTitle}>
                        {actualProgress}
                    </Text>
                </Animated.View>
                {
                    (this.state.isTouchEnable) &&
                    <TouchableHighlight
                        onPress={() => this.onPopupPress()}
                        style={{top:0, left:0, right:0, bottom:0, position: 'absolute',
                            backgroundColor: Constant.transparent}}
                        underlayColor={Constant.transparent}>
                        <View/>
                    </TouchableHighlight>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        top:0, left:0, right:0, bottom:0, position: 'absolute', backgroundColor:'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transparentView: {
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'#173d51',
        opacity:0.9, alignItems:'center', justifyContent:'center'
    },
    innerPopupView:{
        backgroundColor: 'rgb(237,194,115)',
        width: Constant.screenWidth - 40,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 13,
        paddingTop: 41,
        height: 320,
        marginBottom: 10,
        maxWidth:340,
    },
    topTitle:{
        color:"#f7e4c5",
        fontSize:15,
        marginTop: 24,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
    bottomTitle:{
        color:"#f7e4c5",
        fontSize:14,
        marginTop: 20,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
    subTitle:{
        color:"#fff",
        fontSize: 22,
        marginTop: 10,
        fontFamily: Constant.font300,
        textAlign: 'center'
    },
});