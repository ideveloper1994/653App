import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Switch,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TochableView from '../../../../../commonComponent/touchableView';

export default  class DoNotDisturbTime extends Component {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <TouchableHighlight onPress={()=>this.props.onSelectTime(this.props.type)}
                                underlayColor={Constant.transparent}>
                <View style={[mainView,{backgroundColor:(this.props.type == this.props.selectedType) && Constant.settingRowPressIn || '#fff'}]}>
                    <Text style={rowTitle}>
                        {this.props.type + " " + this.props.displayTime}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        alignItems: 'center',
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        height:45,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor:'#fff'
    },
    rowTitle:{
        fontSize: 14,
        color: 'rgb(0,122,255)',
        fontFamily: Constant.font500,
        flex:1,
        textAlign:'center'
    }
});