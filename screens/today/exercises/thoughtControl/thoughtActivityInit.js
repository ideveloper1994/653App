import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';



let benefitsArray=[
    "Improve thought pattern awareness",
    "Learn to eliminate dangerous thoughts"
];
let icon = {uri:'intro_icon_thought_control'};
let isProgressBar=true;
let iconBack= "rgb(121,120,253)";
// let backgroundColor="rgb(255,207,117)";
let backgroundColor="rgb(251,177,69)";
let heading="Thought Control";
let barHeading="IMPROVES HYPOFRONTALITY";
let description = "Learn to control your thoughts. First for 60 seconds, then forever.";
let tips = "You will be shown an image for 5 seconds. After this a timer will start, and you" +
    " must countdown the timer without allowing that image to re-enter your mind.";

export default class thoughtActivityInit extends React.PureComponent {
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
