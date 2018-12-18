import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant'
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import BtnEdit from '../../subComponent/editButton';
import TimeClock from '../../subComponent/timeDetail';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

export default class LikeCount extends Component {

    constructor(props){
        super(props);
        this.state={
            isLiked:this.props.isLiked
        };
    }

    likeClicked = () => {
        ReactNativeHapticFeedback.trigger('selection');
        if(!this.props.isLiked){
            this.props.likePostMethod(this.props.id);
        }
        else {
            this.props.unlikePostMethod(this.props.id)
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={styles.rowContainer}>
                <View style={{flex:1,padding:5,flexDirection:'row',justifyContent:'flex-start',alignItems: 'center'}}>
                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={() => this.props.onPressCommunityProfileIcon()}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{marginRight:7}}>
                                <Image style={{height:18,width:18,alignSelf:'center'}}
                                       source={{uri:this.props.avtarImage}}/>
                            </View>
                            <Text style={[styles.textName,{color:appColor.postAdviceRowBottomText}]}>
                                {this.props.avtarName}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    {
                        (this.props.porn_free_days !== null) &&
                        <View style={[styles.totalPornDayView,{backgroundColor:appColor.comunityPornDayCount}]}>
                            <Text style={styles.pornDayLabel}
                                  numberOfLines={1}>
                                {this.props.porn_free_days}
                            </Text>
                        </View>
                        || null
                    }

                    <TimeClock appTheme={this.props.appTheme}
                               createdDate={this.props.createdDate || ""}/>
                    {
                        (this.props.isAllowEdit) &&
                        <BtnEdit appTheme={this.props.appTheme}
                                 onEditButtonPress={this.props.onEditButtonPress}/>
                        || null
                    }
                </View>

                <TouchableHighlight underlayColor={Constant.transparent}
                                    onPress={() => {this.props.onAdviceRowSelect(this.props.rowData)}}
                                    style={{flexDirection:'row',justifyContent:'flex-end'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={[styles.commentText,{color: appColor.postAdviceRowBottomText}]}>
                            {this.props.commentCount || "0"}
                        </Text>
                        <FontAwesome name={(this.props.isCommented)?'comment':'comment-o'}
                                     size={20}
                                     style={{ marginRight:18, marginTop: -3}}
                                     color={(this.props.isCommented)?Constant.commentColor: appColor.postAdviceRowBottomIcon}/>

                    </View>
                </TouchableHighlight>

                <TouchableHighlight underlayColor={Constant.transparent}
                                    onPress={() => {this.likeClicked()}}
                                    style={{flexDirection:'row',justifyContent:'flex-end'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={[styles.likeText,{color: appColor.postAdviceRowBottomText}]}>
                            {this.props.likeCount.toString()}
                        </Text>
                        <FontAwesome name={(this.props.isLiked)?'heart':'heart-o'}
                                     size={20}
                                     color={(this.props.isLiked)? Constant.heartColor: appColor.postAdviceRowBottomIcon}/>

                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textName: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginRight: 12,
        alignSelf:'center'
    },
    likeText: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginRight: 5
    },
    commentText: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginLeft:5,
        marginRight: 5
    },
    totalPornDayView:{
        justifyContent:'center',
        backgroundColor:'#76c0bb',
        height:18,
        borderRadius: 25,
        paddingRight:11,
        paddingLeft:11,
        maxWidth:50,
        minWidth:38
    },
    pornDayLabel:{
        fontSize:11,
        color:'#FFF',
        alignSelf: 'center',
        fontFamily: Constant.font700,
        backgroundColor: 'transparent'
    }
});