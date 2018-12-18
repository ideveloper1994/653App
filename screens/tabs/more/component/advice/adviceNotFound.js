import React, { Component } from 'react';
import { StyleSheet,
    Text,
    View,
    Image} from 'react-native';
import Constant from '../../../../../helper/constant';

export default class NoAdviceData extends React.PureComponent {

    render() {
        const { outerView, textMessage, icon } = styles;
        return (
            <View style={outerView}>
                <Image source={{uri:'icon_heart_placeholder'}}
                       style={icon} resizeMode={"contain"}/>
                <Text style={textMessage}>
                    {'Advice you like in the Brainbuddy \n community will appear here.'}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView: {
        alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
        paddingTop: 205
    },
    icon:{
        width:25,
        height:22,
        marginBottom: 5,
    },
    textMessage: {
        fontSize: 14,
        fontFamily: Constant.font500,
        color: '#4e4e4e',
        lineHeight:22,
        alignSelf: 'center',
        textAlign: 'center'
    }
});