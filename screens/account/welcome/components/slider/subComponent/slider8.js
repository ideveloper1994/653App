import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Easing
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class Slider8 extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            showImage: false,
            image1: true
        };
        this.animatedValue = new Animated.ValueXY(0,0)
    }

    componentDidMount() {
        this.cycleAnimation();

        this.setState({
            showImage:true
        },() => {
            this.refs.communityImage.zoomIn(500)
        });
    }

    cycleAnimation() {
        this.animatedValue.setValue({x:0,y:-((Constant.screenWidth*10.67)-Constant.fullScreenHeight)});
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

    render() {
        return (
            <Animated.View style={[styles.container,this.props.transitionAnimation(this.props.index)]}>
                <View style={{position:'absolute',width:'100%',height:Constant.screenHeight}}>
                    <Animated.View style={{width:Constant.screenWidth, height:Constant.screenWidth*10.67, marginTop:this.animatedValue.y}}>
                        <Image source={{uri:this.props.sliderConfetti}}
                               resizeMode={"contain"}
                               style={{width:Constant.screenWidth, height:Constant.screenWidth*10.67, opacity:0.3}}/>
                    </Animated.View>
                </View>
                <View style={{paddingTop: Constant.screenHeight*0.22}}>
                    {(this.state.showImage) &&
                        <Animatable.Image ref='communityImage'
                                          easing="ease-out-back"
                                          source={{uri:this.props.topImage}}
                                          style={{width: 222,height:222}}
                                          resizeMode={'contain'}/>
                        ||
                        <View/>
                    }
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:Constant.screenWidth,
        height:Constant.screenHeight,
        alignItems:'center',
        backgroundColor: 'transparent'
    }
});