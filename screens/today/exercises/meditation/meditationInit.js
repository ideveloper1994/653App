import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Strengthens the brain’s pre-frontal lobes, improving self-control",
    "Boosts grey matter in the amygdala, reducing anxiety and stress"
];
let isProgressBar = true;
let barHeading = "IMPROVES HYPOFRONTALITY AND STRESS CONTROL";
let icon = {uri:'intro_icon_meditation'};
let iconBack= "rgb(255,207,117)";
let backgroundColor = "rgb(251,177,69)";
let heading = "Meditation";
let description = "Meditation strengthens what addiction has weakened, returning control to the rational part of your brain.";
let tips = "Find a comfortable position. Close your eyes, and quiet your mind. Focus on taking slow, deep breaths. If a thought enters your mind, " +
    "acknowledge it, and then dismiss it and return focus to your breathing.";

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