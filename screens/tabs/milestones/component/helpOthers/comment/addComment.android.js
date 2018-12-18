import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    FlatList,
    Modal, BackHandler,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import CommentTitle from './commentTitleComponent';
import CommentReply from './commentReplyComponent';
import BottomChatComponent from '../../../../team/subcomponent/teamChat/bottomChatView';
import { addHelpComment, getCommentByPostId, likeHelpPostComment,
    unlikeHelpPostComment, editHelpComment, getHelpPostDetailById } from '../../../../../../actions/helpPostActions';
import {
    showNoInternetAlert, showCustomAlert, getSmallAvatar,
    isReligious, showThemeAlert
} from '../../../../../../helper/appHelper';
import NewHelpPost from "./newHelpPost";

let isApiCalling = false;
let isKeyboardOpen = false;
let inProcessId = 0;

class PostComment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            helpPostData: props.navigation.state.params.rowData || null,
            modalVisible: false,
            isEdit: false,
            editData: {},
            isCommentEdit: false,
            editCommentData: {},
            isLoadingComments: true,
            limitViewBottom:50,
            isShowLimit: false,
            limitChar:0
        };
        isApiCalling = false;
        isKeyboardOpen = false;
        inProcessId = 0;
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.isLoadingComments){
            this.setState({
                isLoadingComments: false
            })
        }
    }

    componentDidMount() {
        if(this.props.navigation.state && this.props.navigation.state.params.postId){
            this.props.getHelpPostDetailById(this.props.navigation.state.params.postId).then(res => {
                if(res){
                    this.setState({
                        helpPostData: res
                    })
                }
            }).catch(err => {
            })
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onPressCommunityProfileIcon = (memberDetail) => {
        this.props.navigation.state.params.onPressCommunityProfileIcon(memberDetail);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    onBackButtonPress = () => {
        // helpPostData
        this.props.navigation.goBack();
    };

    onMessageSend = (message) => {
        if(message.length > 0) {
            if(this.props.isConnected){
                this.checkForReligious(true, message.toString().trim());
            }else{
                showNoInternetAlert();
            }
        }
    };

    onKeybordChange = () => {
        if (this.refs.scrollView) {
            this.refs.scrollView.scrollToEnd({animated: true});
        }
        isKeyboardOpen = false;
    };

    onInputBoxChange = () => {
        if (this.refs.scrollView) {
            this.refs.scrollView.scrollToEnd({animated: true});
        }
        isKeyboardOpen = false;
    };

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if(isCurrentUser){
            return getSmallAvatar(this.props.avatar_id || 0);
        }
        return getSmallAvatar(avatar_id || 0);
    };

    onEndReachedCommentPost = () => {
        try{
            if(this.props.isConnected) {
                if(!isApiCalling){
                    if(this.props.helpPostCommentPagination && this.props.helpPostCommentPagination.next_page_url){
                        isApiCalling = true;
                        console.log(this.props.helpPostCommentPagination.next_page_url);
                        this.setState({
                            isLoadingComments: true
                        })
                        this.props.getCommentByPostId(this.state.helpPostData.id,this.props.helpPostCommentPagination.next_page_url).then(res=>{
                            isApiCalling = false;
                            this.setState({
                                isLoadingComments: false
                            })
                            if (this.refs.scrollView) {
                                this.refs.scrollView.scrollToEnd({animated: true});
                            }
                        }).catch(err=>{
                            isApiCalling = false;
                            this.setState({
                                isLoadingComments: false
                            })
                        });
                    }
                }
            }
        }catch (e){
            isApiCalling = false;
            console.log("comment ",e);
        }
    };

    renderRow = ({item, index}) => {
        if(item){
            let commentObj = this.props.navigation.state.params.commentObj;
            return <CommentReply rowData={item}
                                 avtarImage={this.getAvatarImage(item.creator.avatar_id || 0, item.creator.is_current_user)}
                                 onLikeComment={this.onLikeComment}
                                 appTheme={this.props.appTheme}
                                 onEditComment={this.onEditComment}
                                 onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}
                                 isHighlited={(commentObj && commentObj.postId == item.id)}
                                 key={index}/>
        }
        return null;
    };

    onLikeComment = (rowData) => {
        if(this.props.isConnected){
            if(rowData.id !== undefined && inProcessId !== rowData.id){
                inProcessId = rowData.id;
                if(rowData.user.has_hearted) {
                    this.props.unlikeHelpPostComment(this.state.helpPostData.id,rowData.id).then(res=>{
                        inProcessId = 0;
                    }).catch(err=>{
                        inProcessId = 0;
                    });
                }else{
                    this.props.likeHelpPostComment(this.state.helpPostData.id,rowData.id).then(res=>{
                        inProcessId = 0;
                    }).catch(err=>{
                        inProcessId = 0;
                    });
                }
            }
        }else {
            showNoInternetAlert();
        }
    };

    heartPressed = (id,hasHeart) => {
        // if(hasHeart){
        //     this.props.navigation.state.params.unlikeHelpPost(id)
        // }else{
        //     this.props.navigation.state.params.likeHelpPost(id)
        // }
    }

    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false,
            isEdit:false,
            editData: {}
        });
    };

    //Editing Help Post
    onEditButtonPress = (rowDara) => {
        this.setState({
            modalVisible: true,
            isEdit: true,
            editData: this.state.helpPostData
        });
    };

    //Editing Help Post Comment
    onEditComment = (rowData) => {
        this.setState({
            isCommentEdit: true,
            editCommentData: rowData
        });
    }

    onEditCommentDone = (commentText) => {
        if (commentText.length > 0 && commentText.trim() !== this.state.editCommentData.content) {
            if (this.props.isConnected){
                this.checkForReligious(false, commentText.toString().trim());
            }else{
                showNoInternetAlert();
            }
        }else{
            this.setState({
                isCommentEdit: false,
                editCommentData: {}
            });
        }
    }

    onTextInputHeightChange = (height) => {
        this.setState({
            limitViewBottom: height + 13
        });
    }

    showCharLimit = (character) => {
        let length = 400 - character;
        if(length <= 50 && length >= 0) {
            this.setState({
                isShowLimit: true,
                limitChar: length
            });
        }else{
            if(this.state.isShowLimit){
                this.setState({
                    isShowLimit: false,
                });
            }
        }
    }

    checkForReligious = (isNewPost, commentText) => {
        let religiousString = isReligious(commentText);
        if(religiousString == Constant.RELIGIOUS){
            if(isNewPost){
                this.performAddPost(true,commentText);
            }else{
                this.performEditPost(true, commentText);
            }
        }else if(religiousString == Constant.NO_RELIGIOUS){
            if(isNewPost){
                this.performAddPost(false,commentText);
            }else{
                this.performEditPost(false,commentText);
            }
        }else if(religiousString == Constant.ASK_RELIGIOUS_ALERT){
            showThemeAlert({
                title: "Religious content?",
                message: "Does your comment contain religious content?",
                leftBtn: "Yes",
                leftPress: ()=>{
                    if(isNewPost){
                        this.performAddPost(true,commentText);
                    }else{
                        this.performEditPost(true,commentText);
                    }
                },
                rightBtn: "No",
                rightPress: ()=>{
                    if(isNewPost){
                        this.performAddPost(false,commentText);
                    }else{
                        this.performEditPost(false,commentText);
                    }
                },
            });
        }
    }

    performAddPost = (isReligiousContent, commentText) => {
        this.props.addHelpComment(commentText, this.state.helpPostData.id, isReligiousContent).then((res)=>{
            Keyboard.dismiss();
            this.setState({},()=>{
                this.refs.scrollView.scrollToEnd({animated: true});
            });
            this.showCharLimit(0);
        }).catch(err => {
            showCustomAlert("Fail to add comment, please try again.", "Brainbuddy","OK");
        });
    }

    performEditPost = (isReligiousContent, commentText) => {
        let commentData = this.state.editCommentData;
        commentData.content = commentText;
        this.setState({
            isCommentEdit: false,
            editCommentData: {}
        });
        this.props.editHelpComment(commentData,this.state.helpPostData.id, isReligiousContent).then((res)=> {
            //done
            Keyboard.dismiss();
            this.showCharLimit(0);
        }).catch(err => {
            showCustomAlert("Fail to save comment, please try again.", "Brainbuddy","OK");
        });
    }

    render() {
        const {container} = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[container, {
                paddingBottom: this.props.safeAreaInsetsData.bottom,
                backgroundColor: appColor.commentViewBack}]}>
                <NavigationBar onBackButtonPress={this.onBackButtonPress}
                               title="Help post"
                               top={this.props.safeAreaInsetsData.top}
                               height={72}
                               isRightButton={false}/>
                {
                    this.state.helpPostData == null &&
                    <View style={[styles.container,{backgroundColor:appColor.textInputBackColor,
                        justifyContent:'center',alignItems:'center'}]}>
                        <ActivityIndicator
                            animating={true}
                            size="small"
                            color={appColor.activityIndicator}/>
                    </View> ||
                    <View style={{flex:1}}>
                        <FlatList showsVerticalScrollIndicator={true}
                                  keyboardShouldPersistTaps='always'
                                  ListFooterComponent={
                                      (this.state.isLoadingComments) &&
                                      <ActivityIndicator
                                          animating={true}
                                          style={{marginTop:20}}
                                          size="small"
                                          color={appColor.activityIndicator}/>
                                      ||
                                      <View style={{height:20}}/>
                                  }
                                  ref="scrollView"
                                  removeClippedSubviews={false}
                                  data={this.props.helpPostComment}
                                  onEndReachedThreshold={0.5}
                                  onEndReached={this.onEndReachedCommentPost}
                                  automaticallyAdjustContentInsets={false}
                                  ListHeaderComponent={<CommentTitle content={this.state.helpPostData.content}
                                                                     helpPostData={this.state.helpPostData}
                                                                     avtarImage={this.getAvatarImage(this.state.helpPostData.creator.avatar_id || 0,
                                                                         this.state.helpPostData.creator.is_current_user)}
                                                                     onHeartPress={this.heartPressed}
                                                                     appTheme={this.props.appTheme}
                                                                     porn_free_days={(this.state.helpPostData.creator.stats) &&
                                                                     this.state.helpPostData.creator.stats.porn_free_days.toString() || null}
                                                                     onEditButtonPress={this.onEditButtonPress}
                                                                     onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}/>
                                  }
                                  renderItem={this.renderRow}/>
                        <View>
                            {
                                (this.state.isShowLimit) &&
                                <View style={[styles.outerView,{bottom: this.state.limitViewBottom,
                                    backgroundColor: appColor.bottomChatInner}]}>
                                    <Text style={styles.limitText}>
                                        {this.state.limitChar + " characters remaining"}
                                    </Text>
                                </View>
                            }
                            <BottomChatComponent onMessageSend={this.onMessageSend}
                                                 onKeybordChange={this.onKeybordChange}
                                                 showCharLimit={this.showCharLimit}
                                                 onTextInputHeightChange={this.onTextInputHeightChange}
                                                 onInputBoxChange={this.onInputBoxChange}
                                                 maxLength={400}
                                                 placeHolderText={"Comment..."}
                                                 safeAreaInsetsData={this.props.safeAreaInsetsData}
                                                 appTheme={this.props.appTheme}
                                                 isBottomBar={false}
                                                 isCommentEdit={this.state.isCommentEdit}
                                                 editCommentData={this.state.editCommentData}
                                                 onEditCommentDone={this.onEditCommentDone}
                                                 isConnected={this.props.isConnected}/>

                        </View>
                    </View>
                }

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <NewHelpPost onCloseBtnPress={this.onCloseBtnPress}
                                 isEdit={this.state.isEdit}
                                 editData={this.state.editData}
                                 appTheme={this.props.appTheme}/>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
    outerView:{
        alignSelf:'center',position:'absolute',
        paddingTop:5, paddingBottom:5,
        paddingLeft:10, paddingRight:10, borderRadius:50
    },
    limitText:{
        fontFamily: Constant.font500,textAlign:'center',
        color:Constant.greenColor, fontSize:13}
});

const mapStateToProps = state => {
    return {
        helpPostList: state.helpPost.helpPostList,
        helpPostComment: state.helpPost.helpPostComment,
        helpPostCommentPagination: state.helpPost.helpPostCommentPagination,
        isConnected: state.user.isConnected,
        avatar_id:state.user.userDetails.avatar_id,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    addHelpComment, getCommentByPostId, editHelpComment,
    likeHelpPostComment, unlikeHelpPostComment, getHelpPostDetailById
})(PostComment);