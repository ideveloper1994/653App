import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant'
import LikeCount from './likeCount';
import TochableView from '../../../../commonComponent/touchableView';
import {getSmallAvatar} from "../../../../../helper/appHelper";

export default class PostAdviceRow extends Component {

    constructor(props){
        super(props);
        this.state={
            opacity: 1,
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false
    //     }
    // }

    likePostMethod = (id) => {
        this.props.likePostMethod(id)
    };

    unlikePostMethod = (heartId) => {
        this.props.unlikePostMethod(heartId)
    };

    //call with row data
    onEditPress = () => {
        this.props.onEditButtonPress(this.props.rowData);
    }

    onPressCommunityProfileIcon = () => {
        this.props.onPressCommunityProfileIcon(this.props.rowData.creator);
    }

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if(isCurrentUser){
            return getSmallAvatar(this.props.avatar_id || 0);
        }
        return getSmallAvatar(avatar_id || 0);
    };

    render() {
        const { rowContainer, textDetail } = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {content, creator, user, hearts, comments, created_at, id} = this.props.rowData;

        return (
            <View style={[rowContainer,{backgroundColor:appColor.scrollableViewBack}]}>
                <TochableView onPress={()=>this.props.onAdviceRowSelect(this.props.rowData)}
                              pressInColor={appColor.scrollableViewBack}
                              backColor={appColor.scrollableViewBack}>
                    <View>
                        <Text style={[textDetail,{color: appColor.defaultFont}]}>
                            {content}</Text>
                    </View>
                </TochableView>
                <LikeCount avtarName={(creator && creator.is_current_user) && "You" || creator.name || ""}
                           avtarImage={this.getAvatarImage(creator && creator.avatar_id || 0, creator && creator.is_current_user || false)}
                           likeCount={ (hearts) && hearts.count || "0" }
                           isLiked={(user) && user.has_hearted || false}
                           isCommented={(user) && user.has_commented || false }
                           commentCount={(comments) && comments.count || "0" }
                           id={id}
                           rowData={this.props.rowData}
                           heartId={user.heart_id}
                           unlikePostMethod={this.unlikePostMethod}
                           likePostMethod={this.likePostMethod}
                           onAdviceRowSelect={this.props.onAdviceRowSelect}
                           appTheme={this.props.appTheme}
                           porn_free_days={(creator.stats) && creator.stats.porn_free_days.toString() || null }
                           onEditButtonPress={this.onEditPress}
                           isAllowEdit={(creator && creator.is_current_user) || false}
                           createdDate={created_at || ""}
                           onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}/>
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