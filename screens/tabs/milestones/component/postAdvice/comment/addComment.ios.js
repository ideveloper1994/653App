import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import CommentTitle from './commentTitleComponent';
import CommentReply from './commentReplyComponent';
import BottomChatComponent from '../../../../team/subcomponent/teamChat/bottomChatView';
import {
    getCommentByAdviceId,
    addAdviceComment,
    editAdviceComment,
    likeAdvicePostComment,
    unlikeAdvicePostComment,
    likePost,unlikePost,
    getAdvicePostDetailById
} from "../../../../../../actions/postAdviceAction";
import {
    showNoInternetAlert, showCustomAlert, getSmallAvatar,
    isReligious, showThemeAlert
} from '../../../../../../helper/appHelper';
import PostAdviceCreate from '../postAdviceCreate';
import {findIndex} from 'lodash';

let isApiCalling = false;
let inProcessId = 0;
let isMounted = false;
let isAddedNewComment = false;

class AdviceComment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            adviceData: props.navigation.state.params.rowData || null,
            modalVisible: false,
            isEdit: false,
            editData: {},
            isCommentEdit: false,
            editCommentData: {},
            isLoadingComments: true,
            limitViewBottom: 50,
            isShowLimit: false,
            limitChar: 0
        };
        isApiCalling = false;
        inProcessId = 0;
        isMounted = false;
        isAddedNewComment = false;
    }

    componentWillReceiveProps(nextProps) {


        if (this.state.isLoadingComments) {
            this.setState({
                isLoadingComments: false
            })
        }
        // if (this.props.adviceComment && this.props.adviceComment.length > 0 && this.props.adviceComment.length < 30) {
        //     setTimeout(() => {
        //         // isMounted = true;
        //     }, 300);
        // }

        // if (this.props.adviceComment && this.props.adviceComment.length > 0) {
        //     setTimeout(()=>{
        //         if(this.refs.scrollView && this.props.navigation.state.params){
        //             let commentObj = this.props.navigation.state.params.commentObj;
        //             let dataIndex = findIndex(this.props.adviceComment,{id:commentObj.postId});
        //             // this.refs.scrollView.scrollToIndex({index:20,animated: true});
        //         }
        //     },1000)
        //
        // }
    }

    componentDidMount(){
        if(this.props.navigation.state && this.props.navigation.state.params.postId){
            this.props.getAdvicePostDetailById(this.props.navigation.state.params.postId).then(res => {
                if(res){
                    this.setState({
                        adviceData: res
                    })
                }
            }).catch(err => {
            })
        }
    }

    componentDidUpdate() {
        if(isAddedNewComment){
            isAddedNewComment = false;
            if(this.refs.scrollView){
                setTimeout(()=>{
                    this.refs.scrollView.scrollToEnd({animated: true});
                },100);
            }
        }
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onMessageSend = (message) => {
        if (message.length > 0) {
            if (this.props.isConnected) {
                this.checkForReligious(true, message.toString().trim());
            } else {
                showNoInternetAlert();
            }
        }
    };

    onKeybordChange = (isShown) => {
        isMounted = !isShown;
        // this.refs.scrollView.scrollToEnd({animated: false});
    };

    onInputBoxChange = () => {
        this.refs.scrollView.scrollToEnd({animated: false});
    };

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if (isCurrentUser) {
            return getSmallAvatar(this.props.avatar_id || 0);
        }
        return getSmallAvatar(avatar_id || 0);
    };

    onEndReachedCommentPost = () => {
        try {
            if (this.props.isConnected) {
                if (!isApiCalling) {
                    if (this.props.adviceCommentPagination && this.props.adviceCommentPagination.next_page_url) {
                        isApiCalling = true;
                        console.log(this.props.adviceCommentPagination.next_page_url);
                        this.setState({
                            isLoadingComments: true
                        })
                        this.props.getCommentByAdviceId(this.state.adviceData.id, this.props.adviceCommentPagination.next_page_url).then(res => {
                            isApiCalling = false;
                            this.setState({
                                isLoadingComments: false
                            })
                            // if (this.refs.scrollView) {
                            //     this.refs.scrollView.scrollToEnd({animated: true});
                            // }
                        }).catch(err => {
                            this.setState({
                                isLoadingComments: false
                            })
                            isApiCalling = false;
                        });
                    }
                }
            }
        } catch (e) {
            isApiCalling = false;
            console.log("comment ", e);
        }
    };

    renderRow = ({item, index}) => {
        if(item){
            let commentObj = this.props.navigation.state.params.commentObj;
            return <CommentReply rowData={item}
                                 avtarImage={this.getAvatarImage(item.creator.avatar_id || 0, item.creator.is_current_user)}
                                 onLikeComment={this.onLikeComment}
                                 key={index}
                                 appTheme={this.props.appTheme}
                                 onEditComment={this.onEditComment}
                                 isHighlited={(commentObj && commentObj.postId == item.id)}
                                 onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}/>
        }
        return null;
    };

    onLikeComment = (rowData) => {
        if (this.props.isConnected) {
            if (rowData.id !== undefined && inProcessId !== rowData.id) {
                inProcessId = rowData.id;
                if (rowData.user.has_hearted) {
                    this.props.unlikeAdvicePostComment(this.state.adviceData.id, rowData.id).then(res => {
                        inProcessId = 0;
                    }).catch(err => {
                        inProcessId = 0;
                    });
                } else {
                    this.props.likeAdvicePostComment(this.state.adviceData.id, rowData.id).then(res => {
                        inProcessId = 0;
                    }).catch(err => {
                        inProcessId = 0;
                    });
                }
            }
        } else {
            showNoInternetAlert();
        }
    };

    //For Post
    heartPressed = (id, hasHeart) => {
        if (hasHeart) {
            this.unlikePostMethod(id)
        } else {
            this.likePostMethod(id)
        }
    };

    //For editing
    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false,
            isEdit: false,
            editData: {}
        });
    };

    //Editing Help Post
    onEditButtonPress = (rowDara) => {
        this.setState({
            modalVisible: true,
            isEdit: true,
            editData: this.state.adviceData
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
            if (this.props.isConnected) {
                this.checkForReligious(false, commentText.toString().trim());
            } else {
                showNoInternetAlert();
            }
        } else {
            this.setState({
                isCommentEdit: false,
                editCommentData: {}
            });
        }
    }


    setKeyboardShow = (flag) => {
        if (flag) {
            isMounted = true;
        }
        // isKeyboardShow = flag;
    }

    onTextInputHeightChange = (height) => {
        this.setState({
            limitViewBottom: height + 13
        });
    }

    showCharLimit = (character) => {
        let length = 400 - character;
        if (length <= 50 && length >= 0) {
            this.setState({
                isShowLimit: true,
                limitChar: length
            });
        } else {
            if (this.state.isShowLimit) {
                this.setState({
                    isShowLimit: false,
                });
            }
        }
    }

    checkForReligious = (isNewPost, commentText) => {
        let religiousString = isReligious(commentText);
        if (religiousString == Constant.RELIGIOUS) {
            if (isNewPost) {
                this.performAddPost(true, commentText);
            } else {
                this.performEditPost(true, commentText);
            }
        } else if (religiousString == Constant.NO_RELIGIOUS) {
            if (isNewPost) {
                this.performAddPost(false, commentText);
            } else {
                this.performEditPost(false, commentText);
            }
        } else if (religiousString == Constant.ASK_RELIGIOUS_ALERT) {
            showThemeAlert({
                title: "Religious content?",
                message: "Does your comment contain religious content?",
                leftBtn: "Yes",
                leftPress: () => {
                    if (isNewPost) {
                        this.performAddPost(true, commentText);
                    } else {
                        this.performEditPost(true, commentText);
                    }
                },
                rightBtn: "No",
                rightPress: () => {
                    if (isNewPost) {
                        this.performAddPost(false, commentText);
                    } else {
                        this.performEditPost(false, commentText);
                    }
                },
            });
        }
    }

    performAddPost = (isReligiousContent, commentText) => {
        this.props.addAdviceComment(commentText, this.state.adviceData.id, isReligiousContent).then((res) => {
            isAddedNewComment = true;
            this.setState({}, () => {
                // setTimeout(()=>{
                //     this.refs.scrollView.scrollToEnd({animated: true});
                // },1000)
            });
            this.showCharLimit(0);
        }).catch(err => {
            showCustomAlert("Fail to add comment, please try again.", "Brainbuddy", "OK");
        });

    }

    performEditPost = (isReligiousContent, commentText) => {
        let commentData = this.state.editCommentData;
        commentData.content = commentText.trim();
        this.setState({
            isCommentEdit: false,
            editCommentData: {}
        });
        this.props.editAdviceComment(commentData, this.state.adviceData.id, isReligiousContent).then((res) => {
            //done
            this.showCharLimit(0);
        }).catch(err => {
            showCustomAlert("Fail to save comment, please try again.", "Brainbuddy", "OK");
        });
    }

    onPressCommunityProfileIcon = (memberDetail) => {
        this.props.navigation.state.params.onPressCommunityProfileIcon(memberDetail);
    }

    //For Main Post
    likePostMethod = (id) => {
        if(this.props.isConnected){
            try{
                if(id !== undefined && inProcessId !== id){
                    inProcessId = id;
                    let advicePost = this.state.adviceData;
                    advicePost.user.has_hearted = true;
                    this.setState({
                        adviceData: advicePost
                    })
                    this.props.likePost(id).then(res=>{
                        inProcessId = 0;
                        this.setState({
                            adviceData: res
                        })

                    }).catch(err=>{
                        inProcessId = 0;
                    });
                }
            }catch (e){
                console.log(e);
            }
        }else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    //For Main Post
    unlikePostMethod = (heartId) => {
        if(this.props.isConnected){
            try{
                if(heartId !== undefined && inProcessId !== heartId){
                    inProcessId = heartId;
                    let advicePost = this.state.adviceData;
                    advicePost.user.has_hearted = false;
                    this.setState({
                        adviceData: advicePost
                    })
                    this.props.unlikePost(heartId).then(res=>{
                        this.setState({
                            adviceData: res
                        })
                        inProcessId = 0;
                    }).catch(err=>{
                        inProcessId = 0;
                    });
                }
            }catch (e){
                console.log(e);
            }
        }else{
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    renderHeader = () => {
        if(this.state.adviceData && this.state.adviceData.content){
            return (<CommentTitle content={this.state.adviceData.content}
                                  adviceData={this.state.adviceData}
                                  avtarImage={this.getAvatarImage(this.state.adviceData.creator.avatar_id || 0,
                                      this.state.adviceData.creator.is_current_user)}
                                  onHeartPress={this.heartPressed}
                                  appTheme={this.props.appTheme}
                                  porn_free_days={(this.state.adviceData.creator.stats) && this.state.adviceData.creator.stats.porn_free_days.toString() || null}
                                  onEditButtonPress={this.onEditButtonPress}
                                  onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}/>)
        }
        return null;
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {container} = styles;
        return (
            <View style={[container, {paddingBottom: this.props.safeAreaInsetsData.bottom,backgroundColor: appColor.commentViewBack}]}>
                <NavigationBar onBackButtonPress={this.onBackButtonPress}
                               title="Advice post"
                               top={this.props.safeAreaInsetsData.top}
                               height={72}
                               isRightButton={false}/>
                {
                    this.state.adviceData == null &&
                    <View style={[styles.container,{backgroundColor:appColor.textInputBackColor,
                        justifyContent:'center',alignItems:'center'}]}>
                        <ActivityIndicator
                            animating={true}
                            size="small"
                            color={appColor.activityIndicator}/>
                    </View> ||
                    <KeyboardAvoidingView behavior="padding"
                                          style={{flex: 1}}>
                        <FlatList showsVerticalScrollIndicator={true}
                                  keyboardShouldPersistTaps='never'
                                  ListFooterComponent={
                                      (this.state.isLoadingComments) &&
                                      <ActivityIndicator
                                          animating={true}
                                          style={{marginTop: 20}}
                                          size="small"
                                          color={appColor.activityIndicator}/>
                                      ||
                                      <View style={{height: 20}}/>
                                  }
                                  ref="scrollView"
                                  keyboardDismissMode={"interactive"}
                                  removeClippedSubviews={false}
                                  data={this.props.adviceComment}
                                  onEndReachedThreshold={0.5}
                                  onEndReached={this.onEndReachedCommentPost}
                                  automaticallyAdjustContentInsets={false}
                                  ListHeaderComponent={this.renderHeader}
                                  renderItem={this.renderRow}
                                  onContentSizeChange={(contentWidth, contentHeight) => {
                                      if (isMounted) {
                                          // this.refs.scrollView.scrollToEnd({animated: true})
                                      }
                                  }}
                                  onLayout={() => {
                                      if (isMounted) {
                                          this.refs.scrollView.scrollToEnd({animated: true})
                                      }
                                  }}/>
                        <View>
                            {
                                (this.state.isShowLimit) &&
                                <View style={[styles.outerView, {
                                    bottom: this.state.limitViewBottom,
                                    backgroundColor: appColor.bottomChatInner
                                }]}>
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
                                                 isManagedKeybord={true}
                                                 appTheme={this.props.appTheme}
                                                 isBottomBar={false}
                                                 isCommentEdit={this.state.isCommentEdit}
                                                 editCommentData={this.state.editCommentData}
                                                 onEditCommentDone={this.onEditCommentDone}
                                                 setKeyboardShow={this.setKeyboardShow}
                                                 isConnected={this.props.isConnected}/>

                        </View>
                    </KeyboardAvoidingView>
                }
                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <PostAdviceCreate onCloseBtnPress={this.onCloseBtnPress}
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
    outerView: {
        alignSelf: 'center', position: 'absolute',
        paddingTop: 5, paddingBottom: 5,
        paddingLeft: 10, paddingRight: 10, borderRadius: 50
    },
    limitText: {
        fontFamily: Constant.font500, textAlign: 'center',
        color: Constant.greenColor, fontSize: 13
    }
});

const mapStateToProps = state => {
    return {
        isConnected: state.user.isConnected,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        avatar_id: state.user.userDetails.avatar_id,
        adviceList: state.advice.adviceList,
        adviceComment: state.advice.adviceComment,
        adviceCommentPagination: state.advice.adviceCommentPagination,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    getCommentByAdviceId, addAdviceComment, editAdviceComment,
    likeAdvicePostComment, unlikeAdvicePostComment, likePost,unlikePost,
    getAdvicePostDetailById
})(AdviceComment);