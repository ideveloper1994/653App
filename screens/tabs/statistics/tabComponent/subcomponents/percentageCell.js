import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant'

export default  class SubCellComponent extends React.PureComponent {

    render() {
        return (
            <View style={ styles.container }>
                <View style={[{backgroundColor:this.props.progressbarColor,height:100}, styles.barView]}/>
                <Text style={ styles.bottomText }>
                    { this.props.title }
                </Text>
                <Text>{ this.props.perHeight }</Text>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    bottomText: {
        color: 'rgb(153,186,196)',
        fontSize: 12,
        alignSelf:'center',
        fontFamily: Constant.font700,
    },
    container:{
        margin:10,
        justifyContent:'flex-end'
    },
    barView:{
        borderRadius:50,
        padding:5,
        alignSelf:'center',
    }
});