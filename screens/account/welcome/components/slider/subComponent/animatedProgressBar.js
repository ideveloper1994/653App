import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default  class ProgressBar extends React.PureComponent {

    constructor(props){
        super(props);
        this._width = new Animated.Value(4);
    }

    componentDidMount() {
        Animated.timing(this._width, {
            toValue: this.props.barWidth*this.props.progressVal/100,
            duration:500,
            delay: 50
        },{useNativeDriver: true}).start();
    }

    render() {
        return (
            <View style={[styles.mainView]}>
                <Animated.View style={[{ width: this._width}, styles.fillBar]}/>
                <View style={[styles.otherBar]}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        flexDirection: 'row',
        borderRadius: 5,
        marginTop: 0,
        marginBottom: 0,
        width: '100%',
        overflow:'hidden',
        height:10,
        backgroundColor:"#026485",
    },
    fillBar:{
        borderRadius: 5,
        padding:5,
        backgroundColor:Constant.greenColor
    },
    otherBar:{
        borderRadius: 5,
        backgroundColor:"#026485",
        flex:1
    }
});