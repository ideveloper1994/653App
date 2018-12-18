import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Reset your dopamine response while developing emotional depth",
    "Improve overall well-being"
];
let isProgressBar=true;
let barHeading="IMPROVES DOPAMINE REWIRING";
let icon = {uri:'intro_icon_emotion'};
let iconBack= "rgb(255,207,117)";
let backgroundColor="rgb(241,86,129)";
let heading="Emotional Growth";
let description = "Learn to value real joy and genuine love over superficial pleasure.";
let tips = "Aim to stay focused on the current scene in the video, while avoiding other thoughts entering your mind. Headphones are recommended for this exercise.";

export default class EmotionalActivityInit extends React.PureComponent {

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
