import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import InstructionView from '../../component/exerices/instructionComponent';

let benefitsArray=[
    "Improve erection strength and duration",
    "Improve your capability for more pleasurable and enjoyable sex"
];
let icon = {uri:'intro_icon_kegals'};
let iconBack= "rgb(255,207,117)";
let isProgressBar=false;
let backgroundColor="rgb(25,165,202)";
let heading="Kegals";
let barHeading="IMPROVES ERECTION QUALITY";
let description = "Reverse porn-induced erectile dysfunction and improve your capacity for pleasurable sex.";
let tips = "Follow the prompts given in the audio.";
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let dayName = days[new Date().getDay()] + " Kegals";

export default class kegalsActivityInit extends React.PureComponent {

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
                             exeTopTitle={dayName}
            />
        );
    }

}
