import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Switch,
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import TochableView from '../../../../../../commonComponent/touchableView';

export default  class SettingRowComponent extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            backColor:"#FFF",
        };
    }

    onRowSelect = () => {
        setTimeout(()=>{
            this.props.onRowSelect(this.props.rowIndex);
        },10);
    };

    render() {
        const { mainView, rowTitle } = styles;
        return (
            <TochableView onPress={()=>this.onRowSelect()}
                          pressInColor={Constant.settingRowPressIn}
                          backColor={'#fff'}>
                <View style={[mainView,{backgroundColor:this.state.backColor}]}>
                    {
                        (this.props.imageText) &&
                        <View style={{ height: 28, width:28, backgroundColor: Constant.verColor, borderRadius: 5,
                            justifyContent:"center", alignItems: "center",marginRight:10}}>

                            <Text style={{ fontSize:14, color: '#FFF',fontFamily: Constant.font700}}
                                      numberOfLines={1}>
                                    {this.props.imageText}
                            </Text>
                        </View>
                        || null

                    }
                    <Text style={styles.rowTitle}>
                        {this.props.title}
                    </Text>
                    <Image source={{uri:'button_arrow'}}
                           style={{width:9, height:15}}/>

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
    },
    rightText:{
        fontSize: 15,
        color: 'rgb(166,166,166)',
        fontFamily: Constant.font500,
    },
});