import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class TotalCleanDayComponent extends React.PureComponent {

    render() {
        return (
            <View style={{flex:1,backgroundColor:this.props.backColor, marginBottom:8}}>
                {
                    (this.props.topPopup.isMidNight) &&
                    <View style={{
                marginTop:30, backgroundColor: this.props.topPopup.backColor,
                borderRadius: 5, height:26, alignSelf:'center', paddingLeft:10, paddingRight:10,
                justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color: '#FFF',
                            fontSize: 12,
                            textAlign: 'center',
                            fontFamily: Constant.font700,}}>
                            {this.props.topPopup.topText}
                        </Text>
                    </View>
                    ||
                    <View style={{paddingTop:38}}>
                        <Text style={{color: '#c8e9e6',
                            fontSize: 15,
                            alignSelf:'center',
                            fontFamily: Constant.font500,}}>
                            Total clean days
                        </Text>
                    </View>
                }

                <View style={ styles.outerView }>
                    <Text style={ styles.centerText }>
                        { (this.props.no_of_porn_clean_day  == 1) && this.props.no_of_porn_clean_day + " day"
                        || this.props.no_of_porn_clean_day + " days"}
                    </Text>
                </View>
                <View style={ styles.mainView }>
                    <View style={ styles.innerView }>
                        <Text style={ styles.titleText }>Current streak</Text>
                        <Text style={ styles.valText }>{this.props.current_clean_streak}</Text>
                    </View>
                    <View style={ styles.innerView }>
                        <Text style={ styles.titleText }>Best streak</Text>
                        <Text style={ styles.valText }>{this.props.best_clean_streak}</Text>
                    </View>
                </View>

                { this.props.isBtnLeadeBoard &&
                <View style={{paddingBottom:23,paddingTop: (Constant.isIOS) && 25 || 27}}>
                    <TouchableOpacity onPress={()=>this.props.leaderBoardClicked()}
                                      style={[styles.btnLogin,{backgroundColor: 'rgb(56,167,160)'},]}>
                        <View>
                            <Text style={styles.btnFont}>
                                View leaderboard
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                ||

                <View style={{marginBottom:23,marginTop:27, height: 32}}/>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewCircle:{
        backgroundColor:Constant.lightBlueColor,
        width:90,
        height:90,
        borderRadius: 45,
        justifyContent:'center',
        alignItems:'center',
    },
    outerView:{
        alignItems:'center',
        marginTop:5,
    },
    centerText:{
        color: '#FFFFFF',
        fontSize: 36,
        alignSelf:'center',
        fontFamily: Constant.font700,
    },
    bottomText:{
        color: '#FFFFFF',
        fontSize: 36,
        alignSelf:'center',
        fontFamily: Constant.font700,

    },
    mainView:{
        flex:1,
        paddingTop: 25,
        width:'84%',
        alignSelf:'center',
        justifyContent:'space-around',
        flexDirection:'row',
    },
    innerView:{
        justifyContent:'space-between',
    },
    titleText:{
        color: '#c8e9e6',
        fontSize: 12,
        fontFamily: Constant.font500,

    },
    valText:{
        color: '#FFFFFF',
        paddingTop:7,
        fontSize: 24,
        fontFamily: Constant.font700,
        textAlign:'center'
    },
    btnLogin:{
        alignSelf: 'center',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        paddingTop: 10,
        paddingBottom: 10,
        maxWidth: 226
    },
    btnFont:{
        fontSize: 12,
        fontFamily: Constant.font500,
        color: '#FFF'
    }

});