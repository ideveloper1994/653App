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

export default  class DoNotDisturb extends Component {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <TochableView onPress={()=>this.props.onRowSelect()}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={mainView}>
                    <Text style={rowTitle}>
                        {"From\nTo"}
                    </Text>
                    <Text style={{ fontSize: 14,fontFamily:Constant.font500,color:'rgb(0,122,255)', textAlign:'right'}}>
                        {this.props.title}
                    </Text>
                    <Image source={{uri:'button_arrow'}}
                           style={{width:9, height:15, marginLeft:10}}/>
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