import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Improve personal and situational awareness",
    "Reduce stress and anxiety"
];
let icon = {uri:'intro_icon_breathing'};
let iconBack= "rgb(255,207,117)";
let isProgressBar=true;
let backgroundColor="rgb(122,121,255)";
let heading="Breathing Practice";
let barHeading="IMPROVES STRESS CONTROL";
let description = "Learn to focus your breathing to calm your mind and control relapse triggers.";
let tips = "Sit comfortably in a quiet, calm place. When your thoughts wander, always bring them back to your breathing.";
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let dayName = days[new Date().getDay()] + " Breathing";

export default class breathingPracticeInit extends React.PureComponent {

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
                             exeTopTitle={dayName}
            />
        );
    }

}