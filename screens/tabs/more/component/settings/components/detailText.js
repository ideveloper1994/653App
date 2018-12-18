import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default  class DetailText extends React.PureComponent {

    constructor(props){
        super(props);
    }

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <View style={mainView}>
                <Text style={rowTitle}>
                    {this.props.detailText}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        padding:20,
        flex:1
    },
    rowTitle:{
        fontSize: 15,
        color: 'rgb(75,75,75)',
        fontFamily: Constant.font500,
    }
});