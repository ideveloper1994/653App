import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    Keyboard
} from 'react-native';
import Constant from '../../../../../../../../helper/constant';
import _ from 'lodash';

let arr = ["1","2","3","4","5","6","7","8"];
export default class PinComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            titleText:props.type,
            isError: false,
            txt1: '',
            txt2: '',
            txt3: '',
            txt4: '',
            txt5: '',
            txt6: '',
            txt7: '',
            txt8: '',
        };
    }

    componentDidMount() {
        this.focusNextField('1');
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
        this.setState({
            txt1: '',
            txt2: '',
            txt3: '',
            txt4: '',
            txt5: '',
            txt6: '',
            txt7: '',
            txt8: '',
        });
        if(this.refs && this.refs["1"]){
            this.refs["1"].focus();
        }
    };

    onlastDigitEncountered=(text, index)=>{
        let passcode = this.state.txt1+this.state.txt2+this.state.txt3+this.state.txt4+this.state.txt5+
            this.state.txt6+this.state.txt7+text;
        if(this.props.isEnterPasscode){
            setTimeout(()=>{
                if(this.props.passcode == passcode) {
                    Keyboard.dismiss();
                    this.props.onComplete();
                }else{
                    this.setState({
                        isError: true,
                        titleText: 'Incorrect passcode. Try again.',
                    });
                    this.removeValues();
                }
            },50);
        }else{
            if(this.refs && this.refs["1"]){
                this.refs["1"].focus();
            }
            setTimeout(()=>{
                this.props.onComplete({type: this.props.type,passcode: passcode})
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
        }
    };

    onChangeText = (txt, index) => {
        let key = "txt" + index;
        let nextKey = parseInt(index) + 1 + "";
        let val = _.cloneDeep(this.state);
        val[key] = txt;
        this.setState(val);
        if(index == "8"){
            setTimeout(()=>{
                this.onlastDigitEncountered(txt, index)
            }, 80);
        }else{
            this.focusNextField(nextKey);
        }
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
    }

    // onKeyPress = (e, textNo) => {
    //     try{
    //         var prevField = parseInt(textNo) - 1;
    //         if (e.nativeEvent.key === 'Backspace') {
    //             if(textNo == '1') {
    //                 this.refs[textNo].focus();
    //                 this.refs[textNo].clear();
    //             }else{
    //                 this.refs[prevField].focus();
    //                 this.refs[prevField].clear();
    //             }
    //             this.setValues(textNo);
    //         }
    //     }catch (e){
    //
    //     }
    // }

    setValues = (ref) => {
        switch (ref){
            case "1":
                this.removeValues();
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
                    txt4: '',
                });
                break;
            case "5":
                this.setState({
                    txt4: '',
                    txt5: '',
                });
                break;
            case "6":
                this.setState({
                    txt5: '',
                    txt6: '',
                });
                break;
            case "7":
                this.setState({
                    txt6: '',
                    txt7: '',
                });
                break;
            case "8":
                this.setState({
                    txt7: '',
                    txt8: '',
                });
                break;
        }
    }

    render() {
        return (
            <View style={ styles.container } pointersEvent={'none'}>
                <Text style={[styles.enterText, {color: this.state.isError && "red" || "black"}]}>
                    {this.state.titleText}
                </Text>
                <View style={{flexDirection:'row',marginTop:10, alignSelf: 'center'}}>
                    {
                        arr.map((obj,i)=>{
                            let key = "txt" + obj;
                            return <TextInput style={styles.textbox}
                                              key={i}
                                              ref={obj}
                                              selectionColor={Constant.transparent}
                                              keyboardType={'number-pad'}
                                              value={this.state[key]}
                                              onKeyPress={(e) => this.onKeyPress(e,obj)}
                                              returnKeyType={'next'}
                                              maxLength={1}
                                              onChangeText={(text) => this.onChangeText(text,obj)}
                                              underlineColorAndroid={Constant.transparent}/>
                        })
                    }

                    <View style={[(this.state.txt1 == '')?styles.lineText:styles.dotText,{left:6}]}/>
                    <View style={[(this.state.txt2 == '')?styles.lineText:styles.dotText,{left:42}]}/>
                    <View style={[(this.state.txt3 == '')?styles.lineText:styles.dotText,{left:78}]}/>
                    <View style={[(this.state.txt4 == '')?styles.lineText:styles.dotText,{left:114}]}/>
                    <View style={[(this.state.txt5 == '')?styles.lineText:styles.dotText,{left:150}]}/>
                    <View style={[(this.state.txt6 == '')?styles.lineText:styles.dotText,{left:186}]}/>
                    <View style={[(this.state.txt7 == '')?styles.lineText:styles.dotText,{left:222}]}/>
                    <View style={[(this.state.txt8 == '')?styles.lineText:styles.dotText,{left:258}]}/>
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

