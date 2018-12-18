import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../helper/constant';
import {resetAllAsyncStorageData, showThemeAlert} from "../../../helper/appHelper";
import TochableView from '../../commonComponent/touchableView';

export default  class RoutineListItem extends React.PureComponent {

    onActivityClicked = () => {
        if(!this.props.isActiveDot){
            this.props.onSelectExercises(this.props.pageName, true)
        }else{
            showThemeAlert({
                title: "Complete the morning routine first",
                message: "Start by completing your entire morning routine. Then you can redo individual exercises.",
                leftBtn: "Okay"
            });
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <TochableView onPress={()=>this.onActivityClicked()}
                          pressInColor={appColor.cardSubSection}
                          backColor={appColor.cardSubSection}
                          style={{borderRadius:5}}>
                <View style={styles.outerBottomView}>
                    <View style={styles.listItem}>
                        <Image style={styles.iconListView}
                               source={{uri:this.props.icon}}/>
                        <View style={{flex:5,justifyContent:'center',paddingLeft:16}}>
                            <Text style={[styles.titleText,{color: appColor.defaultFont}]}>
                                {this.props.name}</Text>
                        </View>
                        {
                            (this.props.isActiveDot) ?
                                <View style={{flex:2,justifyContent:'center'}}>
                                    <View style={{height:10,alignSelf:'flex-end',
                                        justifyContent:'center',width:10,borderRadius:5,backgroundColor:Constant.activeColor}}/>
                                </View>
                                :
                                <View style={{flex:2,justifyContent:'center'}}>
                                    <Image source={appColor.replayMorningRoutine}
                                           style={{height:28, width:28, alignSelf:'flex-end'}}
                                           resizeMode={"contain"}
                                    />
                                </View>
                        }
                    </View>
                </View>
            </TochableView>
        );
    }
}

const styles = StyleSheet.create({
    listItem:{
        flexDirection:'row',
        borderRadius:13,
        flex:1,
        padding:0
    },
    outerBottomView:{
        flexDirection:'row',
        borderRadius:13,
        paddingTop:16,
        paddingLeft: 16,
        paddingRight: 21,
    },
    iconListView:{
        height:28,
        width:28
    },
    titleText:{
        color: 'white',
        fontSize: 13,
        fontFamily: Constant.font500,
    }
});