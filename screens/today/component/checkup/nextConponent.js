import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing,
    Alert
} from 'react-native';
import Constant from '../../../../helper/constant';
import Rate, {AndroidMarket} from "react-native-rate";
import {showThemeAlert} from "../../../../helper/appHelper";

let nextIcons = {
    nextWhite: {uri:'checkup_next_white_tick'},
    nextGray: {uri:'checkup_next_gray_tick'},
    doneWhite: {uri:'checkup_white_done'},
    doneGray: {uri:'checkup_gray_done'},
};

export default  class NextComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            isSelected:  false
        };
        this.scaleValue = new Animated.Value(0);
    }

    componentWillReceiveProps(nextProps){
        setTimeout(()=>{
            this.setState({
                isSelected:  false
            });
        },300);
    }

    onSelectNext = () => {
        if(this.props.isAnswered || this.props.questionKey == "16" || this.props.questionKey == "17"){
            if(!this.state.isSelected) {
                this.setState({isSelected:true}, ()=>{
                    //this.scale();
                });
                setTimeout(()=>{
                    if(this.props.hasNext){
                        this.props.onSelectAnswer(this.props.questionKey, this.props.hasNext);
                    }else{
                        this.props.onCheckupComplete();
                    }
                },600);
            }else{
                if(this.props.isFailToCheckup){
                    this.props.onCheckupComplete();
                }
            }
        }else{
            if(this.props.questionKey == "2"){
                showThemeAlert({
                    message: "Please select at least one reason.",
                    leftBtn: "Continue",
                    isLightTheme: this.props.appTheme === Constant.lightTheme
                });

            }else{
                showThemeAlert({
                    message: "Please select at least one option.",
                    leftBtn: "Continue",
                    isLightTheme: this.props.appTheme === Constant.lightTheme
                });
            }

        }
    };

    scale = () => {
        setTimeout(()=>{
            Animated.timing(
                this.scaleValue,
                {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.easeOutBack
                }
            ).start(res=>{

            });
        },500);
        setTimeout(()=>{
            this.scaleValue = new Animated.Value(0);
        },300);
    };

    render() {
        const buttonScale = this.scaleValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.2, 1]
        });

        return (
            <View style={{paddingTop: 5,paddingBottom: 20, alignItems: 'center'}}>
                <Animated.View style={{
                    height:70,
                    width: 70,
                    borderColor:'#d4d5d3',
                    borderWidth:0.5,
                    borderRadius:35,
                    backgroundColor:(this.state.isSelected) ? '#05c3f9' : "#FFF",
                    justifyContent:'center',
                    alignItems: 'center',
                    transform: [{scale: buttonScale}]}}
                               ref="iconImg">
                    {(this.state.isSelected) ?
                        <Image source={(this.props.hasNext) && nextIcons.nextWhite || nextIcons.doneWhite}
                               style={{height:16, width: 20}}/>
                        :
                        <Image source={(this.props.hasNext) &&  nextIcons.nextGray || nextIcons.doneGray}
                               style={{height:16, width: 20}}/>
                    }
                    <TouchableHighlight
                        style={{top:0, bottom:0, left: 0, right:0, position: 'absolute'}}
                        onPress={()=>{this.onSelectNext()}}
                        underlayColor={'transparent'}>
                        <View/>
                    </TouchableHighlight>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleText:{
        fontSize: 17,
        fontFamily: Constant.font500,
    }
});