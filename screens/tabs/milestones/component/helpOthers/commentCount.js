import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BtnEdit from '../../subComponent/editButton';
import TimeClock from '../../subComponent/timeDetail';

export default class LikeCount extends Component {

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {rowContainer, textDetail} = styles;
        return (
            <View style={rowContainer}>
                <View style={{
                    flex: 1,
                    padding: 5,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'}}>
                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={() => this.props.onPressCommunityProfileIcon()}>
                        <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <View>
                                <Image style={{height: 18, width: 18, alignSelf: 'center', opacity: this.props.opacity}}
                                       source={{uri:this.props.avtarImage}}/>
                            </View>
                            <Text style={[styles.textName, {
                                opacity: this.props.opacity,
                                color: appColor.postAdviceRowBottomText,
                                marginLeft: 7}]}>
                                {this.props.creatorName || ""}
                            </Text>
                        </View>
                    </TouchableHighlight>

                    {
                        (this.props.porn_free_days !== null) &&
                        <View style={[styles.totalPornDayView, {backgroundColor: appColor.comunityPornDayCount}]}>
                            <Text style={styles.pornDayLabel} numberOfLines={1}>
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
                                    onPress={() => {this.props.onLikeClicked()}}
                                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.textName, {
                            opacity: this.props.opacity,
                            color: appColor.postAdviceRowBottomText
                        }]}>
                            {this.props.commentCount + ""}
                        </Text>
                        <FontAwesome name={(this.props.isCommented) ? 'comment' : 'comment-o'}
                                     size={20}
                                     style={{marginTop: -3}}
                                     color={(this.props.isCommented) ? Constant.commentColor : appColor.postAdviceRowBottomIcon}/>

                    </View>
                </TouchableHighlight>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textDetail: {
        color: '#FFF',
        fontSize: 15,
        fontFamily: Constant.font500,
    },
    textName: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginLeft: 12,
        marginRight: 12,
        //backgroundColor: "#F00"
    },
    replyView: {
        height: 25,
        width: 60,
        backgroundColor: '#003e53',
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    replyText: {
        color: '#b8bfcf',//Constant.lightTheamColor,
        fontSize: 13,
        fontFamily: Constant.font500,
    },
    likeText: {
        color: Constant.lightTheamColor,
        fontSize: 15,
        fontFamily: Constant.font500,
        marginRight: 5,
    },
    totalPornDayView: {
        justifyContent: 'center',
        backgroundColor: '#76c0bb',
        height: 19,
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
    }
});