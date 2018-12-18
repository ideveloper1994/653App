import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class EscapePopUp extends React.PureComponent {

    render() {
        const {mainView, titleText, btn1Outer, btn2Outer, txt1, txt2} = styles;
        return(
            <View style={mainView}>
                <Text style={titleText}>
                    Would you like to continue?</Text>
                <TouchableHighlight onPress={()=>{this.props.onContinue()}}
                                    underlayColor='transparent'
                                    style={btn1Outer}>
                    <Text style={txt1}>Continue</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={()=>{this.props.onFinish()}}
                                    underlayColor='transparent'
                                    style={btn2Outer}>
                    <Text style={txt2}>Finish</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor:'white',
        borderRadius:10,
        padding:20,
        paddingLeft: 45,
        paddingRight: 45,
    },
    titleText: {
        margin:5,
        fontFamily:Constant.font500,
        textAlign:'center',
        fontSize:15,
        marginBottom:20
    },
    btn1Outer: {
        padding:20,
        margin:5,
        marginLeft:10,
        marginRight:10,
        borderRadius:50,
        backgroundColor: 'rgb(255,180,0)'
    },
    btn2Outer: {
        padding:20,
        margin:5,
        marginLeft:10,
        marginRight:10,
        borderRadius:50,
        backgroundColor:Constant.backColor
    },
    txt1: {
        color:'white',
        fontFamily:Constant.font700,
        textAlign:'center',
        fontSize:15,
    },
    txt2: {
        color:'white',
        fontFamily:Constant.font700,
        textAlign:'center',
        fontSize:15,
    },
});