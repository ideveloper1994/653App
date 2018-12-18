import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Reduce stress and anxiety",
    "Minimize the risk of stress-related relapse"
];
let icon = {uri:'intro_icon_stress_relief'};
let isProgressBar=true;
let iconBack= "rgb(255,207,117)";
let backgroundColor="rgb(121,120,253)";
let heading="Stress Relief";
let barHeading="IMPROVES STRESS CONTROL";
let description = "Tap the smiling faces to orientate towards happiness and reduce stress.";
let tips = "Press the green faces as they appear.";
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let dayName = days[new Date().getDay()] + " Stress Relief";

export default class StressReliefInit extends React.PureComponent {

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
                             exeTopTitle={(this.props.introTitle && this.props.introTitle != "") && this.props.introTitle
                              || dayName}
            />
        );
    }

}