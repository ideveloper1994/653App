import React, { Component } from 'react';
import {
    View,
    Animated, BackHandler, LayoutAnimation,
} from 'react-native';
import Constant from '../../../../../../helper/constant';

let isMounted = false;
let breathCount = 1;

export default class BreathCircle extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
        this.position = new Animated.Value(52);
    }

    componentDidMount() {
        isMounted=true;
        breathCount = 1;
        //LayoutAnimation.linear();
        this.setAnimationCircle();
    }

    componentWillUnmount() {
        isMounted=false;
        breathCount = 1;
        this.clearAllIntervals();
    }

    clearAllIntervals = () => {
        if(this.intervalId1){
            clearTimeout(this.intervalId1);
        }
        if(this.intervalId2){
            clearTimeout(this.intervalId2);
        }
    };

    setAnimationCircle() {
        if(isMounted && breathCount <= 3){
            this.intervalId1 = setTimeout(() => {
                let titleText = "Breathe in";
                if(breathCount == 1){
                    titleText = "Take a deep breath in";
                }else if(breathCount == 2){
                    titleText = "Take another breath in";
                }
                breathCount += 1;
                this.props.setTitleText(titleText);
                Animated.timing(this.position, {
                    toValue: 230,
                    duration: 5000
                }).start(() => {
                    this.intervalId2 = setTimeout(() => {
                        this.props.setTitleText("And breathe out");
                        Animated.timing(this.position, {
                            toValue: 52,
                            duration: 5000,
                        }).start(() => {
                            this.setAnimationCircle()
                        });
                    }, 1500);
                });
            }, (breathCount == 1) && 1200 || 1600);
        }else{
            this.clearAllIntervals();
            this.props.setNewQuestion();
        }
    }

    render() {
        const circleStyle = {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.5)',
            height: this.position,
            width: this.position,
            borderRadius:  115
        };
        return (
            <Animated.View style={circleStyle}/>
        );
    }
}