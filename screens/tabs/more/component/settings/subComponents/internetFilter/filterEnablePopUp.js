import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Easing,
    Switch,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../../../helper/constant';

export default  class FilterEnable extends React.PureComponent {

    constructor(props) {
        super(props);
        // this.position1 = new Animated.ValueXY(0,0);
        this.offset = new Animated.Value(Constant.screenHeight)
    }

    componentWillMount() {
        // Animated.timing(this.position1, {
        //     toValue: {x:0, y:Constant.screenHeight}, duration:0,
        // }).start();
        Animated.timing(this.offset, {
            duration: 0,
            toValue: Constant.screenHeight,
            useNativeDriver: true
        }).start();
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
        //     duration:300,
        //     easing: Easing.bezier(0.175, 0.885, 0.32, 1.275)
        // }).start();
    }

    onButtonPress = () => {
        // Animated.timing(this.position1, {
        //     toValue: {x:0, y:Constant.screenHeight*2}, duration:300,
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

    setUpLetterPress = () => {
        this.props.onPopUpButtonPress();
    };

    render() {
        const { outerView, transparentView, outerpopUp, innerPopUp, titleText, stepText, otherText, rowImage, txtLater } = styles;
        return(
            <View style={outerView}>
                <View style={transparentView}/>
                    <Animated.View style={[outerpopUp,{transform: [{translateY: this.offset}]}]} >

                    <View style={{flex:1}}/>

                    <View style={innerPopUp}>
                        <Text style={titleText}>
                            {"Internet filter is disabled. \n To enable:"}
                        </Text>
                        <Text style={[stepText, {marginTop:10}]}>
                            {"STEP 1"}
                        </Text>
                        <Text style={otherText}>
                            {"Open settings"}
                        </Text>
                        <Image source={require('../../../../../../../assets/images/internet_filter/blocker-popup-1.png')}
                               style={rowImage}
                               resizeMode={"contain"}/>

                        <Text style={stepText}>
                            {"STEP 2"}
                        </Text>
                        <Text style={otherText}>
                            {"Tap Safari"}
                        </Text>

                        <Image source={require('../../../../../../../assets/images/internet_filter/blocker-popup-2.png')}
                               style={rowImage}
                               resizeMode={"contain"}/>

                        <Text style={stepText}>
                            {"STEP 3"}
                        </Text>
                        <Text style={otherText}>
                            {"Tap Content Blockers"}
                        </Text>

                        <Image source={require('../../../../../../../assets/images/internet_filter/blocker-popup-3.png')}
                               style={rowImage}
                               resizeMode={"contain"}/>

                        <Text style={stepText}>
                            {"STEP 4"}
                        </Text>
                        <Text style={otherText}>
                            {"Turn Brainbuddy On"}
                        </Text>

                        <Image source={require('../../../../../../../assets/images/internet_filter/blocker-popup-4.png')}
                               style={[rowImage,{marginBottom: 34}]}
                               resizeMode={"contain"}/>

                    </View>

                    <View style={{flex:1, justifyContent:"center", alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.setUpLetterPress()} style={{justifyContent:"center",
                        alignItems:'center'}}>
                            <Text style={txtLater}>{"Setup later"}</Text>
                        </TouchableOpacity>
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
        backgroundColor:'#000', opacity:0.75, alignItems:'center', justifyContent:'center'
    },
    outerpopUp:{
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'transparent', alignItems:'center', justifyContent:'center'
    },
    innerPopUp: {
        backgroundColor: '#FFF',
        width: 300, alignSelf:'center',
        borderRadius: 13, alignItems:'center', opacity:1},
    titleText:{
        fontSize: 14, color:'#4b4b4b', fontFamily: Constant.font700, marginTop: 32,
        textAlign:"center", lineHeight:24
    },
    stepText:{
        fontSize: 12, color:'#d3d3d3', fontFamily: Constant.font700, marginTop: 23,
        textAlign:"center",
    },
    otherText: {
        fontSize: 14, color:'#4b4b4b', fontFamily: Constant.font500, marginTop: 1,
        textAlign:"center",
    },
    rowImage:{
        height: 32,
        marginTop: 12
    },
    txtLater:{
        fontFamily:Constant.font500,fontSize:13,color:'#fff',
        padding:20
    },
});