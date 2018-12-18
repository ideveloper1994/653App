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

export default  class Slider3 extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            showBottom: false,
            showList: false,
            opacity:0
        };
        this.animatedValue = new Animated.ValueXY(0,0);
    }

    componentWillMount() {
        // Animated.timing(this.animatedValue, {
        //     toValue: {x:0, y:0}, duration:0
        // }).start();
    }

    componentDidMount() {
        // Animated.loop(
        //     Animated.sequence([
        //         Animated.timing(this.animatedValue, {
        //             toValue: {x:-((316*4.4)-Constant.screenWidth), y:0},
        //             delay:500,
        //             duration: 50000,
        //             easing: Easing.linear
        //         }, {useNativeDriver: true} ),
        //         Animated.timing(this.animatedValue, {
        //             toValue: {x:0, y:0}, duration: 0,
        //         }, {useNativeDriver: true})
        //     ])
        // ).start();
        setTimeout(()=>{
            this.cycleAnimation();
        },0);
    }

    cycleAnimation() {
        this.animatedValue.setValue({x:0,y:0});
        Animated.timing(this.animatedValue, {
            toValue: {x:-((316*4.4)-Constant.screenWidth),y:0},
            duration: 40000,
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
                <View style={{width:'100%',height:Constant.fullScreenHeight*0.78, backgroundColor: 'transparent',
                    paddingTop: Constant.fullScreenHeight*0.16}}>
                    <Animated.View style={[{width:316*4.4, height:316, backgroundColor: 'transparent', marginLeft:this.animatedValue.x}]}>
                        <Image source={{uri:this.props.topImage}}
                               resizeMode={"contain"}
                               style={{width:316*4.4, height:316,backgroundColor: 'transparent'}}/>
                    </Animated.View>
                </View>
                <View style={{top:Constant.fullScreenHeight*0.78,width:'80%',bottom:0, backgroundColor: 'transparent',
                    alignItems:'center', position:'absolute'}}>
                </View>
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

//https://i.diawi.com/S2CMoP