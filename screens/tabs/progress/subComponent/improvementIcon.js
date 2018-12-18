import React from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import Constant from "../../../../helper/constant";

export default class ImprovementIcon extends React.Component {
    render() {
        const { container, imageView } = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TouchableHighlight style={[container,(this.props.otherStyle) && this.props.otherStyle || {}]}
                                underlayColor={"transparent"}
                                onPress={() => {if(this.props.onIconPress){this.props.onIconPress(this.props.objIcon);}}}>
                <Image style={[imageView,(this.props.imageStyle) && this.props.imageStyle || {}]}
                       resizeMode={'contain'}
                       source={(this.props.objIcon) && appColor.improvementIcon[this.props.objIcon.icon][this.props.objIcon.val]
                       || appColor.improvementIcon["Y"]["alive"]}>
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
        height: 64,
        width: 54,
        alignSelf: 'center',
        position: 'absolute',
    },
});