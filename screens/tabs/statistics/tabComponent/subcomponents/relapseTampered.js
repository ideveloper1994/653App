import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    image
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class RelapseTamperedComponent extends React.PureComponent {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={ styles.mainView }>
                <View style={{flexDirection:'row'}}>
                    <View style={[{backgroundColor:Constant.verOrangeColor}, styles.barView]}/>
                    <Text style={[styles.titleText, {color:appColor.verProgressBottomTitle}]}>Relapse</Text>
                </View>
                {
                    (!this.props.isRemoveTempted) &&
                    <View style={{flexDirection:'row'}}>
                        <View style={[{backgroundColor:appColor.verProgressbarOrangeBack}, styles.barView]}/>
                        <Text style={[styles.titleText,{color:appColor.verProgressBottomTitle}]}>Tempted</Text>
                    </View>
                    ||
                    null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:10
    },
    content: {
        textAlign: 'center',
        color: '#FFFFFF',
    },
    titleText:{
        color: 'rgb(153,186,196)',
        fontSize: 12,
        alignSelf:'center',
        fontFamily: Constant.font700,
    },
    barView: {
        margin:10,
        padding:5,
        borderRadius:50
    }
});