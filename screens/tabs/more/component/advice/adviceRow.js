import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
} from 'react-native';
import Constant from '../../../../../helper/constant'
import AdviceBanner from './adviceBanner';

export default class SavedAdviceRow extends React.PureComponent {

    render() {
        const { rowContainer, textDetail, bottomRow, textName } = styles;
        return (
            <View>
                {
                    (this.props.index == 0) ?
                        <AdviceBanner title="Advice you like in the Brainbuddy community will be saved here."/>
                        :
                        null
                }
                <View style={rowContainer}>
                    <Text style={textDetail}>{this.props.text}</Text>
                    <View style={bottomRow}>
                        <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'flex-start', alignItems: 'center'}}>
                            <View style={{height:25,width:25,marginRight:10}}>
                                <Image style={{height:25,width:25,alignSelf:'center'}}
                                       source={{uri:this.props.avtarImage}}/>
                            </View>
                            <Text style={textName}>
                                {this.props.avtarName}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        padding: 15,
        paddingBottom:0
    },
    textDetail: {
        color: '#4e4e4e',
        fontSize: 15,
        margin:5,
        fontFamily: Constant.font500,
        lineHeight: 23,
    },
    bottomRow: {
        flexDirection:'row',
        alignItems: 'center',
    },
    textName: {
        color: '#898c8f',
        fontSize: 15,
        fontFamily: Constant.font500,
        marginLeft:5,
        marginRight:8,
    },
});