import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class GetStartedRow extends React.PureComponent {

    render() {
        const {container, titleText, detailText, borderView} = styles;
        return (
            <View style={[container,this.props.index == 0 && {height:380}]}>
                <Text style={titleText}>
                    {this.props.title}
                </Text>
                <Image style={this.props.imgStyle}
                       source={this.props.image}/>
                <Text style={detailText}>
                    {this.props.description}
                </Text>
                <View style={borderView}/>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container:{
        paddingTop: 30,
        justifyContent:'center',
        alignItems:'center',
    },
    titleText:{
        width:'80%',
        fontSize:16,
        fontFamily: Constant.font700,
        color:'#FFF',
        alignSelf: 'center',
        textAlign: 'center'
    },
    detailText:{
        width:'80%',
        paddingTop: 30,
        fontSize:15,
        fontFamily: Constant.font500,
        color:'#fef2ec',
        alignSelf: 'center',
        textAlign: 'center'
    },
    borderView:{
        marginTop:35,
        width:'90%',
        height: 1,
        backgroundColor: '#ee9513'
    }
});