import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
} from 'react-native';
import Constant from '../../helper/constant';
import ModalDropdown from 'react-native-modal-dropdown';
import _ from 'lodash'

export default class ModelPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {};
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
            <ModalDropdown
                options={_.map(this.props.items, _.property('label'))}
                style={[styles.pickerAndroidView, (this.props.style)&&this.props.style||{}]}
                textStyle={[styles.textStyleAndroid, (this.props.textStyle)&&this.props.textStyle||{}]}
                dropdownTextStyle={[styles.itemStyleAndroid,(this.props.itemStyle)&&this.props.itemStyle||{}]}
                dropdownStyle={[styles.dropDownStyles,(this.props.dropDownStyle)&&this.props.dropDownStyle||{}]}
                selectedValue={this.props.selectedValue}
                onSelect={(itemValue, itemIndex) => {
                    this.props.onValueChange(this.props.items[parseInt(itemValue)]["value"])
                }}
                showsVerticalScrollIndicator={false}
                defaultIndex={0}
                defaultValue={this.props.items[0]["label"]}
            />
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
        width:Constant.screenWidth-40
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
        padding:5
    },
    dropDownStyles:{
        color:'#fff',
        width:Constant.screenWidth-40
    }
});