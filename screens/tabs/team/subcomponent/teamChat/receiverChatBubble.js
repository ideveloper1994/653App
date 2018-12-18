import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableOpacity, LayoutAnimation
} from 'react-native';
import Constant from '../../../../../helper/constant';
import moment from "moment/moment";
import * as Animatable from 'react-native-animatable';

var CustomAnimation = {
    duration: 150,
    create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.scaleXY,
        // springDamping: 0.7
    },
    update: {
        type: LayoutAnimation.Types.linear,
        // springDamping: 0.7
    }
}

let isAnimate = true;

export default class receiverChatBubble extends React.PureComponent {

    componentWillReceiveProps (nextProps) {
        if(nextProps.isShowDate){
            if(isAnimate){
                isAnimate = false;
                this.refs.datetimeView.fadeInLeft(300).then(()=>{
                    isAnimate = true;
                });
            }
        }
    }

    componentWillUpdate (){
        // LayoutAnimation.easeInEaseOut();
        // this.refs.datetimeView.fadeInLeft(300);
    }


    onTimePress= () =>{
        if(this.props.isShowUser || this.props.index == 0){
            this.props.onPressDateTime()
            return;
        }
        this.refs.datetimeView.fadeOutLeft(300).then(()=>{
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            // LayoutAnimation.configureNext(CustomAnimation);
            this.props.onPressDateTime()
        });
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{backgroundColor: appColor.scrollableViewBack}}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={()=>this.props.onPressBubble(this.props.itemId)}>
                        <View style={[styles.subContainer,{backgroundColor: this.props.isSelected && appColor.selectedReceiverBubble
                            || appColor.receiverBubble}]}>
                            <Text  style={[styles.textStyle,{color: appColor.defaultFont}]}>
                                {this.props.messageText}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Animatable.View style={[styles.container, {marginTop:0}]} ref={"datetimeView"}>
                    {
                        (this.props.isShowUser || this.props.index == 0 || this.props.isShowDate) &&
                        <TouchableOpacity onPress={()=>this.onTimePress()}>
                            <View style={{flexDirection:'row',alignSelf:'flex-start',
                                marginTop:10, marginBottom: (Constant.isIOS) && 7 || this.props.index === 0 && 10 || 7}}>
                                <Image resizeMode="contain"
                                       source={{uri:this.props.userImage}}
                                       style={styles.avtarStyle}/>
                                <Text style={[styles.avtarText,{color: appColor.chatUsername}]}>
                                    {this.props.personName}
                                </Text>
                                {
                                    this.props.isShowDate &&
                                    <Text style={[styles.avtarText,{marginLeft:3, color: appColor.chatDateTime}]}>
                                        {this.props.occurredDate}
                                    </Text>
                                }
                            </View>
                        </TouchableOpacity>
                        || null
                    }
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    subContainer:{
        alignItems:'flex-start',
        backgroundColor:Constant.transparentBackColor,
        padding:10,
        borderRadius:20,
    },
    container: {
        marginTop: 3,
        marginLeft:10,
        maxWidth:"75%",
        alignSelf:'flex-start',
    },
    textStyle:{
        color:"white",
        fontSize:15,
        fontFamily: Constant.font500,
        lineHeight:21
    },
    avtarStyle:{
        height: 15,
        width:15,
        marginRight:5
    },
    avtarText:{
        color:'white',
        fontSize:10,
        alignSelf:'center',
        fontFamily: Constant.font500,
    }
});