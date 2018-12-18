import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default class StreckGoal extends React.PureComponent {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container, {backgroundColor: appColor.scrollableViewBack}]}>
                <Text style={[styles.textStyle, this.props.color || {}]}>{"\ud83c\udf89 "+ this.props.memberName +" achieved a "+ this.props.goalMessage +" \ud83c\udf89"}</Text>
                <Text style={[styles.textStyle,{paddingTop:5},this.props.color || {}]}>{this.props.goalDate}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        paddingBottom:12,
        paddingTop:10
    },
    textStyle:{
        color:"#a9b6be",
        fontSize:12,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
});