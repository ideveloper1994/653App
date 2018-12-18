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

export default  class Slider6 extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            showBottom: false,
            showList: false,
            opacity:0
        };
        this.animatedValue = new Animated.ValueXY(0,0);
    }

    componentDidMount() {
        setTimeout(()=>{
            this.cycleAnimation();
        },0);
    }

    cycleAnimation() {
        this.animatedValue.setValue({x:0,y:0});
        Animated.timing(this.animatedValue, {
            toValue: {x:-(1822-Constant.screenWidth),y:0},
            duration: 50000,
            easing: Easing.linear
        },{useNativeDriver: true}).start(() => {
            setTimeout(() => {
                this.cycleAnimation();
            },0)
        });
    }
    
    render() {
        if(Constant.isIOS)
            return (
                <Animated.View style={[styles.container,this.props.transitionAnimation(this.props.index)]}>
                    <Animated.View style={[{width:"100%",height:Constant.screenHeight*0.78, backgroundColor: 'transparent',
                        paddingTop: Constant.screenHeight*0.18,
                        marginLeft:this.animatedValue.x}]}>
                        <Image source={{uri:this.props.topImage}}
                               resizeMode={"contain"}
                               style={{width:1822, height:330,backgroundColor: '#01536d'}}/>
                    </Animated.View>
                    <View style={{top:Constant.screenHeight*0.78,width:'80%',bottom:0,
                        backgroundColor: 'transparent',alignItems:'center', position:'absolute'}}>
                    </View>
                </Animated.View>
            );
        return (
            <Animated.View style={[styles.container,{opacity: this.props.viewOpacity}]}>
                <View style={{width:'100%',height:Constant.fullScreenHeight*0.78, backgroundColor: 'transparent',
                    paddingTop: Constant.fullScreenHeight*0.16}}>
                    <Animated.View style={[{width:1822, height:330, backgroundColor: 'transparent', marginLeft:this.animatedValue.x}]}>
                        <Image source={{uri:this.props.topImage}}
                               resizeMode={"contain"}
                               style={{width:1822, height:330,backgroundColor: 'transparent'}}/>
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
        backgroundColor: 'transparent'
    }
});