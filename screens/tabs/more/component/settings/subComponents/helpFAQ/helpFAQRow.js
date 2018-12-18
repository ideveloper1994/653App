import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import HelpRowAnsComponent from './helpFAQAnsRow';
import TochableView from '../../../../../../commonComponent/touchableView';

export default  class HelpRowComponent extends React.PureComponent {

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <View>
                <TochableView onPress={()=>this.props.onRowSelect(this.props.index)}
                              pressInColor={Constant.settingRowPressIn}
                              backColor={'#fff'}>
                    <View style={mainView}>
                        <Text style={rowTitle}>
                            {this.props.rowData.question || ""}
                        </Text>
                    </View>
                </TochableView>
                {
                    (this.props.selectedIndex == this.props.index) &&
                    <HelpRowAnsComponent txtDetail={this.props.rowData.answer || ""}/>
                    || null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        height:80,
        paddingLeft: 20,
        paddingRight: 20,
        flex:1,
        justifyContent: 'center',
    },
    rowTitle:{
        fontSize: 15,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
    }
});