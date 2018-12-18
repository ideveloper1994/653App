import React from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import Constant from '../../../../helper/constant'

export default class AchievementIcon extends React.Component {
    render() {
        const { container, imageView} = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TouchableHighlight style={[container,(this.props.otherStyle) && this.props.otherStyle || {},
                {opacity:(this.props.objIcon.icon === "L") ? 0.5 : 1 }]}
                                underlayColor={"transparent"}
                                onPress={() => {if(this.props.onIconPress){this.props.onIconPress(this.props.objIcon)}}}>
                <Image style={[imageView,(this.props.imageStyle) && this.props.imageStyle || {}]}
                       resizeMode={'contain'}
                       source={appColor.achievementImages[this.props.objIcon.icon][this.props.objIcon.val]}>
                </Image>
            </TouchableHighlight>
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
        height: 65,
        width: 55,
        alignSelf: 'center',
        position: 'absolute',
        opacity: 1
    },
});

