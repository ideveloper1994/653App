import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../helper/constant';
const HEADER_MAX_HEIGHT = 358;

export default About = (props) => {
    return(
        <View style={[styles.container,{backgroundColor:props.appColor.textInputBackColor,
            paddingTop: HEADER_MAX_HEIGHT+props.safeAreaInsetsDefault.top}]}>
            {
                (props.memberDetail && (props.memberDetail.biography == null || props.memberDetail.biography == "")) &&
                <Text style={[styles.placeHolderText,{color:props.appColor.profileColor}]}>
                    {(props.isCurrentUser) && "Tell the Brainbuddy community about yourself!" || "There's nothing here."}
                </Text> ||
                <View style={{padding:20, marginTop:5}}>
                    <Text style={[styles.bioText, {color:props.appColor.defaultFont}]}>
                        {props.memberDetail && props.memberDetail.biography || "There's nothing here."}
                    </Text>
                </View>
            }
            {
                (props.isCurrentUser && props.memberDetail) &&
                <TouchableOpacity style={[styles.button,{backgroundColor:props.appColor.poastButton}]}
                                  onPress={()=>props.onUpdateBiography()}>
                    <Text style={styles.buttonText}>
                        {(props.memberDetail && (props.memberDetail.biography == null || props.memberDetail.biography == "")) &&
                        "Add story" || "Edit"}</Text>
                </TouchableOpacity>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        height: 'auto',
        backgroundColor:Constant.backProgressBarColor,
        alignItems:'center',
        paddingBottom: 50,
    },
    placeHolderText:{
        marginTop: 45,
        textAlign:'center',
        fontSize: 15,
        fontFamily: Constant.font500,
        maxWidth: 280,
        lineHeight:21
    },
    button:{
        height:32,
        marginTop:15,
        borderRadius: 16,
        justifyContent:'center',
        paddingRight:20,
        paddingLeft:20,
        backgroundColor:Constant.backColor
    },
    buttonText:{
        color: '#fff',
        fontSize: 12,
        fontFamily: Constant.font500,
    },
    bioText:{
        fontSize: 15,
        fontFamily: Constant.font500,
        lineHeight:21
    },
});