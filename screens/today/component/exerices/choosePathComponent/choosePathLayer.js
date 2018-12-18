import React, { Component } from 'react';
import {
    Image,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

//"rgba(71,226,105,0.5)"   good
//"rgba(255,97,80,0.5)" bad

export default  class ChoosePathLayer extends React.PureComponent {

    render() {
        return(
            <View style={{position:'absolute',top:0,bottom:0,left:0,right:0}}>
                <Animatable.View animation="fadeIn"
                                 style={{backgroundColor:(this.props.isGood) ? "rgba(71,226,105,0.5)" : "rgba(255,97,80,0.5)",
                                     position:'absolute',top:0,bottom:0,left:0,right:0}}/>
                <Animatable.View animation="slideInUp"
                                 duration={400}
                                 style={{position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'}}>
                    <Image source={(this.props.isGood) ? {uri:'icon_exercise_tick'} : {uri:'icon_exercise_cross'}}
                           style={{height:Constant.screenWidth/4,width:Constant.screenWidth/4,}}
                    />
                </Animatable.View>
            </View>
        );
    }
}