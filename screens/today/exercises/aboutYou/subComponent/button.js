import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default class Button extends React.PureComponent {

    constructor(props){
        super(props)
        this.state={
            selectedBtn: {}
        }
    }

    onButtonPress = () => {
        this.setState({
            selectedBtn: {backgroundColor: "#2D8FCF", borderColor:'#2D8FCF'}
        },()=>{
            setTimeout(()=>{
                this.props.onPress(this.props.rowData)
            },500)
        });
    }

    render() {
        return (
            <TouchableHighlight onPress={()=>this.onButtonPress()}
                                underlayColor={'#2D8FCF'}
                                style={[styles.btnOuter,this.state.selectedBtn]}>
                <View>
                    <Text style={[styles.btnFont]}>
                        {this.props.rowData.answerStr}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    btnOuter:{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        height:50,width:'60%',
        marginBottom:10,
        backgroundColor: "#74bfef",
        borderColor:'#d4d5d3',
        borderWidth:0.5,
    },
    btnFont:{
        fontSize: 15,
        fontFamily: Constant.font700,
        color:'#FFF'
    }
});