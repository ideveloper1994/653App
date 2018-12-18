import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default  class TopCircleComponent extends React.PureComponent {

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
                    toValue: {x:0,y:-((Constant.screenHeight*0.26)*0.2)},
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
            Animated.timing(
                this.bubbleFadeValue,
                {
                    toValue: 1,
                    duration: 100,
                    delay:100
                })
        ]).start();
    }

    render() {
        return (
            <View style={{alignItems:'center', width:"100%"}}>
                <Animated.View style={[{width: 38,height:38},this.imageValue.getLayout()]}>
                    <Animated.Image
                        source={(this.props.orangeLogo) && {uri:'intro_slider_ai_icon_orange'} ||
                        {uri:'intro_slider_ai_icon'}}
                        style={{width: null,height:null,flex:1}}/>
                </Animated.View>
                <Animated.View style={{
                    opacity: this.bubbleFadeValue,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    width: "65%",
                    padding:15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius:10,
                    marginTop:10}}>
                    <Text style={{color:'#FFF',fontSize:15,textAlign:'center',fontFamily: Constant.font700}}>
                        {this.props.bubbleText}
                    </Text>
                </Animated.View>
            </View>
        );
    }
}