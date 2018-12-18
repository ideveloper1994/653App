import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Image,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';

export default class KegalsInstruction extends React.PureComponent {

    constructor(props) {
        super(props);
    }
    handleBackPress = () => {
        return true;
    };
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    render() {
        const {container, bottomText, titleText} = styles;
        return (
            <ScrollView style={container}>
                <View style={{marginTop: 43, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => this.props.onClosePress(false)}>
                        <Image style={{height:32,width:32,opacity: 0.7}}
                               source={{uri:'close_x_black'}}
                               resizeMode="contain"/>
                    </TouchableOpacity>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={titleText}>Instructions</Text>
                    </View>
                    <View style={{width:84}}/>
                </View>

                <View style={{flex:1, alignItems: 'center', justifyContent: 'center',paddingTop:57,paddingBottom:15, width: '86%', alignSelf: 'center'}}>

                    <Text style={bottomText}>
                        Kegals are easy to do, once you know which muscles to target.
                         One of the easiest ways to locate your muscles is during urination.
                        Here’s how -
                        {'\n\n'}- Halfway through urination, try to stop or slow down the flow of urine.
                        {'\n'}- Don’t tense the muscles in your buttocks, legs, or abdomen, and don’t hold your breath.
                        {'\n'}- When you can slow or stop the flow of urine, you’ve successfully located these muscles.
                        {'\n\n'}Some find these muscles by imagining that they are trying to stop the passage of gas. Squeezing these muscles
                         gives a pulling sensation; these are the right muscles for pelvic exercises. It's important not to contract other muscles.
                        {'\n\n'}When you’re first starting, it may be easier to do Kegel exercises lying down, so your
                        muscles aren’t fighting against gravity. It may also be easier to contract the muscles for
                         just two or three seconds at first.
                        {'\n\n'}Remember not to tense your buttock, legs, or stomach muscles while you’re doing kegels.
                    </Text>

                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#f0f8fc",
    },
    titleText:{
        textAlign: 'center',
        color: '#4e4e4e',
        fontSize: 18,
        fontFamily: Constant.font300,
    },
    bottomText:{
        textAlign: 'center',
        lineHeight:20,
        color: '#4e4e4e',
        fontSize: 15,
        fontFamily: Constant.font500,
    },
});