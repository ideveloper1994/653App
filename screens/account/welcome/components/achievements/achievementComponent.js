import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class AchievementComponent extends React.PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <View style={{height:54,width:54}}>
                    <Image style={{height:54,width:54}} source={this.props.image} resizeMode={"contain"}/>
                </View>
                <View style={{flex:1,paddingLeft:10}}>
                    <Text style={styles.titleText}>
                        {this.props.title}
                    </Text>
                </View>
                <View style={{height:16,width:14}}>
                    <Image style={{height:16,width:14}}
                           source={{uri:'lock'}}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        height:84,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
        flexDirection:'row',
        paddingRight:17,
        paddingLeft:17,
        alignItems:'center'
    },
    titleText:{
        color:'#4e4e4e',
        fontSize:16,
        textAlign:'left',
        fontFamily: Constant.font500
    }
});