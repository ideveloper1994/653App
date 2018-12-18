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
let icon = {uri:'intro_icon_brain_training'};
let iconBack= "rgb(156,155,255)";
let isProgressBar=true;
let backgroundColor="rgb(241,86,129)";//"rgb(251,177,69)";
let heading="Brain Training";
let barHeading="IMPROVES DOPAMINE REWIRING";
let description = "Learn to control your thoughts and shut down relapse triggers.";
let tips = "Repeat the affirmations to yourself as they appear on screen. Speak the affirmations quietly, or aloud if possible."
export default class brainTrainingInit extends React.PureComponent {

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
