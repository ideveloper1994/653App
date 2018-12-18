import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import TitleComponent from '../../../../commonComponent/subTitle';
import Constant from '../../../../../helper/constant'

export default  class StreakComponent extends React.PureComponent {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{paddingTop:33}}>
                <TitleComponent title="My Statistics" color={appColor.defaultFont}/>
                <View style={ styles.mainView }>
                    <View style={ styles.innerView }>
                        <Text style={ styles.titleText }>Current clean streak</Text>
                        <Text style={ styles.valText }>{this.props.current_clean_streak}</Text>
                    </View>
                    <View style={ styles.innerView }>
                        <Text style={ styles.titleText }>Best clean streak</Text>
                        <Text style={ styles.valText }>{this.props.best_clean_streak}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        flex:1,
        height: 90,
        marginTop:10,
        borderRadius:10,
        backgroundColor:'rgb(42,111,134)',
        padding: 20,
        width:'84%',
        alignSelf:'center',
        justifyContent:'space-between'
    },
    innerView:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    titleText:{
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: Constant.font700,

    },
    valText:{
        color: 'rgb(138,236,128)',
        fontSize: 14,
        fontFamily: Constant.font700,
    }
});