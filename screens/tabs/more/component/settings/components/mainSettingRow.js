import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Switch,
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TochableView from '../../../../../commonComponent/touchableView';

export default  class SettingRowComponent extends Component {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <TochableView onPress={()=>this.props.onRowSelect(this.props.rowData)}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={mainView}>
                    {
                        (this.props.icon) &&
                        <View style={{ height: 28, width:28, backgroundColor:this.props.icon.backColor, borderRadius: 5,
                            justifyContent:"center", alignItems: "center",marginRight:10}}>
                            <Image resizeMode="contain"
                                   source={this.props.icon.iconImg}
                                   style={{ height: this.props.icon.imgsize , width:this.props.icon.imgsize}}/>
                        </View>
                        || null
                    }
                    <Text style={rowTitle}>
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
        //backgroundColor: '#FFF',
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