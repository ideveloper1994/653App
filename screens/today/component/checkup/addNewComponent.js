import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableHighlight,
    Keyboard
} from 'react-native';
import Constant from '../../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default  class AddNewComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            txtReason: ""
        };
    }

    onTextChange = (text) => {
        text = text.replace(/\s/g, '');
        this.setState({
            txtReason: text
        });
    };

    onDoneButtonPress = () => {
        Keyboard.dismiss();
        let reason =  this.state.txtReason.replace(/\s/g, '');
        if(reason.toString().trim().length > 0){
            // this.props.navigation.state.params.newQuestionAdded(this.props.navigation.state.params.questionNo, reason);
            // this.props.navigation.goBack();
            this.props.newQuestionAdded(this.props.questionNo, reason);
            this.props.onClosePress();
            // this.props.navigation.goBack();
        }
    };

    onCloseButtonPress = () => {
        Keyboard.dismiss();
        //this.props.navigation.goBack();
        this.props.onClosePress();
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={styles.container}>
                <View style={styles.inner}>
                    <View style={styles.mainContainer}>
                        <View style={styles.leftIcon}>
                            <Image source={{uri:'checkup_icon_plus'}}
                                   style={{height: 15, width: 15}}
                                   resizeMode={"contain"}/>
                        </View>
                        <View style={{flex:1, height:70, paddingLeft: 20,
                                    justifyContent:'center'}}>
                            <TextInput  ref="txtReason"
                                        autoFocus={true}
                                        value={this.state.txtReason}
                                        style={ styles.textInput }
                                        autoCapitalize={"words"}
                                        maxLength={7}
                                        autoCorrect={true}
                                        returnKeyType={'done'}
                                        onChangeText={(text) => this.onTextChange(text)}
                                        enablesReturnKeyAutomatically={true}
                                        onSubmitEditing={()=>this.onDoneButtonPress()}
                                        underlineColorAndroid={Constant.transparent}
                                        selectionColor={Constant.selectionColor}/>
                        </View>
                    </View>
                    <Text style={styles.introText}>
                        One word only. Maximum 7 letters.
                    </Text>
                </View>
                <View style={[styles.mainView,{paddingTop: 18 + this.props.top, backgroundColor: appColor.navDefaultColor,
                    borderBottomWidth:1, borderBottomColor: appColor.navBorderColor}]}>
                    <TouchableHighlight onPress={ () => this.onCloseButtonPress()}
                                        underlayColor={Constant.transparent}>
                        <View style={ styles.backIcon }>
                            <Ionicons name='ios-close'
                                      size={35}
                                      color={appColor.navTextColor}/>
                        </View>
                    </TouchableHighlight>
                    <Text style={[styles.titleText,{color: appColor.navTextColor}]}>
                        Add new reason
                    </Text>
                    <Text style={styles.textTitle}>{"Save"}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgb(241,241,241)',
    },
    inner:{
        top:0, left:0, right:0, bottom:0,
        position: 'absolute',
    },
    mainContainer: {
        flexDirection:'row',
        borderColor:'#d4d5d3',
        borderWidth:0.5,
        borderRadius:5,
        backgroundColor: "#FFF",
        height: 70,
        alignItems: 'center',
        paddingLeft:20,
        paddingRight:20,
        marginTop:Constant.screenHeight*0.33,
        marginLeft: 24,
        marginRight: 24
    },
    leftIcon: {
        backgroundColor: "rgb(244,107,70)",
        height:30,
        width:30,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    introText:{
        fontSize: 12,
        fontFamily: Constant.font500,
        color:'#9c9c9c',
        marginTop: 18,
        alignSelf: 'center',
        textAlign: 'center'
    },
    textInput:{
        color: '#4e4e4e',
        fontSize: 15,
        paddingBottom: 0,
        height:45,
        fontFamily: Constant.font500,
    },
    mainView:{
        flexDirection:'row',
        alignItems: 'center',
        // height: 80,
        backgroundColor: Constant.backColor
    },
    backIcon:{
        paddingLeft:20,
        paddingRight: 40,
        paddingTop:8,
        paddingBottom:5,
    },
    titleText:{
        alignSelf: 'center',
        fontSize: 15,
        color: '#FFF',
        textAlign: 'center',
        flex:1,
        fontFamily: Constant.font700,
    },
    backText:{
        paddingTop: 10,
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: Constant.font500,
    },
    textTitle:{
        width:70,
        color: 'transparent',
        textAlign:'right',
        fontSize: 15,
        fontFamily: Constant.font700,
    }
});