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
import Button from '../../../screens/commonComponent/button';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getAvatar } from '../../../helper/appHelper';

export default  class RewindPopUp extends React.PureComponent {

    constructor(props) {
        super(props);
        this.offset = new Animated.Value(Constant.screenHeight)
    }

    componentDidMount() {
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),
            toValue: 0,
            useNativeDriver: true
        }).start();
    }

    onButtonPress = () => {
        this.onPopupPress();
    };

    onPopupPress = () => {
        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(()=>{
            this.props.onHidePopup()
        });
    };

    getAvatarImage = () => {
        return getAvatar(this.props.rewindDetail.avatar_id || 0);
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <View style={styles.outerView}>
                <View style={[styles.transparentView,{backgroundColor: appColor.todayPopupBackgroundColor,
                    opacity: appColor.todayPopupBackOpacity}]}/>
                <Animated.View style={[styles.innerPopupView,{transform: [{translateY: this.offset}]}]}>
                    <AnimatedCircularProgress style={{transform: [{ rotate: '270deg'}],alignItems:'center',alignSelf:'center'}}
                                              size={80}
                                              width={6}
                                              fill={this.props.rewindDetail.circularRewiringPercentage}
                                              linecap={"false"}
                                              tintColor="rgb(156,239,147)"
                                              backgroundColor="rgba(255,255,255,0.4)">
                        {
                            (fill) => (
                                <View style={{ justifyContent: 'center', alignItems: 'center',
                                top:0, left:0, right:0, bottom:0,position: 'absolute'}}>
                                    <View style={{position: 'absolute',alignSelf:'center'}}>
                                        <Image resizeMode="cover"
                                               style={{height:58,
                                                        width:58,
                                                        borderRadius:29,
                                                        alignSelf:'center',
                                                        transform: [{rotate: '90deg'}]}}
                                               source={{uri:this.getAvatarImage()}}/>
                                    </View>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                    <Text style={styles.topTitle}>
                        {"Milestone reached"}
                    </Text>
                    <Text style={styles.subTitle}>
                        {`Your brain is ${this.props.rewindDetail.totalRewiringPercentage.toString()}% rewired`}
                    </Text>
                    <Button title={"Continue"}
                            backColor="#FFF"
                            color='rgb(221,88,129)'
                            otherStyle={{height: 60,width: '86%',marginTop: 30}}
                            otherTextStyle={{fontSize:15, fontFamily: Constant.font700}}
                            onPress={this.onButtonPress}/>
                </Animated.View>
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
        backgroundColor: 'rgb(221,88,129)',
        width: Constant.screenWidth - 40,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 13,
        paddingTop: 41,
        height: 320,
        marginBottom: 10,
        maxWidth:340,
    },
    topTitle: {
        color: "#eeb8c7",
        fontSize: 15,
        marginTop: 22,
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