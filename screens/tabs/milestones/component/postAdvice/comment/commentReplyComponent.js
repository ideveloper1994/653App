import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BtnEdit from '../../../subComponent/editButton';
import TimeClock from '../../../subComponent/timeDetail';

export default class CommentReply extends Component {

    onEditCommentPress = () => {
        this.props.onEditComment(this.props.rowData);
    }

    render() {
        const {container, textDetail, textName} = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {content, creator, created_at, hearts, user} = this.props.rowData;
        const porn_free_days = (creator && creator.stats) && creator.stats.porn_free_days.toString() || null;

        return (
            <View style={[container, {backgroundColor: this.props.isHighlited && appColor.teamDetailsRow || Constant.transparent}]}>
                <Image style={{height: 13,width:16, margin: 5, tintColor: appColor.commentReplyIcon}}
                       resizeMode="contain"
                       source={{uri:'comment_reply'}}/>
                <View style={{flex: 1}}>
                    <Text style={[textDetail, {color: appColor.defaultFont}]}>
                        {content}</Text>
                    <View style={{
                        paddingTop: 5, paddingBottom: 5, flexDirection: 'row',
                        justifyContent: 'flex-start', alignItems: 'center'
                    }}>
                        <TouchableHighlight underlayColor={Constant.transparent}
                                            onPress={() => this.props.onPressCommunityProfileIcon(creator)}>
                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                                <View style={{marginRight: 7}}>
                                    <Image style={{height: 18, width: 18, alignSelf: 'center'}}
                                           source={{uri:this.props.avtarImage}}/>
                                </View>
                                <Text style={[textName, {color: appColor.postAdviceRowBottomText}]}>
                                    {creator.is_current_user && "You" || creator.name}
                                </Text>
                            </View>
                        </TouchableHighlight>

                        {
                            (porn_free_days !== null) &&
                            <View style={[styles.totalPornDayView, {backgroundColor: appColor.comunityPornDayCount}]}>
                                <Text style={styles.pornDayLabel}
                                      numberOfLines={1}>
                                    {porn_free_days}
                                </Text>
                            </View>
                            || null
                        }
                        <TimeClock appTheme={this.props.appTheme}
                                   createdDate={created_at || ""}/>
                        {
                            (creator.is_current_user) &&
                            <BtnEdit appTheme={this.props.appTheme}
                                     onEditButtonPress={this.onEditCommentPress}/>
                            || null
                        }
                        <View style={{flex: 1}}/>
                        <TouchableHighlight underlayColor={Constant.transparent}
                                            onPress={() => this.props.onLikeComment(this.props.rowData)}
                                            style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={[styles.likeText, {color: appColor.postAdviceRowBottomText}]}>
                                    {hearts && hearts.count || "0"}
                                </Text>
                                <FontAwesome name={(user && user.has_hearted) ? 'heart' : 'heart-o'}
                                             size={20}
                                             color={(user && user.has_hearted) ?
                                                 Constant.heartColor : appColor.postAdviceRowBottomIcon}/>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 14,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "transparent",
        flexDirection: 'row',
        maxWidth: 600, alignSelf: 'center', width: '100%'
    },
    textDetail: {
        color: '#FFF',
        fontSize: 15,
        marginBottom: 5,
        fontFamily: Constant.font500,
        lineHeight: 23,
    },
    textName: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginRight: 12,
    },
    likeText: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginRight: 5,
        marginLeft: 13,
    },
    totalPornDayView: {
        justifyContent: 'center',
        backgroundColor: '#76c0bb',
        height: 18,
        borderRadius: 25,
        paddingRight: 11,
        paddingLeft: 11,
        maxWidth: 50,
        minWidth: 38
    },
    pornDayLabel: {
        fontSize: 11,
        color: '#FFF',
        alignSelf: 'center',
        fontFamily: Constant.font700,
        backgroundColor: 'transparent'
    },
});