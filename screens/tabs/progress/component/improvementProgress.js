import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import ImprovementIcon from '../subComponent/improvementIcon'
import Constant from '../../../../helper/constant'

export default class ImprovementProgress extends React.PureComponent {

    render() {
        let appColor = Constant[this.props.appTheme];
        const { container, titleStyle } = styles;
        return (
            <View style={{backgroundColor:appColor.scrollableViewBack}}>
                <Text style={[titleStyle,{color: appColor.defaultFont}]}>Improvements</Text>
                <View style={container}>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[0]}
                                     appTheme={this.props.appTheme}/>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[1]}
                                     appTheme={this.props.appTheme}/>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[2]}
                                     appTheme={this.props.appTheme}/>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[3]}
                                     appTheme={this.props.appTheme}/>
                </View>
                <View style={container}>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[4]}
                                     appTheme={this.props.appTheme}/>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[5]}
                                     appTheme={this.props.appTheme}/>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[6]}
                                     appTheme={this.props.appTheme}/>
                    <ImprovementIcon onIconPress={this.props.onIconPress} objIcon={this.props.improvement[7]}
                                     appTheme={this.props.appTheme}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '86%',
        height: 64,
        alignSelf: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        maxWidth:600
    },
    titleStyle:{
        margin: 25,
        color:'#FFF',
        fontSize:15,
        alignSelf:'center',
        fontFamily: Constant.font500,
    }
});