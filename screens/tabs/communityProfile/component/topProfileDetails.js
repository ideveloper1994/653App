import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../helper/constant';
import { getAvatar } from '../../../../helper/appHelper';
import CleanDaysView from '../../../commonComponent/cleanButton';

export default communityProfileTop = (props) => {
    return(
        <View style={{paddingTop:55, alignItems:'center', backgroundColor:props.appColor.appBackground}}>
            <Image resizeMode="contain" style={{height:70,width:70}}
                   source={{uri:getAvatar(props.userData.avatar_id)}} />
            <Text style={[{color:'#FFF',fontSize:15,marginTop: 12,marginBottom:12, fontFamily: Constant.font500},{color:props.appColor.defaultFont}]}>
                {props.userData.name}</Text>
            <CleanDaysView total_p_clean_days={props.userData.porn_free_days.total || "0"}/>
            <View style={styles.mainView}>
                <View style={styles.innerView}>
                    <Text style={ styles.titleText }>Current streak</Text>
                    <Text style={[styles.valText,{color:props.appColor.defaultFont}]}>
                        {
                            props.isCurrentUser && props.currentStreak+"" || props.userData.porn_free_days.current_streak+""
                        }
                    </Text>
                </View>
                <View style={styles.innerView}>
                    <Text style={ styles.titleText }>Best streak</Text>
                    <Text style={[styles.valText,{color:props.appColor.defaultFont}]}>
                        {props.userData.porn_free_days.longest_streak+"" || "0"}</Text>
                </View>
                <View style={styles.innerView}>
                    <Text style={ styles.titleText }>Hearts</Text>
                    <Text style={[styles.valText,{color:props.appColor.defaultFont}]}>
                        {props.userData.hearts_count || "0"}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView:{
        paddingTop: 26,
        width:312,
        alignSelf:'center',
        flexDirection:'row',
    },
    innerView:{
        width:104,
        alignItems:'center',
    },
    titleText:{
        color: '#a3b0b6',
        fontSize: 12,
        fontFamily: Constant.font500,
        textAlign: 'center'

    },
    valText:{
        color: '#FFFFFF',
        paddingTop:9,
        fontSize: 24,
        fontFamily: Constant.font700,
        textAlign:'center'
    }
});