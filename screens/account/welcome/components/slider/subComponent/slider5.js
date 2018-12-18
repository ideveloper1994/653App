import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default  class Slider5 extends React.PureComponent {

    constructor(props){
        super(props);
        this.animValue = new Animated.Value(0);
        this.imageValue = new Animated.ValueXY(0,0);
        this.bubbleFadeValue = new Animated.Value(0);
        this.bubblePostion = new Animated.ValueXY(0,-20);
    }

    componentDidMount() {
        Animated.sequence([
            Animated.timing(
                this.imageValue,
                {
                    //toValue: {x:0,y:-((Constant.fullScreenHeight*0.26)*0.2)},
                    toValue: {x:0,y:-14},
                    duration: 100,
                    delay:150
                }
            ),
            Animated.timing(
                this.imageValue,
                {
                    toValue: {x:0,y:0},
                    duration: 100,
                }),
            Animated.parallel([
                Animated.timing(
                    this.bubblePostion,
                    {
                        toValue: {x:0,y:10},
                        duration: 300,
                        //delay:550
                    }
                ),
                Animated.timing(
                    this.bubbleFadeValue,
                    {
                        toValue: 1,
                        duration: 200,
                        // delay:550
                    })])
        ]).start();
    }

    render() {
        return (
            <Animated.View style={[styles.container,this.props.transitionAnimation(this.props.index)]}>
                <View style={{height:'78%', width:'100%',alignItems:'center',backgroundColor:'transparent',
                    paddingTop: Constant.fullScreenHeight*0.26, position:'absolute'}}>
                    <View style={{alignItems:'center', width:"100%"}}>
                        <Animated.View style={[{width: 38,height:38},this.imageValue.getLayout()]}>
                            <Animated.Image source={{uri:'intro_slider_ai_icon'}}
                                            style={{width: null,height:null,flex:1}}/>
                        </Animated.View>

                        <Animated.Image source={{uri:'speech_arrow'}}
                                        resizeMode={"contain"}
                                        style={[{width: 16,height: 7.5, opacity: this.bubbleFadeValue}, this.bubblePostion.getLayout()]}/>

                        <Animated.View style={[{
                            opacity: this.bubbleFadeValue,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            width: "60%",
                            padding:15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius:10}, this.bubblePostion.getLayout()]}>
                            <Text style={{color:'#FFF',fontSize:15,textAlign:'center',fontFamily: Constant.font700}}>
                                {"Stay alert today! You are 47% more likely to relapse on a Sunday."}
                            </Text>
                        </Animated.View>
                    </View>
                </View>
                <View style={{top:Constant.fullScreenHeight*0.78,left:0,bottom:0, backgroundColor: 'transparent', alignItems:'center', position:'absolute'}}/>
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