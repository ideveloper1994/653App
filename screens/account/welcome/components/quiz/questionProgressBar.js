import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
} from 'react-native';
import Constant from '../../../../../helper/constant';
let progress = 10;
let isWait = 0;

export default  class QuestionProgress extends React.PureComponent {

    constructor(props){
        super(props);
        this._width = new Animated.Value(5);
        this.interval = null;
    }

    componentDidMount() {
        let interval = setInterval(()=>{
            if(progress < Constant.screenWidth/1.8-10){
                Animated.timing(this._width, {
                    toValue: progress+10,
                    duration:300
                }).start();
                if(progress > Constant.screenWidth/3 && isWait < 4){
                    ++isWait;
                }else{
                    progress = progress + 10;
                }
            }else{
                clearInterval(this.interval);
                this.props.navigateToResult();
            }
        }, 300);
        this.interval = interval;
    }

    render() {
        const barStyles = {
            backgroundColor: "#fbb043",
            height: 4,
            width: this._width,
            borderRadius: 5
        };
        return (
            <View style={styles.viewContainer}>
                <Animated.View style={barStyles}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewContainer: {
        padding:4,
        backgroundColor:'#004860',
        width: Constant.screenWidth/1.8,
        overflow: 'hidden',
        borderRadius: 10
    }
});