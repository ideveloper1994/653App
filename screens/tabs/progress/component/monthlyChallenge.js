import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../helper/constant'

export default class MonthlyChallenge extends React.PureComponent {

    render() {
        let data = this.props.cleanDayPerMonth;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {titleStyle, titleYear, container } = styles;
        return (
            <View style={{backgroundColor:appColor.scrollableViewBack}}>
                <Text style={[titleStyle,{color: appColor.defaultFont}]}>Challenges</Text>
                {
                    Object.keys(this.props.cleanDayPerMonth).map((mainKey,key)=>{
                        let obj = this.props.cleanDayPerMonth[mainKey];
                        let isAnyChallenge = this.props.cleanDayPerMonth[mainKey].monthArr.includes(100);
                        let currentYear = new Date().getFullYear().toString()
                        if(isAnyChallenge || (mainKey == currentYear && this.props.isRenderCurrentMonth)) {
                            return (
                                <View key={key}>
                                    <Text style={[titleYear, {color: appColor.verProgressBottomTitle}]}>{mainKey}</Text>
                                    <View style={{
                                        flexDirection: 'row', flexWrap: 'wrap', width: '86%',
                                        alignSelf: 'center', maxWidth: 600}}>
                                        {
                                            this.props.cleanDayPerMonth[mainKey].monthArr.map((obj, index) => {
                                                let currentMonth = new Date().getMonth();
                                                let iconType = "Y";
                                                if (this.props.isRenderCurrentMonth && currentMonth == index && mainKey == currentYear) {
                                                    iconType = "B";
                                                }else if (obj < 100) {
                                                    return null;
                                                }
                                                let width = ((Constant.screenWidth * 0.86) > 600) && 600 || Constant.screenWidth * 0.86;
                                                return (
                                                    <TouchableHighlight
                                                        onPress={() => this.props.onIconPress(mainKey, index, obj, iconType)}
                                                        underlayColor={"transparent"}
                                                        key={index}>
                                                        <View style={{
                                                            height: 65,
                                                            width: width / 4,
                                                            alignItems: 'center',
                                                            marginBottom: 25
                                                        }}>
                                                            <Image style={{height: 65, width: 63, alignSelf: 'center'}}
                                                                   resizeMode={'contain'}
                                                                   source={appColor.specialAchievementIcon[iconType][index]}/>
                                                            <Text style={{
                                                                top: 34,
                                                                fontSize: 7,
                                                                color: appColor.iconYearText[iconType],
                                                                position: 'absolute',
                                                                fontFamily: Constant.font700
                                                            }}>{mainKey}</Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            )
                        }
                    })
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '86%',
        alignSelf: 'center',
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        maxWidth:600,
    },
    titleStyle:{
        marginTop: 25,
        marginBottom: 20,
        color:'#FFF',
        fontSize:15,
        alignSelf:'center',
        fontFamily: Constant.font500,
    },
    titleYear:{
        marginBottom: 20,
        color:'#FFF',
        fontSize:14,
        fontFamily: Constant.font700,
        alignSelf:'center',
    }
});

// number={365} opacity={0.4} success={false}