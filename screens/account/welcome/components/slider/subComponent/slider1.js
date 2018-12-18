import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TopCircleComponent from './topAnimatedComponent1';

export default  class Slider1 extends React.PureComponent {

    getGreetingMessage = () => {
        let myDate = new Date();
        let hrs = myDate.getHours();
        if (hrs < 12)
            return "Good Morning " + this.props.userName;
        else if (hrs >= 12 && hrs <= 17)
            return "Good Afternoon " + this.props.userName;
        else if (hrs >= 17 && hrs <= 24)
            return "Good Evening " + this.props.userName;
    };

    render() {
        return (
            <Animated.View style={[styles.container,this.props.transitionAnimation(this.props.index)]}>
                <View style={{height:'78%', width:'100%',alignItems:'center',
                    backgroundColor:'transparent', paddingTop: Constant.fullScreenHeight*0.26}}>
                    <TopCircleComponent bubbleText={this.getGreetingMessage()} topImage={this.props.topImage}/>
                </View>
                <View style={{top:Constant.fullScreenHeight*0.78,left:0,bottom:0,
                    backgroundColor: 'transparent', alignItems:'center', position:'absolute'}}/>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight,
        alignItems:'center',
        backgroundColor: 'transparent'
    }
});