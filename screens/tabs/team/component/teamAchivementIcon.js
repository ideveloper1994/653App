import React from 'react';
import { StyleSheet, Image, TouchableHighlight } from 'react-native';
import Constant from '../../../../helper/constant';

export default class AchievementIcon extends React.PureComponent {

    render() {
        const { container,imageView} = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TouchableHighlight style={[container,(this.props.otherStyle) && this.props.otherStyle || {}]}
                                underlayColor={"transparent"}
                                onPress={() => {if(this.props.onIconPress){this.props.onIconPress(this.props.objIcon)}}}>
                <Image style={[imageView,{opacity:(this.props.objIcon.icon == "L") ? 0.5 : 1},
                (this.props.imageStyle) && this.props.imageStyle || {}]}
                       resizeMode={"contain"}
                       source={appColor.teamAchievementImages[this.props.objIcon.icon][this.props.objIcon.val]}>
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
    },
    imageView: {
        height: 64,
        width: 54,
        alignSelf: 'center',
        position: 'absolute',
    },
});