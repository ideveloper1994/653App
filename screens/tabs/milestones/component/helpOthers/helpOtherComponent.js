import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';
import { getSmallAvatar } from '../../../../../helper/appHelper';
import CommentCount from './commentCount';
import TochableView from '../../../../commonComponent/touchableView';

export default class HelpOtherRow extends Component {

    constructor(props){
        super(props);
        this.state={
            opacity: 1,
        }
        this.props = props;
    }

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if(isCurrentUser){
            return getSmallAvatar(this.props.avatar_id || 0);
        }
        return getSmallAvatar(avatar_id || 0);
    };

    onReplyClicked = () => {
        this.props.onRowSelect(this.props.rowData);
    };

    onLikeClicked = () => {
        if(this.props.rowData.user.has_hearted){
            this.props.unlikeHelpPost(this.props.rowData.id);
        }else{
            this.props.likeHelpPost(this.props.rowData.id);
        }
    };

    //call with row data
    onEditPress = () => {
        this.props.onEditButtonPress(this.props.rowData);
    }

    onPressCommunityProfileIcon = () => {
        this.props.onPressCommunityProfileIcon(this.props.rowData.creator);
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const { rowContainer, textDetail } = styles;
        const {content, user, creator, comments, hearts, created_at} = this.props.rowData;
        return (
            <View style={[rowContainer,{backgroundColor:appColor.scrollableViewBack}]}>
                <TochableView onPress={()=>this.onReplyClicked()}
                              pressInColor={appColor.scrollableViewBack}
                              backColor={appColor.scrollableViewBack}>
                    <View>
                        <Text style={[textDetail,{color: appColor.defaultFont}]}>
                            {content}
                        </Text>
                    </View>
                </TochableView>
                <CommentCount opacity={this.state.opacity}
                              appTheme={this.props.appTheme}
                              onReplyClicked={this.onReplyClicked}
                              onLikeClicked={this.onLikeClicked}
                              isLiked = {(user) && user.has_hearted || false}
                              isCommented = {(user) && user.has_commented || false }
                              commentCount = {(comments) && comments.count || "0" }
                              avtarImage={this.getAvatarImage(creator && creator.avatar_id || 0, creator && creator.is_current_user || false)}
                              likeCount = { (hearts) && hearts.count || "0" }
                              creatorName={(creator && creator.is_current_user) && "You" || creator.name || ""}
                              porn_free_days={(creator.stats) && creator.stats.porn_free_days.toString() || null }
                              onEditButtonPress={this.onEditPress}
                              isAllowEdit={creator.is_current_user}
                              onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}
                              createdDate={created_at || ""}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        padding: 15,
        backgroundColor: Constant.backProgressBarColor,
        maxWidth:600,alignSelf:'center', width:'100%'
    },
    textDetail: {
        color: '#FFF',
        fontSize: 15,
        margin:5,
        fontFamily: Constant.font500,
        lineHeight: 23,
    }
});