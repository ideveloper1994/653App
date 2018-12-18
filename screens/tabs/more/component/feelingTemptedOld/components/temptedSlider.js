import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import Button from '../../../../../commonComponent/button';
import * as Animatable from 'react-native-animatable';

export default  class TemptedSliderRow extends React.PureComponent {

    onButtonPress = () => {
        this.refs.btnView.pulse(300).then(()=>{
            this.props.onElseButtonPress(this.props.rowData);
        });
    };

    render() {
        const { mainView, imageView, outerText, titleText, descText } = styles;
        return (
            <View style={mainView}>
                <Image source={this.props.rowData.imageUrl || ""}
                       resizeMode={"contain"}
                       style={imageView}/>
                <View style={outerText}>
                    <Text style={titleText}>
                        {(this.props.rowData) && (this.props.rowData.title) && this.props.rowData.title || ""}
                    </Text>
                    <Text style={descText}>
                        {(this.props.rowData) && (this.props.rowData.description) && this.props.rowData.description || ""}
                    </Text>
                </View>

                <Animatable.View style={{ top: Constant.screenHeight*0.82, width:Constant.screenWidth,
                 alignSelf: 'center',position:'absolute'}}
                                 ref="btnView">
                    <Button title={( this.props.rowData.isLast) ? "Escape for a while" :"Try something else"}
                            backColor="#fbb043"
                            color="#fff"
                            otherStyle={{width:'82%', height: 60, marginTop: 0, marginBottom: 0, paddingTop:0, paddingBottom:0}}
                            onPress={this.onButtonPress}/>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        height: Constant.screenHeight,
        width: Constant.screenWidth,
        alignItems: 'center',
    },
    imageView:{
        marginTop: "10%",
        height:"40%",
        width: "85%",
    },
    outerText:{
        marginTop: "12%",
        width:'86%',
        flex:1,
    },
    titleText:{
        fontSize: 26,
        // color: 'rgb(75,75,75)',
        fontFamily: Constant.font300,
        textAlign: 'center',
        color:'#000'
    },
    descText:{
        marginTop: 24,
        fontSize: 15,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        textAlign: 'center',
        lineHeight: 23,
    },
});