import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';
import Octicons from 'react-native-vector-icons/Octicons';
import TochableView from '../../../../commonComponent/touchableView';

export default  class EntryRow extends Component {

    render() {
        const { mainView, titleText, roundView, roundText, viewDetail, detailText, viewIcon, viewSeparator } = styles;
        const {formatedDate, color, day, data, key } = this.props.rowData;

        return (
            <TochableView onPress={()=>this.props.onRowSelect(this.props.rowData)}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={mainView}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={roundView}>
                            <Text style={roundText}>{ day }</Text>
                        </View>
                        <View style={viewDetail}>
                            <Text style={titleText}>{ formatedDate }</Text>
                            <Text style={detailText} numberOfLines={1}>{ (data == "" || data === '@@@') ? "Write about your day" : data  }</Text>
                        </View>
                        <View style={viewIcon}>
                            <Octicons name='primitive-dot' style={{alignSelf:'center'  }}
                                      size={20}
                                      color={color}
                            />
                        </View>
                    </View>
                    <View style={viewSeparator} />
                </View>
            </TochableView>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        justifyContent: 'center',
    },
    roundView:{
        backgroundColor: Constant.lightBlueColor,
        margin:15, width: Constant.screenWidth*0.12,
        height: Constant.screenWidth*0.12,
        borderRadius: (Constant.screenWidth*0.12)/2,
        justifyContent:'center',
        alignItems:'center'
    },
    roundText:{
        fontSize: 17,
        color: '#FFF',
        fontFamily: Constant.font700,
    },
    viewDetail:{
        flex:1,
        justifyContent:'center'
    },
    titleText:{
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#4e4e4e'

    },
    detailText:{
        fontSize: 12,
        paddingTop:3,
        color:'#898c8f',
        fontFamily: Constant.font500,
        marginRight:5,
    },
    viewSeparator: {
        width:'100%',
        height: 1,
        backgroundColor:  Constant.grayBackground
    },
    viewIcon:{
        justifyContent:'center',
        paddingRight: 10
    },
});
