import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import Constant from '../../../../helper/constant'

const iconImage = {
    success: {uri: 'icon_achievement_team'},
    blur: {uri: 'icon_achievement_team_empty'}
};

export default class AchievementIcon extends React.Component {

    render() {
        const { container, textNo, imageView} = styles;
        return (
            <View  style={container}>
                <Image style={[imageView,{opacity:(this.props.objIcon.icon == "Y") ? 1 : 0.5}]}
                       source={(this.props.objIcon.icon == "Y") ? iconImage.success:iconImage.blur}>
                </Image>
                <Text style={[textNo,{opacity:this.props.opacity}]}
                      numberOfLines={1}>
                    {this.props.objIcon.val}</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '25%',
        height: 64,
        alignSelf: 'center',
        alignItems: 'center',
    },
    imageView: {
        height: 64,
        width: 54,
        alignSelf: 'center',
        position: 'absolute',
    },
    textNo: {
        color: '#ffffff',
        fontSize:12,
        alignSelf: 'center',
        position: 'absolute',
        top: 20,
        fontFamily: Constant.font700,
        backgroundColor: 'transparent',
        width: '70%',
        textAlign:'center'

    },
});

