import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../../helper/constant';

export default  class FeelingTemptedRow extends React.PureComponent {

    render() {
        return (
            <TouchableOpacity onPress={()=>{this.props.onRowSelect(this.props.rowData)}}
                              style={ styles.outerView }>
                <View style={{flex:1,flexDirection:'row',}}>
                    <Image source={this.props.rowData.image}
                           resizeMode={"contain"}
                           style={ styles.iconImage }/>
                    <View style={ styles.outerTextView }>
                        <Text style={ styles.textDetail}>
                            {(this.props.rowData) && (this.props.rowData.title) && this.props.rowData.title || ""}
                        </Text>
                        <Image source={{uri:'button_arrow'}}
                               style={{width:9, height:15}}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        flexDirection:'row',
        height: 78,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems:'center',
        borderBottomWidth: 1,
        borderBottomColor: Constant.settingGrayColor
    },
    iconImage:{
        height:58,
        width:58,
        opacity: 0.6
    },
    outerTextView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        flex:1,
        paddingLeft: 10,
    },
    textDetail:{
        fontSize: 15,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
    },

});