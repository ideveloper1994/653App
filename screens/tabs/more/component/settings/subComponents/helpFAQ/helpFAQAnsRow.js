import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Constant from '../../../../../../../helper/constant';

export default  class HelpRowAnsComponent extends React.PureComponent {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <View style={mainView}>
                <Text style={rowTitle}>
                    {this.props.txtDetail}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        backgroundColor: '#efeff4',
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        paddingBottom: 30
    },
    rowTitle:{
        fontSize: 14,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        flex:1,
        lineHeight: 18
    }
});