import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class BottomSpeedControl extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    onSpeedPress = () => {
        this.props.setValues(this.props.speed);
        if(this.props.speedNo > this.props.breathingTempoNo)
        {
            this.refs.view.fadeInLeft(100);
        }else{
            this.refs.view.fadeInRight(100);
        }
    };

    render() {
        return(
            <Animatable.View ref="view" easing="ease-in-back" style={{flex:1,alignSelf:'center'}}>
                <TouchableHighlight onPress={() => this.onSpeedPress()}
                                    underlayColor={Constant.transparent}
                                    style={[styles.touchbutton,
                                    {backgroundColor:this.props.speed == this.props.breathingTempo?Constant.lightBlueColor:Constant.transparent,}]}>
                    <Text style={styles.bottomText}>{this.props.speed}</Text>
                </TouchableHighlight>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    bottomText:{
        textAlign: 'center',
        color: '#FFF',
        fontSize: 12,
        fontFamily: Constant.font500,
    },
    touchbutton:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        height:30
    }

});