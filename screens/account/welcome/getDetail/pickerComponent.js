import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
} from 'react-native';
import Constant from '../../../../helper/constant';
import PickerAndroid from '../../../commonComponent/pickerAndroid';

export default class BeforeBeginComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        //alert(this.props.selectedValue);
        return(
            (Constant.isIOS)
            &&
            <Picker style={[styles.pickerIOSView, (this.props.style)&&this.props.style||{}]}
                    itemStyle={[styles.itemStyleIOS, (this.props.itemStyle)&&this.props.itemStyle||{}]}
                    selectedValue={this.props.selectedValue}
                    onValueChange={(itemValue, itemIndex) => {
                            this.props.onValueChange(itemValue)
                        }}>
                this.props.items.map((item) =>
                return <Picker.Item label={item.label} value={item.value}/>
                )
            </Picker>
            ||

            <PickerAndroid style={[styles.pickerAndroidView, (this.props.style)&&this.props.style||{}]}
                           itemStyle={[styles.itemStyleIOS, (this.props.itemStyle)&&this.props.itemStyle||{}]}
                           selectedValue={this.props.selectedValue}
                           onValueChange={(itemValue, itemIndex) => {
                               this.props.onValueChange(itemValue)
                           }}>
                {
                    this.props.items.map((item,index) =>{
                        return <PickerAndroid.Item label={item.label} value={item.value} key={index}/>
                    })
                }
            </PickerAndroid>
        )
    }
}

const styles = StyleSheet.create({
    pickerIOSView: {
        borderColor: '#FFF',
        marginRight:20,
        marginLeft:20
    },
    pickerAndroidView: {
        borderColor: '#FFF',
        marginRight:20,
        marginLeft:20,
        color:'#fff',
        width:Constant.screenWidth-40,
    },
    itemStyleIOS:{
        color: '#fff',
        fontFamily: Constant.font500
    },
    itemStyleAndroid:{
        fontFamily: Constant.font500,
        fontSize:15
    },
    textStyleAndroid:{
        color: '#fff',
        fontFamily: Constant.font500,
        fontSize:15,
        padding:5,
    },
    dropDownStyles:{
        color:'#fff',
        width:Constant.screenWidth-40
    }
});