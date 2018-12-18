import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import TochableView from '../../../../../commonComponent/touchableView';

export default  class MultipleOptionSelection extends Component {

    render() {
        let title = (this.props.rowData !== undefined && this.props.rowData.title) ? (this.props.rowData.title.includes("yourself"))
            ? "Letters to Yourself" : this.props.rowData.title : "";
        const { mainView, rowTitle } = styles;
        return (
            (this.props.rowData !== undefined) &&
            <TochableView onPress={()=>this.props.onRowSelect(this.props.mainIndex, this.props.rowData)}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={mainView}>
                    <Text style={[rowTitle, this.props.textStyle && this.props.textStyle || {}]}>
                        {title}
                    </Text>
                    {
                        (this.props.rowData && this.props.rowData.isSelected) ?
                            <Image source={{uri:'button_tick_black'}}
                                   style={{width:13, height:11,opacity:0.3}}/>
                            : null
                    }
                </View>
            </TochableView>|| null
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