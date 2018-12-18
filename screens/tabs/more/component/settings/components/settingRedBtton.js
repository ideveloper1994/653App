import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TochableView from '../../../../../commonComponent/touchableView';

export default  class SettingRowComponent extends React.PureComponent {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <TochableView onPress={()=>this.props.onPress()}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={styles.mainView}>
                    <Text style={[styles.rowTitle]}>
                        {this.props.title}
                    </Text>
                </View>
            </TochableView>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        alignItems: 'center',
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        height:45,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    rowTitle:{
        fontSize: 14,
        color: '#f00',
        fontFamily: Constant.font500,
        flex:1
    }
});