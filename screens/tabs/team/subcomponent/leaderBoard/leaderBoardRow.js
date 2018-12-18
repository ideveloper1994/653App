import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../../../helper/constant';

export default  class LeaderBoardRow extends React.PureComponent {

    constructor(props){
        super(props);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {is_current_user, rank, isTeam, teamProfile, count, userImage, name} = this.props;
        return (
            <View style={{ flexDirection: 'row',marginLeft: 15, marginRight:15, paddingLeft:5, paddingRight:5,
                height:60, alignItems: 'center', marginTop: 8, marginBottom: 8, borderRadius: 10,
                backgroundColor: (is_current_user) ? appColor.leaderboardRowBackColor : Constant.transparent,
                maxWidth:600, alignSelf:'center'}}>
                <Text style={{
                    fontSize: (rank && rank.toString().length >= 4) && 10|| 15, color:appColor.leaderBoradRank,
                    width:38, fontFamily: Constant.font500}} numberOfLines={1}> {
                    rank && (rank.toString()) || ""
                }</Text>
                {
                    (isTeam) &&
                    <View style={{ height: 30, width:30, backgroundColor: Constant.orangeColor, borderRadius: 15,
                        justifyContent:"center", alignItems: "center", overflow:'hidden'}}>
                        <Text style={{ fontSize:12, color: '#FFF',fontFamily: Constant.font700}}
                              numberOfLines={1}>
                            {teamProfile}
                        </Text>
                    </View>
                    ||
                    <Image resizeMode="contain"
                           source={{uri:userImage}}
                           style={{ height: 30, width:30}}/>
                }
                <Text style={{ fontSize:15, color: (is_current_user) ? 'rgb(10,195,188)' : appColor.defaultFont, marginLeft: 14,
                    fontFamily: Constant.font500, flex:1}} numberOfLines={1}>
                    {(name)}</Text>
                <View style={{ justifyContent:'center',width:60, height:30,
                    backgroundColor: '#77c1bc', borderRadius: 5 }}>
                    <Text style={{ fontSize:13, color:'#FFF',
                        alignSelf: 'center',fontFamily: Constant.font700, }}>
                        {count}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});