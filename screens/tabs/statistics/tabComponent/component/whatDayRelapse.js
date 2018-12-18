import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant';
import TitleComponent from '../../../../commonComponent/subTitle';
import RelapseTamperedComponent from '../subcomponents/relapseTampered';
import SubCellComponent from '../../../../commonComponent/progressBarVer';
const Week=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];


export default  class WhatDayRelapseComponent extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            currentSelectedItem:15
        }
    }
    barClicked = (selectedindex) => {
        this.setState({
            currentSelectedItem:selectedindex
        });
    };
    render() {

        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={styles.container}>
                <TitleComponent title="What Days I Relapse" color={appColor.defaultFont}/>
                <View style={styles.outerView}>
                    {
                        this.props.relapsed_days_per_weekdays.map((obj,index) => {
                            return <SubCellComponent progressVal = {obj}
                                                     title = {Week[index]}
                                                     progressbarColor = {Constant.orangeProgressBarColor}
                                                     progressbarTintColor={Constant.verOrangeColor}
                                                     progressbarBackColor={appColor.verProgressbarOrangeBack}
                                                     barClicked={this.barClicked}
                                                     selectedindex={this.state.currentSelectedItem}
                                                     currentIndex={index}
                                                     appTheme={this.props.appTheme}
                                                     key={index}
                                    />
                        })
                    }
                </View>
                <RelapseTamperedComponent appTheme={this.props.appTheme}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:40,
    },
    outerView:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
        width:'86.7%'
    }
});