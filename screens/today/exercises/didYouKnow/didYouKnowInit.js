import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Improve knowledge and objectivity",
    "Learn the negative consequences of porn addiction"
];
let icon = {uri:'intro_icon_learn'};
let iconBack= "rgb(255,207,117)";
let isProgressBar=true;
let backgroundColor="rgb(49,165,159)";
let heading="Did You Know?";
let barHeading="IMPROVES WISDOM";
let description = "Knowledge is power. Understand the reality of porn addiction.";
let tips = "Read and memorize the fact. On a deep level, try to accept that this can happen to you.";

export default class didYouKnowInit extends React.PureComponent {

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

