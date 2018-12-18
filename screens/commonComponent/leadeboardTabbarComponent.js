import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableHighlight
} from 'react-native';

import Constant from '../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default class Tabbar extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            selectedTab: this.props.selectedTab,
        }
    }

    changeTabbar = (tabFlag) => {
        if(this.props.selectedTab != tabFlag){
            this.props.changeTab(tabFlag);
            if(tabFlag == 0){
                this.refs.view1.fadeInRight(300);
            }else if(tabFlag == 1){
                if(this.props.selectedTab == 0){
                    this.refs.view2.fadeInLeft(300);
                }else{
                    this.refs.view2.fadeInRight(300);
                }
            }else{
                this.refs.view3.fadeInLeft(300);
            }
        }
    };

    render() {
        return (
            <View style={ styles.mainTabView }>
                <Animatable.View ref="view1" style={ styles.amimatedView }>
                    <TouchableHighlight onPress={ ()=> this.changeTabbar(0) }
                                        underlayColor={Constant.transparent}>
                        <View style={[{ backgroundColor: (this.props.selectedTab == 0) ? Constant.lightBlueColor :  Constant.transparent},
                    styles.tabView ]}>
                            <Text style={[styles.tabbarText,{color:  (this.props.selectedTab == 0) ? '#FFF' : 'rgba(255,255,255,0.5)'}]}>
                                { this.props.titleTab1 }
                            </Text>
                        </View>
                    </TouchableHighlight>
                </Animatable.View>


                <Animatable.View ref="view2" style={ styles.amimatedView }>
                    <TouchableHighlight onPress={() => this.changeTabbar(1)}
                                        underlayColor={Constant.transparent}>
                        <View style={[{ backgroundColor:
                    (this.props.selectedTab == 1) ? Constant.lightBlueColor :  Constant.transparent},
                    styles.tabView ]}>
                            <Text style={[styles.tabbarText,{color:  (this.props.selectedTab == 1) ?
                        '#FFF' : 'rgba(255,255,255,0.5)'}]}>
                                { this.props.titleTab2 }
                            </Text>
                        </View>
                    </TouchableHighlight>
                </Animatable.View>

                <Animatable.View ref="view3" style={ styles.amimatedView }>
                    <TouchableHighlight onPress={() => this.changeTabbar(2) }
                                        underlayColor={Constant.transparent}>
                        <View style={[{ backgroundColor: (this.props.selectedTab == 2) ?
                    Constant.lightBlueColor :  Constant.transparent},styles.tabView ]}>
                            <Text style={[styles.tabbarText,{color:  (this.props.selectedTab == 2) ? '#FFF' : 'rgba(255,255,255,0.5)'}]}>
                                { this.props.titleTab3 }
                            </Text>
                        </View>
                    </TouchableHighlight>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainTabView: {
        backgroundColor: 'rgb(0,104,128)',//'rgba(28,102,126, 0.8)',//'#21526b',
        borderRadius: 50,
        marginBottom: 0,
        flexDirection: 'row',
        height:40,
        width:'86%',
        padding: 5,
        alignSelf:'center'
    },
    tabView:{
        paddingTop: 7,
        paddingBottom:7,
        justifyContent: 'center',
        borderRadius: 50,
        overflow:'hidden'
    },
    tabbarText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: Constant.font500,
    },
    amimatedView:{
        flex:1,
        // width:'43%',
        height:30
    }
});