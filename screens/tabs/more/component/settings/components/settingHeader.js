import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default  class SectionHeader extends React.PureComponent {

    render() {
        return (
            <View style={[styles.mainView, this.props.viewStyle || {}]}>
                <Text style={[styles.titleText, this.props.textStyle || {}]}>
                    {this.props.headerTitle}
                </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        backgroundColor: Constant.settingHeaderColor,
        justifyContent: 'center',
        // height: 55,
        paddingTop: 26,
        paddingBottom: 10,
        paddingLeft: 20,
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
    },
    titleText:{
        fontSize: 12,
        color: '#a4b6bf',
        fontFamily: Constant.font500,
    }
});