import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';
import Constant from '../../../../helper/constant';

let benefitsArray=[
    "Increase your desire to live a more fulfilling lifestyle",
    "Learn to replace destructive habits with life-affirming activities"];
let icon = {uri:'intro_icon_visualize'};
let isProgressBar=true;
let iconBack= "rgb(121,120,253)";
// let backgroundColor="rgb(255,207,117)";
let backgroundColor="rgb(241,86,129)";
let heading="Visualize";
let barHeading="IMPROVES DOPAMINE REWIRING";
let description = "Imagine a healthy, porn-free life. So many amazing experiences are waiting for you";

let tips = (Constant.isIOS) && "You will be shown a scene of someone else living out their life, happy, healthy and porn free. "+
    "Plug in your headphones and hold your iPhone close to your eyes. "
    +"For the duration of this exercise, imagine you are this person. Accept that they are happy and better off without porn-"+
    "and that you can be too." ||
    "You will be shown a scene of someone else living out their life, happy, healthy and porn free. "+
    "Plug in your headphones and hold your phone close to your eyes. "+
    "For the duration of this exercise, imagine you are this person. Accept that they are happy and better off without porn and that you can be too.";``

export default class VisualizationInit extends React.PureComponent {

    render() {
        return (
            <InstructionView backgroundColor={backgroundColor}
                             icon={icon}
                             iconBack={iconBack}
                             isProgressBar={isProgressBar}
                             ProgressbarPer={this.props.per}
                             heading={heading}
                             barHeading={barHeading}
                             description={description}
                             benefitsArray={benefitsArray}
                             tips={tips}
                             exerciesNo={this.props.excerciseNumber}
                             onCloseButtonPress = {this.props.onCloseButtonPress}
                             onActivityButtonPress = {this.props.onActivityButtonPress}
                             isClickable = {this.props.isClickable}
                             exeTopTitle={(this.props.introTitle && this.props.introTitle != "") && "Exercise " + this.props.introTitle
                              || "Exercise " + this.props.excerciseNumber}
            />
        );
    }

}