import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    Keyboard
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default class PinComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            titleText:props.type,
            txt1: '',
            txt2: '',
            txt3: '',
            txt4: '',
        };
    }

    componentDidMount() {
        setTimeout(()=>{
            this.focusNextField('1');
        },500);
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(){
        if(this.refs && this.refs["1"]){
            this.refs["1"].focus();
        }
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    focusNextField = (nextField) => {
        if(this.refs && this.refs[nextField]){
            this.refs[nextField].focus();
        }
    };

    removeValues = () => {
        if(this.refs && this.refs["1"]){
            this.refs["1"].focus();
        }

        this.setState({
            txt1: '',
            txt2: '',
            txt3: '',
            txt4: '',
        })
    };

    onlastDigitEncountered=(text)=>{
        if(this.refs && this.refs["1"]){
            this.refs["1"].focus();
        }
        setTimeout(()=>{
            this.props.onComplete({type: this.props.type,passcode: this.state.txt1+this.state.txt2+this.state.txt3+text})
                .then((res) => {
                    if(res == 'not matched'){
                        this.setState({
                            titleText:'Passcodes do not match. Try again.'
                        });
                    }else{
                        this.setState({
                            titleText:this.props.type
                        });

                    }
                    // Keyboard.dismiss();
                    this.removeValues()
                }).catch((err) => {
                this.removeValues()
            })
        },100);
    };

    onKeyPress = (e, textNo) => {
        try{
            var prevField = parseInt(textNo) - 1;
            if (e.nativeEvent.key === 'Backspace') {

                if (Math.abs(this.lastKeyEventTimestamp - e.timeStamp) < 20) return;

                if(textNo == '1') {
                    this.refs[textNo].focus();
                    this.refs[textNo].clear();
                }else{
                    this.refs[prevField].focus();
                    this.refs[prevField].clear();
                }
                this.setValues(textNo);
            }else{
                this.lastKeyEventTimestamp = e.timeStamp;
            }
        }catch (e){

        }
    };

    setValues = (ref) => {
        switch (ref){
            case "1":
                this.setState({
                    txt1: '',
                    txt2: '',
                    txt3: '',
                    txt4: '',
                });
                break;
            case "2":
                this.setState({
                    txt1: '',
                    txt2: '',
                });
                break;
            case "3":
                this.setState({
                    txt2: '',
                    txt3: '',
                });
                break;
            case "4":
                this.setState({
                    txt3: '',
                });
                break;
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.enterText}>{this.state.titleText}</Text>
                <View style={{flexDirection:'row',marginTop:10, alignSelf: 'center'}}>
                    <View style={[(this.state.txt1 == '')?styles.lineText:styles.dotText,{left:6}]}/>
                    <View style={[(this.state.txt2 == '')?styles.lineText:styles.dotText,{left:42}]}/>
                    <View style={[(this.state.txt3 == '')?styles.lineText:styles.dotText,{left:78}]}/>
                    <View style={[(this.state.txt4 == '')?styles.lineText:styles.dotText,{left:114}]}/>
                    <TextInput style={styles.textbox}
                               ref="1"
                               onKeyPress={(e) => this.onKeyPress(e,'1')}
                               selectionColor={Constant.transparent}
                               keyboardType={Constant.isIOS && 'number-pad' || 'numeric'}
                               value={this.state.txt1}
                               autoFocus={true}
                               returnKeyType={'next'}
                               onChangeText={(text) => {
                                   this.setState({
                                       txt1: text,
                                       titleText:this.props.type

                                   });
                                   this.focusNextField('2')
                               }}
                               underlineColorAndroid={Constant.transparent}/>

                    <TextInput style={styles.textbox}
                               ref="2"
                               onKeyPress={(e) => this.onKeyPress(e,'2')}
                               selectionColor={Constant.transparent}
                               value={this.state.txt2}
                               keyboardType={Constant.isIOS && 'number-pad' || 'numeric'}
                               returnKeyType={'next'}
                               onChangeText={(text) => {
                                   this.setState({
                                       txt2: text
                                   });
                                   this.focusNextField('3')
                               }}
                               underlineColorAndroid={Constant.transparent}/>

                    <TextInput style={styles.textbox}
                               ref="3"
                               onKeyPress={(e) => this.onKeyPress(e,'3')}
                               selectionColor={Constant.transparent}
                               keyboardType={Constant.isIOS && 'number-pad' || 'numeric'}
                               value={this.state.txt3}
                               returnKeyType={'next'}
                               onChangeText={(text) => {
                                   this.setState({
                                       txt3: text
                                   });
                                   this.focusNextField('4')
                               }}
                               underlineColorAndroid={Constant.transparent}/>
                    <TextInput style={styles.textbox}
                               ref="4"
                               onKeyPress={(e) => this.onKeyPress(e,'4')}
                               selectionColor={Constant.transparent}
                               value={this.state.txt4}
                               keyboardType={Constant.isIOS && 'number-pad' || 'numeric'}
                               returnKeyType={'next'}
                               onChangeText={(text) => {
                                   this.setState({
                                       txt4: text
                                   });
                                   setTimeout(()=>
                                       this.onlastDigitEncountered(text),100);
                               }}
                               underlineColorAndroid={Constant.transparent}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor: 'white',
    },
    textbox:{
        height:30,
        width:30,
        margin:3,
        backgroundColor:'transparent',
        color:'transparent',
    },
    dotText:{
        position:'absolute',
        top:11,//16,
        height:18,//3,
        width:18,
        backgroundColor:'black',
        borderRadius:9
    },
    lineText:{
        // top:21,
        // height:3,
        // width:18,
        position:'absolute',
        top:11,
        height:18,
        width:18,
        borderColor:'#000',
        borderWidth: 1,
        borderRadius:9,
    },
    enterText:{
        fontSize: 15,
        color: 'black',
        fontFamily: Constant.font500,
    },
});

