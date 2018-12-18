import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import ProgressBar from '../../../commonComponent/progressBar';
import Constant from '../../../../helper/constant';

export default class progressBar extends React.PureComponent {
    render() {
        let appColor = Constant[this.props.appTheme];
        return (
            <View style={styles.container}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={[styles.title,{color: appColor.progressBarTitle}]}>{this.props.progressName}</Text>
                    <Text style={[styles.title,{color: appColor.progressBarTitle}]}>{this.props.actualPer}</Text>
                </View>
                <ProgressBar otherColor={appColor.rewiredprogressBarOtherColor}
                             progressVal={((this.props.progressPer.includes('%')))
                                 ?this.props.progressPer:this.props.progressPer+"%"}
                             fillBarColor={this.props.fillColor}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '88.8%',
        marginBottom:25,
        maxWidth:600
    },
    title:{
        color:"rgb(184,198,205)",
        fontSize:13,
        marginBottom:10,
        fontFamily: Constant.font500
    }
});