import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image
} from 'react-native';
import Constant from '../../../../helper/constant';
import {getTimeFromMS} from "../../../../helper/appHelper";

export default TimeView = (props) => {
    let appColor = props.appTheme && Constant[props.appTheme] || Constant[Constant.darkTheme];
    const dateString = props.createdDate && getTimeFromMS(props.createdDate) || "";
    return(
        <View style={styles.mainView}>
            <Image style={styles.icon}
                   source={appColor.communityClock}/>
            <Text style={[styles.txtTime,{color:appColor.postAdviceRowBottomIcon}]} numberOfLines={1}>
                {dateString}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView:{
        marginLeft:10,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight:5,
    },
    icon:{
        height:10,
        width:10,
    },
    txtTime:{
        marginLeft:3,
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
    }
});