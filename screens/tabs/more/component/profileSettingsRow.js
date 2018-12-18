import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import Constant from '../../../../helper/constant';
import TochableView from '../../../commonComponent/touchableView';

export default class ProfileRow extends React.PureComponent {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TochableView onPress={()=>this.props.goTo(this.props.viewName)}
                          pressInColor={appColor.pressInMoreRow}
                          backColor={appColor.moreRow}>
                <View style={styles.outerView}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <Image source={{uri:this.props.imageUrl}} style={ styles.iconImage }/>
                        <View style={ styles.outerTextView }>
                            <Text style={[styles.textDetail,{color: appColor.defaultFont}]}>
                                {this.props.rowTitle} </Text>
                            <Image source={{uri:'button_arrow'}}
                                   style={{width:9, height:15}}/>
                        </View>
                    </View>
                </View>
            </TochableView>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        flexDirection:'row',
        height: 78,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems:'center'
    },
    iconImage:{
        height:58,
        width:48
    },
    outerTextView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        flex:1,
        paddingLeft: 15,
    },
    textDetail:{
        flex:0.9,
        fontSize: 15,
        color: '#FFF',
        fontFamily: Constant.font500,
    },
});