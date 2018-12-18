import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TochableView from '../../../../../commonComponent/touchableView';

export default  class OptionSelection extends React.PureComponent {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <TochableView onPress={()=>this.props.onSelectOption(this.props.type,this.props.dbValue)}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={mainView}>
                    <Text style={[rowTitle, this.props.textColor && {color: this.props.textColor} || {}]}>
                        {this.props.title}
                    </Text>
                    {
                        (this.props.value == this.props.dbValue) ?
                            <Image source={{uri:'button_tick_black'}}
                                   style={{width:13, height:11,opacity:0.3}}/>
                            : null
                    }
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
        fontSize: 15,
        color: 'rgb(75,75,75)',
        fontFamily: Constant.font500,
        flex:1
    }
});