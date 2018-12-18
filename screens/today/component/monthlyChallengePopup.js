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
import Constant from '../../../helper/constant';
import ProgressBar from '../../commonComponent/progressBar';


export default  class MonthlyCheckupPopUp extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isTouchEnable: false
        };
        this.offset = new Animated.Value(Constant.screenHeight);
    }

    componentDidMount () {
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

                <Animated.View style={[styles.innerPopupView,{transform: [{translateY: this.offset}],
                    backgroundColor: appColor.popUp[iconType].backColor}]}>

                    <View style={{height: 86,width: 88, alignItems:'center'}}>
                        <Image style={{height: "100%",width: "100%",alignSelf: 'center',}}
                               resizeMode={'contain'}
                               source={appColor.specialAchievementIcon[iconType][month]}/>
                        <Text style={{top:45, fontSize:8, color: appColor.iconYearText[iconType], position:'absolute',
                        fontFamily:Constant.font700}}>{year}</Text>
                    </View>
                    <Text style={styles.topTitle}>
                        {title}
                    </Text>
                    <Text style={[styles.subTitle,{color:appColor.popUp[iconType].textColor}]}>
                        {description}
                    </Text>
                    <View style={{width: "76%", marginTop: 42}}>
                        <ProgressBar otherColor={appColor.popUp[iconType].progressColor}
                                     progressVal={progressPer || "4%"}
                                     fillBarColor={'rgb(153,235,147)'}/>
                    </View>
                    <Text style={[styles.bottomTitle,{color:appColor.popUp[iconType].textColor}]}>
                        {actualProgress}
                    </Text>
                </Animated.View>
                {
                    (this.state.isTouchEnable) &&
                    <TouchableHighlight
                        onPress={() => this.onPopupPress()}
                        style={{top:0, left:0, right:0, bottom:0, position: 'absolute',
                            backgroundColor: Constant.transparent}}
                        underlayColor="transparent">
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
        width: Constant.screenWidth - 40,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 13,
        paddingTop: 41,
        marginBottom: 10,
        maxWidth:340,
        paddingBottom: 41,
    },
    topTitle:{
        color:"#fff",
        fontSize:22,
        marginTop: 24,
        fontFamily: Constant.font300,
        textAlign: 'center'
    },
    bottomTitle:{
        color:"#dfecec",
        fontSize:14,
        marginTop: 20,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
    subTitle:{
        color:"#dfecec",
        fontSize: 15,
        marginTop: 10,
        fontFamily: Constant.font500,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: '80%'
    },
});