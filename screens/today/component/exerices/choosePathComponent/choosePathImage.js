import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import ChoosePathLayer from './choosePathLayer';
import ImgLoader from '../../../../../helper/imageLoader';

export default  class ChoosePathImage extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    _onImagePress = () =>{
        // this.refs.view.pulse(100);
        this.props.onImagePress();
    };

    render() {
        return(
            <Animatable.View style={{flex: 1}} ref="view">
                <TouchableHighlight style={{flex: 1}} onPress={() => this._onImagePress()}>
                    <Image
                        source={{ uri: this.props.imageURL }}
                        style={{ height:Constant.fullScreenHeight/2, width: Constant.screenWidth }}
                        resizeMode="cover"
                    />
                </TouchableHighlight>

                {(this.props.isLayer)?
                    <ChoosePathLayer isGood={this.props.isGood}/>
                    :null
                }

            </Animatable.View>
        );
    }
}