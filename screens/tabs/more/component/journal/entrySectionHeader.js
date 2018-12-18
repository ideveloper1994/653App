import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class SectionHeader extends React.PureComponent {

    render() {
        return (
            <View style={styles.mainView}>
                <Text style={styles.titleText}> { this.props.sectionTitle.toUpperCase() } </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        backgroundColor: Constant.grayBackground,
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 10
    },
    titleText:{
        fontSize: 15,
        color: '#a4b6bf',
        padding:10,
        fontFamily: Constant.font500,

    }
});