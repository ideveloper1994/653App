import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default class Button extends Component {

    constructor(props){
        super(props)
        this.state={
            selectedBtn: {},
            selectedIndex: 10
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            selectedBtn: {},
            selectedIndex: 10
        });
    }

    onButtonPress = (obj, index) => {
        if(this.state.selectedIndex != index) {
            if(this.props.optionsData.isExtraQuestion){
                this.setState({
                    selectedBtn: {backgroundColor: "rgba(255,255,255,0.8)"},
                    selectedIndex: index
                },()=>{
                    //here call parent method
                    setTimeout(()=>{
                        this.props.temptationAnswer(obj);
                    },500);
                });
            }else{
                if(obj == this.props.optionsData.correctAnswer){
                    this.setState({
                        selectedBtn: {backgroundColor: "#CCE8BF"},
                        selectedIndex: index
                    },()=>{
                        //here call parent method
                        setTimeout(()=>{
                            this.props.setNewQuestion();
                        },500);
                    });
                }else{
                    this.setState({
                        selectedBtn: {backgroundColor: "#FFBCAA"},
                        selectedIndex: index
                    });
                }
            }
        }
    }

    render() {
        return (
            <View>
                {
                    this.props.optionsData.answers.map((obj, index)=>{
                        return(
                            <TouchableHighlight onPress={()=>this.onButtonPress(obj, index)}
                                                delayPressIn={0}
                                                underlayColor={"rgba(255,255,255,0.5)"}
                                                style={[styles.btnOuter,index==this.state.selectedIndex && this.state.selectedBtn || {}]}
                                                key={index}>
                                <View>
                                    <Text style={[styles.btnFont]}>
                                        {obj}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        )})
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btnOuter:{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        height:50,
        width:190,
        marginBottom:10,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    btnFont:{
        fontSize: 15,
        fontFamily: Constant.font700,
        color:'#FFF'
    }
});