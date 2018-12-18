import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class Stories extends React.PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.content}>
                    {this.props.content}
                    </Text>
                <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center',paddingTop:10,}}>
                    <View style={{height:20,width:20,}}>
                    <Image style={{height:15,width:15, marginTop:3}}
                           source={{uri:'user_avatar'}}/>
                    </View>
                <Text style={styles.name}>{this.props.name}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    content:{
        fontSize:14,
        fontFamily: Constant.font500,
        color:'#4e4e4e',
        paddingLeft:25,
        paddingRight:25,
        paddingTop:25,
        textAlign:'center',
        lineHeight: 20
    },
    name:{
        marginLeft:5,
        fontSize:14,
        fontFamily: Constant.font500,
        color:'#fbb043'
    }
});