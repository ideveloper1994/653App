import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Improve your emotional capability",
    "Reinforce your desire to stay clean"
];
let icon = {uri:'intro_icon_audio'};
let iconBack= "rgb(121,120,253)";
let isProgressBar=true;
let backgroundColor= "rgb(49,165,159)";//"rgb(251,177,69)";
let heading="Audio Exercise";
let barHeading="IMPROVES WISDOM";
let description = "Listen to the audio exercises to accept your addiction and overcome it.";
let tips = "Plug in headphones, and find a quiet, still place where you can be alone for 15 minutes." +
    " Listen to the audio exercise, and try not to let your thoughts wander. Take a few minutes at the end" +
    " of the exercise to reflect on what you have learned.";

export default class rewiringExerciseInit extends Component {

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
                             exeTopTitle={"Exercise " + this.props.excerciseNumber}
            />
        );
    }
}