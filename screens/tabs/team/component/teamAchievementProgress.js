import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import AchievementIcon from './teamAchivementIcon';
import Constant from '../../../../helper/constant'

export default class TeamAchievementProgress extends React.PureComponent {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const { titleStyle, container } = styles;
        return (
            <View>
                <Text style={[titleStyle,{color: appColor.defaultFont}]}>Team Achievements</Text>
                <View style={[container,{marginTop: 40,}]}>
                    <AchievementIcon objIcon={this.props.achievements[0]} onIconPress={this.props.onIconPress}
                                     appTheme={this.props.appTheme}/>
                    <AchievementIcon objIcon={this.props.achievements[1]} onIconPress={this.props.onIconPress}
                                     appTheme={this.props.appTheme}/>
                    <AchievementIcon objIcon={this.props.achievements[2]} onIconPress={this.props.onIconPress}
                                     appTheme={this.props.appTheme}/>
                    <AchievementIcon objIcon={this.props.achievements[3]} onIconPress={this.props.onIconPress}
                                     appTheme={this.props.appTheme}/>
                </View>
                <View style={container}>
                    <AchievementIcon objIcon={this.props.achievements[4]}  onIconPress={this.props.onIconPress}
                                     appTheme={this.props.appTheme}/>
                    <AchievementIcon objIcon={this.props.achievements[5]} onIconPress={this.props.onIconPress}
                                     appTheme={this.props.appTheme}/>
                    <AchievementIcon objIcon={this.props.achievements[6]}  onIconPress={this.props.onIconPress}
                                     appTheme={this.props.appTheme}/>
                    <AchievementIcon objIcon={this.props.achievements[7]}  onIconPress={this.props.onIconPress}
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
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        maxWidth: 600
    },
    titleStyle:{
        marginTop: 12,
        color:'#FFF',
        fontSize:15,
        alignSelf:'center',
        fontFamily: Constant.font500,

    }
});