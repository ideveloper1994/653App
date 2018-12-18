import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../helper/constant';

export default class smallButtonComponent extends React.PureComponent {

    render() {
        return (
            <TouchableOpacity onPress={()=>this.props.onPress()}
                                style={[styles.btnLogin,{backgroundColor: this.props.backColor},
                                 (this.props.otherStyle) ? this.props.otherStyle: {}]}>
                <View>
                    <Text style={[styles.btnFont, {color: this.props.color}]}>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btnLogin:{
        alignSelf: 'center',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnFont:{
        fontSize: 15,
        fontFamily: Constant.font700,
    }
});