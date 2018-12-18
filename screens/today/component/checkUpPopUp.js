import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing
} from 'react-native';
import Constant from '../../../helper/constant';
import Button from '../../../screens/commonComponent/button';

export default  class CheckupPopUp extends React.PureComponent {

    constructor(props) {
        super(props);
        this.onButtonClicked = false
        this.offset = new Animated.Value(Constant.screenHeight)
    }

    componentDidMount() {
        this.onButtonClicked = false;
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),
            toValue: 0,
            useNativeDriver: true
        }).start();
    }

    onButtonPress = () => {
        if(!this.onButtonClicked){
            this.props.onBeginCheckup(this.props.checkUpDetail);
        }
        this.onButtonClicked = true;
    };

    onCloseCheckup = () => {
        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(()=>{
            this.props.onCloseCheckupPopUp(false)
        });
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const { outerView, transparentView, outerPopUp, innerPopUp, iconImage, nameText,
            detailText, bottomText} = styles;
        let width = (Constant.screenWidth-40) > 340 && 340 || Constant.screenWidth-40;
        return(
            <View style={outerView}>
                <View style={[transparentView,{backgroundColor: appColor.todayPopupBackgroundColor,
                    opacity: appColor.todayPopupBackOpacity}]}/>
                <Animated.View style={[outerPopUp,{transform: [{translateY: this.offset}]}]} >
                    <View style={innerPopUp}>
                        <Image source={{uri:'checkup_icon_circle'}}
                               style={iconImage}
                               resizeMode={"contain"}/>

                        <Text style={nameText}>
                            { this.props.checkUpDetail.title || "" }
                        </Text>

                        <Text style={detailText}>
                            { this.props.checkUpDetail.alertMessage || "" }
                        </Text>

                        <Button title={ this.props.checkUpDetail.buttonTitle || "" }
                                backColor="rgb(255,207,104)"//"#fed179"
                                color="#FFF"
                                otherStyle={{height: 60,width: width*0.86,
                                    marginTop: (this.props.checkUpDetail.closeText != "") ? 70 : 82}}
                                otherTextStyle={{fontSize:15, fontFamily: Constant.font700}}
                                onPress={this.onButtonPress}/>

                        {(this.props.checkUpDetail.closeText != "") ?
                            <Text style={bottomText}
                                  onPress={()=> this.onCloseCheckup()}>
                                { this.props.checkUpDetail.closeText || "" }
                            </Text>
                            : null}

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
        backgroundColor:'#173d51',
        opacity:0.9, alignItems:'center', justifyContent:'center'
    },
    iconImage:{
        height:60, marginTop:53,
        width:60
    },
    outerPopUp:{
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'transparent', alignItems:'center', justifyContent:'center',
    },
    innerPopUp: {
        backgroundColor: 'rgb(90,194,189)',
        height: 418, width: Constant.screenWidth-40, alignSelf:'center',
        borderRadius: 13, alignItems:'center', opacity:1,
        marginBottom: 10,
        maxWidth:340,
    },
    nameText:{
        fontSize: 16, color:'#dcedec', fontFamily: Constant.font500, marginTop: 28
    },
    detailText:{
        width: "80%",
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 22, color:'#fff', fontFamily: Constant.font300, marginTop: 15
    },
    bottomText: {fontSize: 15, color:'#dcedec',
        fontFamily: Constant.font500,
        paddingTop: 20, paddingBottom: 20}
});