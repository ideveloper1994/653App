import React, { Component } from 'react';
import {
    Animated,
    StyleSheet,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class updateProfileProgress extends React.PureComponent {

    constructor(props){
        super(props);
        this._width = new Animated.Value(10);
        this.interval = null;
    }

    componentDidMount = () => {
        if(this.refs.progressBar){
            // this.refs.progressBar.fadeIn(1000);
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setWidth(nextProps.questionNo)
    }

    setWidth = (questionNo) => {
        let width = Constant.screenWidth*0.65;
        let per = questionNo*width/this.props.totalQuestion;
        Animated.timing(this._width, {
            toValue: per,
            duration:300
        }).start();
    }

    render() {
        return (
            <Animatable.View style={[{ backgroundColor: this.props.otherColor},styles.mainView]} ref="progressBar"
                             delay={200}
            animation="fadeIn" duration={300}>
                <Animated.View style={[{ width: this._width, backgroundColor: this.props.fillBarColor }, styles.fillBar]}/>
                <View style={[{backgroundColor: this.props.otherColor }, styles.otherBar]}/>
            </Animatable.View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        alignSelf:'center',
        flexDirection: 'row',
        borderRadius: 5,
        marginTop: 0,
        marginBottom: 0,
        overflow:'hidden',
        width:"65%",
        height:10,
    },
    fillBar:{
        minWidth: 10,
        borderRadius: 5,
        //padding:5.5
    },
    otherBar:{
        borderRadius: 5
    }
});