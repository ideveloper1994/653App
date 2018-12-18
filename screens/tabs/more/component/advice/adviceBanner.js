import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant'

export default class AdviceBanner extends React.PureComponent {

    render() {
        const { rowContainer, textDetail} = styles;
        return (
            <View style={rowContainer}>
                <Text style={textDetail}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        padding: 15,
        paddingBottom:24,
        paddingTop:24,
        backgroundColor: 'rgb(255,189,82)',
        marginBottom:10,
    },
    textDetail: {
        color: '#fff',
        fontSize: 15,
        fontFamily: Constant.font500,
        lineHeight: 20,
        textAlign: 'center'
    },
});