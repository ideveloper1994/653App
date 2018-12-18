import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import Constant from '../../helper/constant';

export default CleanDays = (props) => {
    return(
        <View style={[styles.btnLogin,{backgroundColor: 'rgb(90,194,188)'}]}>
            <View>
                <Text style={[styles.btnFont, {color: 'white'}]}
                      numberOfLines={1}>
                    {
                        (props.total_p_clean_days ===1) &&
                        props.total_p_clean_days + " DAY CLEAN"
                        ||
                        props.total_p_clean_days + " DAYS CLEAN"
                    }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnLogin:{
        alignSelf: 'center',
        height:32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingRight:20,
        paddingLeft:20
    },
    btnFont:{
        fontSize: 12,
        fontFamily: Constant.font700,
    },
});