import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Easing
} from 'react-native';
import Constant from '../../../../../helper/constant';
import Button from '../../../../commonComponent/button';

export default  class AudioLocked extends React.PureComponent {


    constructor(props) {
        super(props);
        // this.position1 = new Animated.ValueXY(0,0);
        this.offset = new Animated.Value(Constant.screenHeight)
    }

    componentWillMount() {
        Animated.timing(this.offset, {
            duration: 0,
            toValue: Constant.screenHeight,
            useNativeDriver: true
        }).start();
        // Animated.timing(this.position1, {
        //     toValue: {x:0, y:Constant.screenHeight}, duration:0,
        // }).start();
    }

    componentDidMount() {
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),
            toValue: 0,
            useNativeDriver: true
        }).start();
        // Animated.timing(this.position1, {
        //     toValue: {x:0, y:0},
        //     // duration:300,
        //     duration: 400,
        //     easing: Easing.out(Easing.quad),
        //     // easing: Easing.bezier(0.175, 0.885, 0.32, 1.275)
        // }).start();
    }

    onButtonPress = () => {
        // Animated.timing(this.position1, {
        //     toValue: {x:0, y:Constant.screenHeight*2},
        //     duration:300,
        // }).start();
        // setTimeout(()=>{
        //     this.props.onPopUpButtonPress();
        // },300);

        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(()=>{
            this.props.onPopUpButtonPress();
        });
    };

    render() {
        const { outerView, transparentView, outerpopUp, innerPopUp, iconImage, titleText,
            detailText} = styles;
        return(
            <View style={outerView}>
                <View style={transparentView}/>
                <Animated.View style={[outerpopUp,{transform: [{translateY: this.offset}]}]} >
                    <View style={innerPopUp}>
                        <Image source={{uri:'lock_audio'}}
                               style={iconImage}
                               resizeMode={"contain"}/>

                        <Text style={titleText}>
                            Exercise locked
                        </Text>

                        <Text style={detailText}>
                            {"Complete this exercise in the today screen first. Then you can replay it here at any time."}
                        </Text>

                        <Button title={"Okay"}
                                backColor="rgb(255,207,104)"//"#fed179"
                                color="#FFF"
                                otherStyle={{height: 60,width: '86%',marginTop: 38}}
                                otherTextStyle={{fontSize:15, fontFamily: Constant.font700}}
                                onPress={this.onButtonPress}/>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        top:0, left:0, right:0, bottom:0, position: 'absolute', backgroundColor:'transparent'
    },
    transparentView: {
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'#fff', opacity:0.9, alignItems:'center', justifyContent:'center'
    },
    iconImage:{
        height:60, marginTop:50, width:60
    },
    outerpopUp:{
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'transparent', alignItems:'center', justifyContent:'center'
    },
    innerPopUp: {
        backgroundColor: 'rgb(90,194,189)',
        height: 374, width: Constant.screenWidth-40, alignSelf:'center',
        borderRadius: 13, alignItems:'center', opacity:1,
        maxWidth:340
    },
    titleText:{
        fontSize: 21, color:'#FFF', fontFamily: Constant.font500, marginTop: 25
    },
    detailText:{
        width: "80%",
        alignSelf: 'center',
        textAlign: 'center',
        lineHeight: 22,
        fontSize: 15, color:'#dcedec',
        fontFamily: Constant.font500, marginTop:10,
    },
});