import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Develop perspective on what you really value",
    "Learn to make better life decisions"
];

let icon = {uri:'intro_icon_choose'};
let iconBack= "rgb(255,206,116)";
let isProgressBar=true;
let backgroundColor="rgb(49,165,159)";
let heading="Choose your Path";
let barHeading="IMPROVES WISDOM";
let description = "You will be presented with a series of choices. Choose the life you want to live.";
let tips = "Make the choice that best reflects the life you’re committed to living.";

export default class ChooseYourPathInit extends React.PureComponent {

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
                             isClickable = { this.props.isClickable}
                             exeTopTitle={(this.props.introTitle && this.props.introTitle != "") && "Exercise " + this.props.introTitle
                              || "Exercise " + this.props.excerciseNumber}
            />
        );
    }

}