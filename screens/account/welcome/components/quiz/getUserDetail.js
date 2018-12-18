import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Keyboard
} from 'react-native';
import Constant from '../../../../../helper/constant';
import Button from '../../../../commonComponent/button';
import {setNewUser} from '../../../../../actions/userActions';
import {showThemeAlert} from '../../../../../helper/appHelper';
import { connect } from 'react-redux';

class UserDetail extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            age: '',
        };
    }

    //Focus on next field - onpress keyboard next
    focusNextField = (nextField) => {
        if(this.refs && this.refs[nextField]){
            this.refs[nextField].focus();
        }
    };

    onTextChange = (text, type) => {
        let tmp = {};
        tmp[type] = text;
        this.setState(tmp);
    };

    onAssessmentPress = () => {
        if(this.state.firstName.trim().length <= 0 || this.state.age.trim().length <= 0) {
            showThemeAlert({
                title: "Missing information",
                message: "Please enter your first name and age",
                leftBtn: "OK",
            });
        }else {
            Keyboard.dismiss();
            let userObj = {
                    name: this.state.firstName.trim(),
                    age:  parseInt(this.state.age.trim()) || 0,
                    gender: this.props.selectedAnswers[16].dbValue,
                    region: "pacific",
                    motivation: this.props.selectedAnswers[15].dbValue,
                    orientation: (this.props.selectedAnswers[14].dbValue != "") ? this.props.selectedAnswers[14].dbValue : "heterosexual"
            };
            this.props.setNewUser(userObj);
            this.props.onSelectAnswer(this.props.questionNo, 0);
        }
    };

    render() {
        return (
            <View>
                <TextInput  ref="txtFirstName"
                            value={this.state.firstName}
                            placeholder={"Your first name"}
                            placeholderTextColor={ "#4e4e4e" }
                            style={ styles.textBox }
                            autoCapitalize={"words"}
                            autoCorrect={false}
                            returnKeyType={'next'}
                            onChangeText={(text) => this.onTextChange(text, 'firstName')}
                            onSubmitEditing={() => this.focusNextField('txtAge')}
                            underlineColorAndroid={Constant.transparent}
                            selectionColor={Constant.selectionColor}/>

                <View style={[styles.textBorder]}/>

                <TextInput ref="txtAge"
                           value={this.state.age}
                           keyboardType={Constant.isIOS && 'number-pad' || 'numeric'}
                           placeholder={"Your age"}
                           placeholderTextColor={ "#4e4e4e" }
                           style={[styles.textBox,{marginTop: 25}]}
                           returnKeyType={"done"}
                           blurOnSubmit={true}
                           onChangeText={(text) => this.onTextChange(text, 'age')}
                           autoCapitalize="none"
                           autoCorrect={false}
                           maxLength={3}
                           underlineColorAndroid={Constant.transparent}
                           selectionColor={Constant.selectionColor}/>

                <View style={ styles.textBorder }/>

                <Button title="Complete Assessment"
                        backColor="#fbb043"
                        otherStyle={{marginTop:38}}
                        color="#FFF"
                        onPress={this.onAssessmentPress}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textBorder:{
        backgroundColor: 'rgb(218,219,217)',
        height:1.5,
    },
    textBox:{
        fontSize: 16,
        color: '#4e4e4e',
        paddingBottom: 0,
        height:35,
        fontFamily: Constant.font500,
        marginBottom:15,
        marginTop:20,
    },

});


const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps, {
    setNewUser
})(UserDetail);
