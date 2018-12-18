import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import ProgressBar from './animatedProgressBar';
import { getSmallAvatar } from '../../../../../../helper/appHelper';

export default  class TeamDetailRow extends React.PureComponent {

    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps){
    }

    getAvatarImage = (avatarId) => {
        return getSmallAvatar(avatarId);
    };

    render() {
        return (
            <View style={{width:'100%', alignSelf: 'center', marginBottom: 26}}>
                <View style={{ flexDirection: 'row', marginBottom: 16}}>
                    <Image resizeMode="contain"
                           source={{uri:this.getAvatarImage(this.props.rowData.avatarId)}}
                           style={{ height: 22, width:22}}/>
                    <View style={{ flexDirection: 'row', flex:1}}>
                        <Text style={{ fontSize:15, color:'#FFF', marginLeft: 10,fontFamily: Constant.font500}}>
                            {this.props.rowData.name || ""}</Text>
                        <Text style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginLeft: 8,fontFamily: Constant.font300, paddingTop:3}}>
                            {this.props.rowData.team || ""}</Text>
                    </View>
                    <View style={{ justifyContent:'center',width:46, backgroundColor:Constant.orangeColor,height:24, borderRadius: 5 }}>
                        <Text style={{ fontSize:12, color:'#FFF', alignSelf: 'center',fontFamily: Constant.font700}}>
                            {this.props.rowData.count || ""}
                        </Text>
                    </View>
                </View>
                <ProgressBar progressVal={this.props.rowData.per}
                             fillBarColor={ Constant.greenColor }
                             otherColor="#026485"
                             barWidth={this.props.width}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    streakText:{
        color: '#FFF',
        paddingRight: 10,
        fontSize:12,
        fontFamily: Constant.font500,
    },
    streakVal:{
        color: '#0F0',
        paddingRight: 10,
        fontWeight: '500',
        fontSize:12,
        fontFamily: Constant.font500,
    }
});