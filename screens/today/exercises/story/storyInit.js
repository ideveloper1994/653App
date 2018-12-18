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
let icon = {uri:'intro_icon_story'};
let iconBack= "rgb(121,120,253)";
let isProgressBar=true;
let backgroundColor="rgb(49,165,159)";
let heading="Story";
let barHeading="IMPROVES WISDOM";
let description = "Other people have been in your shoes. Learn how they took control of their lives.";
let tips = "Read a real-life account from someone just like you who has chosen to quit porn.";

export default class StoryInit extends React.PureComponent {

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

