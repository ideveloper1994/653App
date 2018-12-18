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

export default  class SliderImage extends React.PureComponent {

    constructor(props){
        super(props);
    }

    // componentDidMount(){
    //     if(this.refs.slideImage) {
    //         this.refs.slideImage.fadeIn(500);
    //     }
    // }
    //
    // componentWillReceiveProps(nextProps){
    //     if(this.refs.slideImage){
    //         this.refs.slideImage.fadeIn(500);
    //     }
    // }

    render() {
        return (
            <Animated.View style={[{marginTop:Constant.fullScreenHeight/10,width:'100%',height:'40%'}]}>
                <Animated.Image source={{uri:this.props.image}}
                                  defaultSource={this.props.image}
                                  useNativeDriver={true}
                                  resizeMode={'contain'}
                                  style={[{flex:1,height:null,width:null},this.props.transitionAnimation(this.props.index)]}
                                  ref='slideImage'/>
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