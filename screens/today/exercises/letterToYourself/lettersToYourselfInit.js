import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Develop clarity and resolve",
    "Stay motivated by remembering what you want"
];
let icon = {uri:'intro_icon_letter'};
let iconBack= "rgb(121,120,253)";
let isProgressBar=true;
let backgroundColor="rgb(49,165,159)";
let heading="Write Your Letter";
let barHeading="IMPROVES WISDOM";
let description = "Write a letter to yourself. You will receive this letter after you complete";
let tips = "Focus on congratulating yourself for your progress so far and motivating yourself for the challenging times to come.";

export default class LetterYourSelfInit extends React.PureComponent {

    render() {
        return (
            <InstructionView backgroundColor={backgroundColor}
                             icon={icon}
                             iconBack={iconBack}
                             isProgressBar={isProgressBar}
                             ProgressbarPer={this.props.per}
                             heading={heading}
                             barHeading={barHeading}
                             description={this.props.description}
                             benefitsArray={benefitsArray}
                             tips={tips}
                             exerciesNo={this.props.excerciseNumber}
                             onCloseButtonPress = {this.props.onCloseButtonPress}
                             onActivityButtonPress = {this.props.onActivityButtonPress}
                             isClickable = {this.props.isClickable}
                             exeTopTitle={this.props.title}
            />
        );
    }

}