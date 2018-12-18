import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import AchievementIcon from './teamAchivementIcon';
import Constant from '../../../../helper/constant'

export default class CommunityStatisctic extends React.PureComponent {

    renderButton = (item) => {
        return(
            <View>
            <View style={[styles.btnContainer,{backgroundColor:item.back}]}>
                <Text style={styles.textVal}>{ this.getStringVal(item.val) }</Text>
            </View>
                <Text style={[styles.detailTitle,{color:item.color}]}>{item.title}</Text>
            </View>
        )
    }

    getStringVal = (count) => {
        let strCount = count.toString() || "0";
        let finalVal = "";
        if(strCount.length > 3){
            var val1 = ((strCount.split("")).reverse()).join("");
            for(var i=0; i<val1.length; i++){
                if(i%3 == 0 && i!= 0){
                    finalVal += ",";
                }
                finalVal += val1.charAt(i);
            }
            var val11 = ((finalVal.split("")).reverse()).join("");
            return val11;
        }
        return strCount;
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const { titleStyle, container } = styles;
        let porn_days_conut = (this.props.teamGlobalStatistic && this.props.teamGlobalStatistic.porn_days) &&
            this.props.teamGlobalStatistic.porn_days.count || "0";
        let masturbation_days_conut = (this.props.teamGlobalStatistic && this.props.teamGlobalStatistic.masturbation_days) &&
            this.props.teamGlobalStatistic.masturbation_days.count || "0";
        return (
            <View>
                <Text style={[titleStyle,{color: appColor.defaultFont}]}>Community Statistics</Text>
                {this.renderButton({back:"rgb(91,196,189)", val:porn_days_conut,title:"Porn-free days", color: appColor.profileColor})}
                {this.renderButton({back:"rgb(121,112,255)", val:masturbation_days_conut,title:"Masturbation-free days", color: appColor.profileColor})}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '86%',
        height: 64,
        alignSelf: 'center',
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        maxWidth: 600
    },
    titleStyle:{
        color:'#FFF',
        fontSize:15,
        alignSelf:'center',
        fontFamily: Constant.font500,
    },
    btnContainer:{
        height: 54,
        backgroundColor:'red',
        paddingLeft:30,
        paddingRight:30,
        justifyContent:'center',
        alignSelf:'center',
        borderRadius: 27,
        marginTop:24
    },
    textVal:{
        color:'#FFF',
        fontSize:26,
        fontFamily: Constant.font700,
        textAlign:'center'
    },
    detailTitle:{
        fontSize:13,
        fontFamily: Constant.font500,
        textAlign:'center',
        marginTop: 8
    },
});