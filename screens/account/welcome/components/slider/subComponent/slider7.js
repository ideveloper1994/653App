import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import RowComponent from './slider6RowComponent';

export default  class Slider7 extends React.PureComponent {

    render() {
        return (
            <Animated.View style={[styles.container,this.props.transitionAnimation(this.props.index)]}>
                <View style={{width:"78%",height:Constant.fullScreenHeight*0.78, backgroundColor: 'transparent',
                    paddingTop: Constant.fullScreenHeight*0.21}}>
                    <RowComponent rowData={{name:"You", team: "Master", count: "1", avatarId: 1, per:100}} width={Constant.screenWidth*0.78}/>
                    <RowComponent rowData={{name:"Tom", team: "Pro", count: "2", avatarId: 7, per:60}} width={Constant.screenWidth*0.78}/>
                    <RowComponent rowData={{name:"Stephen", team: "Novice", count: "3", avatarId: 15, per:40}} width={Constant.screenWidth*0.78}/>
                    <RowComponent rowData={{name:"Cart", team: "Beginner", count: "4", avatarId: 28, per:25}} width={Constant.screenWidth*0.78}/>
                </View>
                <View style={{top:Constant.fullScreenHeight*0.78,width:'80%',bottom:0, backgroundColor: 'transparent',
                    alignItems:'center', position:'absolute'}}>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight,
        alignItems:'center',
        backgroundColor: 'transparent'
    }
});
