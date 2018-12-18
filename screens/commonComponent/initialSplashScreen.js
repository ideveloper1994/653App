import React, { Component } from 'react';
import {
    ActivityIndicator,
    View, Image, StatusBar, StyleSheet
}from 'react-native';
import Constant from '../../helper/constant';
import AppStatusBar from './statusBar';

export default class InitialScreen extends React.PureComponent{

    render(){
        return(
            <View style={styles.container}>
                <AppStatusBar backColor={Constant.backProgressBarColor}
                              hidden={false}/>
                <Image source={{uri:'splash_icon'}}
                       resizeMode='center'
                       style={Constant.isIOS &&{height:100, width:100} || {height:150, width:150}}/>
                <View style={{backgroundColor:'transparent', position:'absolute',
                    top: Constant.screenHeight*0.92}}>
                    <ActivityIndicator
                        animating={true}
                        size="small"
                        color={"#FFF"}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
});