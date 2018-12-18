import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class SliderComponent extends React.PureComponent {

    render() {
        return (
            <Animated.View style={[styles.container,this.props.transitionAnimation(this.props.index)]}>
                <View style={{marginTop:Constant.fullScreenHeight/10,width:'100%',height:'40%', backgroundColor: 'transparent'}}/>
                <View style={{top:'62%',width:'86%',height:'40%', alignItems:'center', position:'absolute'}}>
                    <Text style={{color:'#0C0C0C',fontSize:26,fontFamily: Constant.font300, textAlign:'center'}}>
                        {this.props.titleName}
                    </Text>
                    <View style={{marginTop:25}}>
                        <Text style={{color:'#4e4e4e',fontSize:16,textAlign:'center',fontFamily: Constant.font500, lineHeight: 21}}>
                            {this.props.description}
                        </Text>
                    </View>
                </View>

            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:Constant.screenWidth,
        height:Constant.fullScreenHeight+10,
        alignItems:'center',
    }
});