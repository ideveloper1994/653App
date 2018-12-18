import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class EscapeImage extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    onImagePress = () => {
        this.refs.img.pulse(400);
        this.props.onImagePress();
    };

    render() {
        const { mainView, imgView } = styles;
        return(
            <Animatable.View ref="img">
                <TouchableHighlight onPress={()=> this.onImagePress()}
                                    style={mainView} ref="test">
                    <Image style={imgView}
                           resizeMode={"stretch"}
                           source={this.props.ImageSource}/>
                </TouchableHighlight>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        height:Constant.screenHeight,
        width:Constant.screenWidth
    },
    imgView: {
        height:Constant.screenHeight,
        width:Constant.screenWidth
    }
});