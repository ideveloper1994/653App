import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class StressRelief extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReviewing: false
        };
    }

    componentWillReceiveProps (props) {
        if(!this.state.isReviewing){
            if(props.rowData.isReviewing){
                this.refs.vwImg.flash(100);
                this.setState({isReviewing: true});
            }
        }
    }

    onImagePress = () => {
        if(this.props.rowData.isReviewing){
            this.refs.vwImg.bounceIn();
        }
        this.props.faceClicked(this.props.rowData);
    };

    render() {
        const {imageVW, iPadOuter, iPhoneOuter, imageiPhoneVW} = styles;
        return(
            <Animatable.View ref="vwImg" style={Constant.isiPAD && iPadOuter || iPhoneOuter}>
                <TouchableHighlight underlayColor={Constant.transparent}
                                    onPress={()=> this.onImagePress()}
                                    style={Constant.isiPAD && iPadOuter || {flex:1,height:'100%',width:'100%'}}>
                    <Image source={(this.props.rowData.isSelected || this.props.rowData.isReviewing) ?
                        {uri:'face_good'} : {uri:'face_bad'}}
                           resizeMode={"contain"}
                           style={[(Constant.isiPAD || Constant.isANDROID) && imageVW || imageiPhoneVW,
                               {opacity:(this.props.rowData.isReviewing) ? 0.4 : 1}]}/>
                </TouchableHighlight>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    imageVW: {
        flex:1,
        height:'100%',width:'100%'
    },
    imageiPhoneVW: {
        height:(Constant.screenWidth-50)/5,
        width:(Constant.screenWidth-50)/5,
    },
    iPadOuter: {
        height:(Constant.screenHeight-20)/8,
        width:(Constant.screenWidth-40)/5,
        padding: 5
    },
    iPhoneOuter: {
        height:(Constant.screenWidth-20)/5,
        width:(Constant.screenWidth-20)/5,
        padding: 5
    },
});