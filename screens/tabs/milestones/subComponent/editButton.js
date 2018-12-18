import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../helper/constant';

export default EditBtn = (props) => {
    let appColor = props.appTheme && Constant[props.appTheme] || Constant[Constant.darkTheme];
        return(
            <TouchableOpacity onPress={props.onEditButtonPress}>
                <View style={[styles.editPostView,{backgroundColor:appColor.editPostBack}]}>
                    <Text style={[styles.editLabel,{color:appColor.editPostText}]} numberOfLines={1}>
                        {"EDIT"}
                    </Text>
                </View>
            </TouchableOpacity>
        )
}

const styles = StyleSheet.create({
    editPostView:{
        justifyContent:'center',
        height:19,
        borderRadius: 25,
        paddingRight:11,
        paddingLeft:11,
        marginLeft:5
    },
    editLabel:{
        fontSize:11,
        alignSelf: 'center',
        fontFamily: Constant.font700,
        backgroundColor: 'transparent'
    }
});