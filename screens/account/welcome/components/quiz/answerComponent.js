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
import Constant from '../../../../../helper/constant';

export default  class AnswerComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            isSelected:false
        };
        this.scaleValue = new Animated.Value(0);
    }

    onSelectAnswer = () => {
        if(Constant.isIOS){
            // setTimeout(()=>{
                if(!this.state.isSelected) {
                    this.setState({isSelected:true}, ()=>{
                        this.scale();
                    });
                    setTimeout(()=>{
                        this.props.onSelectAnswer(this.props.questionNo, this.props.val, this.props.answerObj);
                    },250);
                }
            // },100);
        }else{
            if(!this.state.isSelected) {
                this.setState({isSelected:true}, ()=>{
                    this.scale();
                });
                setTimeout(()=>{
                    this.props.onSelectAnswer(this.props.questionNo, this.props.val, this.props.answerObj);
                },250);
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
    };

    render() {

        const buttonScale = this.scaleValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.2, 1]
        });

        return (
            <View style={{paddingBottom: 8}}>
                <View style={{
                    flexDirection:'row',
                    borderColor:'#d4d5d3',
                    borderWidth:0.5,
                    borderRadius:13,
                    backgroundColor:(this.state.isSelected) ? '#05c3f9' : "#FFF",
                    height: 70,
                    alignItems: 'center',
                    paddingLeft:20,
                    paddingRight:20,
                }}>
                    <View>
                        {(this.state.isSelected) ?
                            <Animated.Image source={{uri:'icon_quiz_tick'}}
                                            style={[{height:30, width: 30, transform: [{scale: buttonScale}]}]} ref="iconImg"/>
                            :
                            <View style={{
                                backgroundColor:"#fbb043",
                                height:30,
                                width:30,
                                justifyContent:'center',
                                alignItems:'center',
                                borderRadius:8}}>
                                <Text style={{color:'white', fontFamily: Constant.font700, fontSize: 15}}>
                                    {this.props.backNum}
                                </Text>
                            </View>
                        }
                    </View>

                    <View style={{flex:1,justifyContent:'center', paddingLeft:16}}>
                        <Text style={[styles.titleText,{color:(this.state.isSelected)?'rgb(256,256,256)':'#4e4e4e'}]}>
                            {this.props.backName}</Text>
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