import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';
import ProgressBar from '../../../../commonComponent/progressBar';
import { getSmallAvatar } from '../../../../../helper/appHelper';

export default  class TeamDetailRow extends React.PureComponent {

    constructor(props){
        super(props);
    }

    getAvatarImage = (memberDetail) => {
        if(memberDetail.is_current_user){
            return getSmallAvatar(this.props.avatar_id, this.props.gender);
        }
        return getSmallAvatar(memberDetail.avatar_id);
    };

    onButtonPress = () => {
        if(this.props.type == "Encourage" && !this.props.isAlreadySend){
            this.props.onPressEncourage(this.props.memberDetail);
        }else if(this.props.type == "Congratulate"){
            this.props.onPressCongratulate(this.props.memberDetail, this.props.objCongratulate);
        }
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const totalDays = (this.props.memberDetail.porn_free_days.total != undefined) ? this.props.memberDetail.porn_free_days.total : 0;
        const currentStreak = (this.props.memberDetail.porn_free_days.current_streak != undefined) ?
            this.props.memberDetail.porn_free_days.current_streak : this.props.memberDetail.porn_free_days.streaks.current;
        const longestStreak = (this.props.memberDetail.porn_free_days.longest_streak != undefined) ?
            this.props.memberDetail.porn_free_days.longest_streak : this.props.memberDetail.porn_free_days.streaks.longest;
        const message = (this.props.objCongratulate && this.props.objCongratulate.days == 1) && " 24 hours!" ||
            (this.props.objCongratulate) && this.props.objCongratulate.days + " days!";

        return (
            <View style={{marginTop: 10,maxWidth:600, backgroundColor: (this.props.type != "") && appColor.teamDetailsRow
                || Constant.transparent, alignItems:'center', width: Constant.screenWidth,alignSelf: 'center'}}>
                <View style={{width: '88.8%',marginBottom:16, marginTop:16}}>
                <View style={{ flexDirection: 'row', marginBottom: 15}}>

                    <TouchableOpacity style={{flex:1,flexDirection: 'row'}}
                                      onPress={()=> this.props.onPressCommunityProfileIcon(this.props.memberDetail)}>

                    <Image resizeMode="contain"
                           source={{uri:this.getAvatarImage(this.props.memberDetail)}}
                           style={{ height: 24, width:24}}/>

                    <View style={{ alignItems:'center', paddingRight:20, flexDirection: 'row'}}>
                        <Text style={{ fontSize:15, color:(this.props.memberDetail.is_current_user)&&"#04c3f9" || appColor.defaultFont,
                            marginLeft: 14,fontFamily: Constant.font500}} numberOfLines={1}>
                            {this.props.memberDetail.name}</Text>
                    </View>
                    </TouchableOpacity>
                    <View style={{flex:1}}/>
                    <View style={{alignItems:'flex-end'}}>
                        <View style={{ justifyContent:'center',width:52, backgroundColor:'#76c0bb',height:24,
                            borderRadius: 12 }}>
                            <Text style={{ fontSize:12, color:'#FFF', alignSelf: 'center',
                                fontFamily: Constant.font700, backgroundColor: 'transparent'}}
                                  numberOfLines={1}>
                                {
                                    (this.props.memberDetail.is_current_user) ?
                                    this.props.total_p_clean_days
                                    : totalDays.toString() || "0"  }
                            </Text>
                        </View>
                    </View>
                </View>

                <ProgressBar progressVal={this.props.memberDetail.progressVal}
                             fillBarColor={ Constant.greenColor }
                             otherColor={appColor.rewiredprogressBarOtherColor}/>
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <Text style={[styles.streakText,{color: appColor.defaultFont}]}>Current streak</Text>
                    <Text style={[styles.streakVal,{color:appColor.streackCountText}]}>
                        {(this.props.memberDetail.is_current_user) ? this.props.current_p_clean_days
                            : currentStreak.toString() || "0" }
                    </Text>
                    <Text style={[styles.streakText,{paddingLeft:18, color: appColor.defaultFont}]}>
                        Best streak</Text>

                    <Text style={[styles.streakVal,{color:appColor.streackCountText}]}>
                        {(this.props.memberDetail.is_current_user) ?
                            this.props.best_p_clean_days
                            :longestStreak.toString() || "0" }
                    </Text>
                </View>
                    {(this.props.type != "") &&
                    <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                        <Text style={[styles.streakText, {
                            color: appColor.defaultFont,
                            flex: 1,
                            fontFamily: Constant.font700}]}>
                            {(this.props.type == "Encourage") && this.props.memberDetail.name + " missed his checkup" ||
                            this.props.memberDetail.name + " has been clean for " + message
                            }
                        </Text>
                        <TouchableOpacity onPress={() => this.onButtonPress()}>
                            <View style={{alignItems: 'flex-end'}}>
                                <View style={{
                                    justifyContent: 'center',
                                    width: 102,
                                    backgroundColor: (this.props.type == "Encourage") &&
                                    Constant.orangeColor || Constant.lightBlueColor,
                                    opacity: this.props.isAlreadySend && 0.5 || 1,
                                    height: 34,
                                    borderRadius: 17
                                }}>
                                    <Text style={{fontSize: 12, color: '#FFF', alignSelf: 'center',
                                        fontFamily: Constant.font700, backgroundColor: 'transparent'}}
                                          numberOfLines={1}>
                                        {this.props.type}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
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