import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class TopCircleComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.animValue = new Animated.Value(1);
        this.imageValue = new Animated.Value(52);
        this.bubbleFadeValue = new Animated.Value(0);
        this.bubblePostion = new Animated.ValueXY(0,-40);
    }

    componentDidMount() {
        // Animated.sequence([
        //     Animated.parallel([
        //         Animated.timing(
        //             this.animValue,
        //             {
        //                 toValue: 1,
        //                 duration: 1000,
        //             }
        //         ),
        //         Animated.timing(
        //             this.imageValue,
        //             {
        //                 toValue: 52,
        //                 duration: 1000,
        //             }
        //         )]),
        //     Animated.timing(
        //         this.imageValue,
        //         {
        //             toValue: 38,
        //             duration: 150,
        //         }),
        //     Animated.parallel([
        //         Animated.timing(
        //             this.bubblePostion,
        //             {
        //                 toValue: {x:0,y:18},
        //                 duration: 300,
        //                 //delay:550
        //             }
        //         ),
        //         Animated.timing(
        //             this.bubbleFadeValue,
        //             {
        //                 toValue: 1,
        //                 duration: 200,
        //                 // delay:550
        //             })])
        // ]).start();
    }

    makeAnimation = () => {
        Animated.sequence([
            // Animated.parallel([
            //     Animated.timing(
            //         this.animValue,
            //         {
            //             toValue: 1,
            //             duration: 1000,
            //         }
            //     ),
            //     Animated.timing(
            //         this.imageValue,
            //         {
            //             toValue: 52,
            //             duration: 1000,
            //         }
            //     )]),
            Animated.timing(
                this.imageValue,
                {
                    toValue: 38,
                    duration: 150,
                }),
            Animated.parallel([
                Animated.timing(
                    this.bubblePostion,
                    {
                        toValue: {x:0,y:5},
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
    };

    render() {
        return (
            <View style={{alignItems:'center', width:"100%"}}>
                <Animatable.View style={{width: 52,height:52, alignItems:'center', justifyContent:'center', backgroundColor:'transparent'}}
                                 delay={300}
                                 duration={300}
                                 animation={"fadeIn"}>
                    <Animated.View style={{width: this.imageValue,height:this.imageValue,backgroundColor:'transparent'}}>
                        <Animatable.Image source={{uri:this.props.topImage}}
                                          delay={300}
                                          duration={300}
                                          animation={"zoomIn"}
                                          onAnimationEnd={this.makeAnimation}
                                          style={{width: null,height:null,flex:1,opacity: this.animValue}}/>
                    </Animated.View>
                </Animatable.View>

                <Animated.Image source={{uri:'speech_arrow'}}
                                resizeMode={"contain"}
                                style={[{width: 16,height: 7.5,marginTop:0, paddingTop:0, opacity: this.bubbleFadeValue},this.bubblePostion.getLayout()]}/>

                <Animated.View style={[{
                    opacity: this.bubbleFadeValue,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    width: "60%",
                    padding:15,
                    marginTop: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius:10},this.bubblePostion.getLayout()]}>
                    <Text style={{color:'#FFF',fontSize:15,textAlign:'center',fontFamily: Constant.font700}}>
                        {this.props.bubbleText}
                    </Text>
                </Animated.View>
            </View>
        );
    }
}