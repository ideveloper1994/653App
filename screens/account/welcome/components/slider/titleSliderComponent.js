import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated
} from 'react-native';
import Button from '../../../../commonComponent/button';
import Constant from '../../../../../helper/constant';

export default class TitleSliderComponent extends React.PureComponent {

    render() {
        return (
            <Animated.View style={[styles.container,{backgroundColor: 'transparent'},this.props.transitionAnimation(this.props.index)]}>
                <View style={{marginTop:Constant.fullScreenHeight/10,width:'100%',height:'40%', backgroundColor: 'transparent'}}/>
                {(this.props.isLast) ?
                    <View style={{top:(Constant.fullScreenHeight*75)/100, left:0, right:0, bottom:0, position:'absolute'}}>
                        <Button title="Reboot Benefits"
                                backColor="#FFF"
                                color="#fbb043"
                                otherStyle={{width:"80%", marginTop:0, height:60}}
                                otherTextStyle={{
                                    fontSize: 16,
                                    fontFamily: Constant.font700}}
                                onPress={this.props.onNextClick}/>
                    </View>
                    :
                    <Image style={{top:'68%',width:135,height:57, position:'absolute', opacity: 0.5}}
                           resizeMode={'contain'}
                           source={{uri:'right_arrow'}}/>
                }
            </Animated.View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight,
        alignItems:'center',
    }
});