import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class TitleText extends React.PureComponent {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        // if(this.refs.slideImage) {
        //     this.refs.slideImage.fadeIn(500);
        // }
    }

    render() {
        return (
            <Animated.View style={[{marginTop: Constant.screenHeight/10,width:'82%',height:'40%',justifyContent:'center',
                alignItems:'center', backgroundColor:"transparent",alignSelf:"center"}, this.props.transitionAnimation(this.props.index)]}>
                <Animatable.Text style={{color:'white',fontSize:26,textAlign:'center', fontFamily: Constant.font300, alignSelf:"center"}}
                                 ref='slideImage'>
                    {this.props.title || ""}
                </Animatable.Text>
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