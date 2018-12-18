import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';


let benefitsArray=[
    "Learn to replace destructive habits with life affirming activities",
    "Improve your health and well-being"
];
let icon = {uri:'intro_icon_activity'};
let iconBack= "rgb(255,207,117)";
let isProgressBar=true;
let backgroundColor="rgb(241,86,129)";
let heading="Healthy Activity";
let barHeading="IMPROVES DOPAMINE REWIRING";
let description = "Replace your addiction with healthy, high dopamine activities.";
let tips = "Do your best to complete the activity given. If you’re unable to complete this exact activity, try to find something similar that you can do.";

export default class HealthyActivityInit extends React.PureComponent {

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
