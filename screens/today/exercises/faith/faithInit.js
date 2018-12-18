import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Learn about the benefits of beating your addiction",
    "Stay motivated on your journey"
];
let icon = {uri:'intro_icon_faith'};
let iconBack= "rgb(121,120,253)";
let isProgressBar=false;
// let backgroundColor="rgb(49,165,159)";
let backgroundColor="rgb(25,165,202)";
let heading="Scripture";
let barHeading="IMPROVES WISDOM";
let description = "Other people have been in your shoes. Learn how they took control of their lives.";
let tips = "Read a real-life account from someone just like you who has chosen to quit porn.";

export default class FaithInit extends React.PureComponent {

    render() {
        return (
            <InstructionView backgroundColor={backgroundColor}
                             icon={icon}
                             iconBack={iconBack}
                             isProgressBar={isProgressBar}
                             ProgressbarPer={"4%"}
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

