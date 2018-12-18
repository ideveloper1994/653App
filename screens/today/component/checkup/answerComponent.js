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

let answerIcons = {
    Green: {uri:'icon_quiz_tick'},
    Red: {uri:'icon_quiz_tick_red'},
    Orange: {uri:'icon_quiz_tick_orange'},
    AddNew: {uri:'checkup_icon_plus'},
};

export default  class AnswerComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            isSelected:  false
        };
        this.scaleValue = new Animated.Value(0);
    }

    onSelectAnswer = () => {
        if(this.props.answerObj.isAddNew){
            this.props.onAddNewPress(this.props.questionKey, this.props.answerObj);
        }else{
            if(Constant.isIOS) {
                setTimeout(()=> {
                    if(this.props.isSelected) {
                        this.setState({isSelected:true}, ()=>{
                            this.scale();
                        });
                        if(!this.props.isMultipleSelection){
                            setTimeout(()=>{
                                this.props.onSelectAnswer(this.props.questionKey, this.props.answerObj.nexQuestion != 0);
                            },250);
                        }
                    }else {
                        this.setState({
                            isSelected: false
                        });
                    }
                },0);
                this.props.setNextQuestion(this.props.questionKey, this.props.answerObj);
            }else {
                setTimeout(() => {
                    if (this.props.isSelected) {
                        this.setState({isSelected: true}, () => {
                            this.scale();
                        });
                        if (!this.props.isMultipleSelection) {
                            setTimeout(() => {
                                this.props.onSelectAnswer(this.props.questionKey, this.props.answerObj.nexQuestion != 0);
                            }, 300);
                        }
                    } else {
                        this.setState({
                            isSelected: false
                        });
                    }
                }, 0);
                this.props.setNextQuestion(this.props.questionKey, this.props.answerObj);
            }
        }
    };

    scale = () => {
        Animated.timing(
            this.scaleValue,
            {
                toValue: 1,
                duration: 300,
                easing: Easing.easeOutBack
            }
        ).start();
        setTimeout(()=>{
            this.scaleValue = new Animated.Value(0);
        },300);
    };

    render() {
        const buttonScale = this.scaleValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.2, 1]
        });
        const {icon, isAddNew, str } = this.props.answerObj;
        return (
            <View style={{paddingBottom: 8}}>
                <View style={{
                    flexDirection:'row',
                    borderColor:'#d4d5d3',
                    borderWidth:0.5,
                    borderRadius:13,
                    backgroundColor:(this.props.isSelected) ? '#05c3f9' : "#FFF",
                    height: 70,
                    alignItems: 'center',
                    paddingLeft:20,
                    paddingRight:20,
                }}>
                    <View>
                        {(this.props.isSelected) ?
                            <Animated.Image source={(icon == "R") ? answerIcons.Red :
                                (icon == "G") ? answerIcons.Green : answerIcons.Orange}
                                            style={[{height:30, width: 30, transform: [{scale: buttonScale}]}]}
                                            ref="iconImg"/>
                            :
                            <View style={{
                                backgroundColor: (icon == "R") ? "rgb(244,107,70)" :
                                    (icon == "G") ? "rgb(0,245,75)" : "#fbb043",
                                height:30,
                                width:30,
                                justifyContent:'center',
                                alignItems:'center',
                                borderRadius:8}}>
                                {
                                    (isAddNew) &&
                                    <Image source={answerIcons.AddNew}
                                           style={{height: 15, width: 15}}
                                           resizeMode={"contain"}/>
                                    ||
                                    <Text style={{color:'white', fontFamily: Constant.font700, fontSize: 15}}>
                                        {this.props.questionIndex}
                                    </Text>
                                }
                            </View>
                        }
                    </View>

                    <View style={{flex:1,justifyContent:'center', paddingLeft:16}}>
                        <Text style={[styles.titleText,{color:(this.props.isSelected)?'rgb(256,256,256)':'#4e4e4e'}]}>
                            {(this.props.questionKey != "1" && this.props.questionKey != "4" && this.props.questionKey != "6") &&
                            str
                            || (this.props.questionKey == "1" && str == "No") && "No, I relapsed"
                            || (this.props.questionKey == "4" && str == "Yes") && "Yes, I felt tempted"
                            || (this.props.questionKey == "6" && str == "No") && "No, I masturbated"
                            || str
                            }
                        </Text>
                    </View>

                </View>
                <TouchableHighlight
                    style={{top:0, bottom:0, left: 0, right:0, position: 'absolute'}}
                    onPress={()=>{this.onSelectAnswer()}}
                    underlayColor={'transparent'}>
                    <View/>
                </TouchableHighlight>
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