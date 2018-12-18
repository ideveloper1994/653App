import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Switch
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TochableView from '../../../../../commonComponent/touchableView';

export default  class SettingRowComponent extends React.PureComponent {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <TochableView onPress={()=>this.props.onRowSelect(this.props.rowData)}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={mainView}>
                    <Text style={[rowTitle,{color: (this.props.color) && this.props.color || '#4e4e4e'}]}>
                        {(this.props.rowData) && (this.props.rowData.title) && this.props.rowData.title || ""}
                    </Text>
                    {
                        (!this.props.rowData.isONlyText) ?
                            (this.props.rowData.isSwitch) ?
                                <Switch value={this.props.rowData.value}
                                        onValueChange={() => this.props.onRowSelect(this.props.rowData)}/>
                                :
                                <Image source={{uri:'button_arrow'}}
                                       style={{width:9, height:15}}/>
                            :
                            null
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
        fontSize: 14,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        flex:1
    }
});