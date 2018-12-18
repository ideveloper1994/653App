import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';
import TochableView from '../../../../commonComponent/touchableView';

export default class AudioRow extends React.PureComponent {
    render() {
        const {
            mainView,
            titleText,
            roundView,
            roundText,
            viewDetail,
            viewIcon,
            viewSeparator
        } = styles;

        return (
            <TochableView onPress={()=>this.props.onRowSelect(this.props.rowData)}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={mainView}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <View style={roundView}>
                            <Text style={roundText}>{this.props.rowData.audioNo}</Text>
                        </View>
                        <View style={viewDetail}>
                            <Text style={titleText}>
                                {(this.props.rowData) && (this.props.rowData.title) && this.props.rowData.title || ""}
                            </Text>
                        </View>
                        {(this.props.rowData.isLock && (
                            <View style={viewIcon}>
                                <Image source={{uri:'lock'}}
                                    style={{ height: 16, width: 14 }}
                                />
                            </View>
                        )) ||
                        null}
                    </View>
                    <View style={viewSeparator} />
                </View>
            </TochableView>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        height: 82,
        flex: 1
    },
    roundView: {
        backgroundColor: '#76c0bc', //'rgb(49,165,159)',
        marginLeft: 16,
        marginRight: 15,
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center'
    },
    roundText: {
        fontSize: 17,
        color: '#FFF',
        fontFamily: Constant.font700
    },
    viewDetail: {
        flex: 1,
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#4e4e4e'
    },
    viewSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: Constant.grayBackground
    },
    viewIcon: {
        justifyContent: 'center',
        marginLeft: 16,
        marginRight: 16
    }
});
