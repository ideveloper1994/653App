import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
    Text,
    FlatList,
    ActivityIndicator,
    Modal,
    Animated, PushNotificationIOS
} from 'react-native';
import Constant from '../../../helper/constant';
import {connect} from 'react-redux';
import TopDetailProfile from './component/topProfileDetails';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import CustomTabbar from '../../commonComponent/customTabBar'
import AboutDetail from './about';
import LinearGradient from 'react-native-linear-gradient';
import {find, flatMap} from 'lodash';
import {
    getEventsDetails, updateUserDetails,
    getMemberDetail, manageSeenEvents,
    manageActivityEventBadgeCount, manageStartEventViews
} from "../../../actions/teamAction";
import ManageBiography from './addBiography';
import TochableView from '../../commonComponent/touchableView';
import {getCommentByAdviceId} from '../../../actions/postAdviceAction';
import {getCommentByPostId} from "../../../actions/helpPostActions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HEADER_MIN_HEIGHT = (Constant.isIOS) && 80 || 70;
const renderTabBar = props => (
    <CustomTabbar {...props} style={{borderBottomWidth: 0, height: HEADER_MIN_HEIGHT}}/>);
const renderLightTabBar = props => (<CustomTabbar {...props} style={{
    height: HEADER_MIN_HEIGHT, borderBottomWidth: 1,
    borderColor: "#e4e4e4"
}}/>);
let isApiCalling = false;

const HEADER_MAX_HEIGHT = 358;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
let count = 0;

class CommunityProfile extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showTab: 0,
            isLoadingData: true,
            modalVisible: false,
            scrollY: new Animated.Value(0),
            memberDetail: props.navigation.state.params.memberDetail || null
        }
        isApiCalling = false;
        count = 0;
    }

    componentWillReceiveProps(nextProps) {
        count += 1;
        if (this.state.isLoadingData && count > 1) {
            this.setState({
                isLoadingData: false
            })
        }
    }

    componentDidMount() {
        try {
            let isCurrentUser = this.props.navigation.state.params.isCurrentUser || false;
            if (isCurrentUser) {
                this.props.manageActivityEventBadgeCount(0);
                if (Constant.isIOS) {
                    PushNotificationIOS.setApplicationIconBadgeNumber(0 + this.props.appBadgeCount);
                }
            }
        } catch (e) {

        }
    }

    componentWillUnmount() {
        let isCurrentUser = this.props.navigation.state.params.isCurrentUser || false;
        if (isCurrentUser) {
            this.props.manageActivityEventBadgeCount(0);
        }
    }

    onBackButtonPress = () => {
        //Assume all activity seen by user
        //startEventViews = top of item
        // let isCurrentUser = this.props.navigation.state.params.isCurrentUser || false;
        // if (isCurrentUser) {
        //     let listData = this.props.userEventList;
        //     if(listData.length > 0 && this.props.startEventViews !== listData[0].id){
        //         this.props.manageStartEventViews(listData[0].id);
        //     }
        // }
        this.props.navigation.goBack();
    };

    onTabChange = (tab) => {
        this.setState({
            showTab: tab.i
        })
    };

    getTitle = (type, user) => {
        try {
            let isCurrentUser = this.props.navigation.state.params.isCurrentUser || false;
            let name = isCurrentUser && "You " || user.name + " ";
            switch (type) {
                case "posted_advice":
                    return name + "posted in Advice";
                case "posted_help":
                    return name + "posted in Get Help";

                case "posted_advice_comment":
                    return name + "commented in Advice";

                case "posted_help_comment":
                    return name + "commented in Get Help";

                case "received_advice_reply":
                    return user.name + " replied to your comment";

                case "received_help_reply":
                    return user.name + " replied to your comment";

                case "received_advice_heart":
                    return user.name + " hearted your post";

                case "received_help_heart":
                    return user.name + " hearted your comment";

                case "received_advice_comment_heart":
                    return user.name + " hearted your comment";

                case "received_help_comment_heart":
                    return user.name + " hearted your comment";

                case "received_advice_post_reply":
                    return user.name + "  replied to your post";

                case "received_help_post_reply":
                    return user.name + " replied to your comment";

            }
        } catch (e) {
            return "";
        }
    }

    onEndReachedChat = () => {
        try {
            if (this.props.isConnected && this.state.showTab == 0) {
                let isCurrentUser = this.props.navigation.state.params.isCurrentUser || false;
                let pagination = this.props.teamMemberEventPagination;
                if (isCurrentUser) {
                    pagination = this.props.userEventPagination;
                }
                if (!isApiCalling) {
                    if (pagination && pagination.next_page_url) {
                        isApiCalling = true;
                        this.props.getEventsDetails("", pagination.next_page_url, isCurrentUser).then(res => {
                            isApiCalling = false;
                        }).catch(err => {
                            isApiCalling = false;
                        });
                    }
                }
            }
        } catch (e) {
            isApiCalling = false;
            console.log("Team chat", e);
        }
    };

    renderRow = ({item, index}) => {
        try {
            let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
            if (this.state.showTab == 0) {
                let isCurrentUser = this.props.navigation.state.params.isCurrentUser || false;
                let isDot = (isCurrentUser && this.props.startEventViews &&
                    item.id > this.props.startEventViews && this.props.seenUserEvents.indexOf(item.id) < 0) || false;
                if (isCurrentUser && item.type.includes('posted_')) {
                    isDot = false;
                }
                // let minusWidth = (isDot || isCurrentUser) && 59 || 40;
                let minusWidth = 40 + 19 + 14;
                let isHeart = item.type.includes('_heart');

                return (
                    <View style={{
                        backgroundColor: isDot && appColor.teamDetailsRow || appColor.textInputBackColor,
                        maxWidth: 600,
                        width: '100%',
                        alignSelf: 'center',
                        paddingTop: index == 0 && HEADER_MAX_HEIGHT + this.props.safeAreaInsetsDefault.top || 0
                    }}
                          key={index}>
                        <TochableView onPress={() => this.onActivityPress(item)}
                                      pressInColor={appColor.pressInMoreRow}
                                      backColor={appColor.moreRow}>
                            <View style={{
                                paddingLeft: 20, paddingRight: 20, paddingTop: 18, paddingBottom: 18,
                                flexDirection: 'row', width: '100%', alignItems: 'center',
                                backgroundColor: isDot && appColor.teamDetailsRow || appColor.textInputBackColor
                            }}>
                                <FontAwesome name={isHeart && 'heart' || 'comment'}
                                             size={19}
                                             color={isHeart && Constant.heartColor || Constant.commentColor}/>
                                <View style={{paddingRight: 20, marginLeft: 14}}>
                                    <Text style={[styles.titleText, {color: appColor.defaultFont}]}>
                                        {this.getTitle(item.type, item.user)}
                                    </Text>
                                    <Text style={[styles.detailsText, {
                                        color: appColor.profileColor,
                                        width: Constant.screenWidth - minusWidth
                                    }]}
                                          numberOfLines={2}
                                          ellipsizeMode={'tail'}>
                                        {item.entity.content || ""}
                                    </Text>
                                </View>
                            </View>
                        </TochableView>
                        <View style={{
                            backgroundColor: appColor.rowSeperator,
                            height: 1,
                            marginLeft: 20,
                            marginRight: 20
                        }}/>
                    </View>
                )
            }
            return <AboutDetail appColor={appColor}
                                isCurrentUser={this.props.navigation.state.params.isCurrentUser || false}
                                memberDetail={this.props.memberDetail}
                                safeAreaInsetsDefault={this.props.safeAreaInsetsDefault}
                                onUpdateBiography={this.onUpdateBiography}/>
        } catch (e) {
            return null;
        }
    }

    onUpdateBiography = () => {
        this.setState({
            modalVisible: true
        });
    }

    onCloseBtnPress = (updatedData) => {
        this.props.updateUserDetails(updatedData);
        this.setState({
            modalVisible: false,
        });
    };

    renderHeader = () => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        let userData = (this.props.memberDetail == null) && this.props.navigation.state.params.memberDetail || this.props.memberDetail;
        let isCurrentUser = this.props.navigation.state.params && this.props.navigation.state.params.isCurrentUser || false;
        return (
            <View style={{flex: 1}}>
                {
                    userData &&
                    <TopDetailProfile appColor={appColor}
                                      userData={userData}
                                      isCurrentUser={isCurrentUser}
                                      currentStreak={this.props.current_p_clean_days}
                                      onBackButtonPress={this.onBackButtonPress}/>
                }
                <ScrollableTabView tabBarBackgroundColor={appColor.scrollableBack}
                                   style={{backgroundColor: appColor.scrollableViewBack}}
                                   tabBarUnderlineStyle={{backgroundColor: Constant.lightBlueColor}}
                                   renderTabBar={this.props.appTheme === Constant.darkTheme && renderTabBar || renderLightTabBar}
                                   tabBarActiveTextColor={appColor.scrollableActiveFont}
                                   tabBarTextStyle={{
                                       fontFamily: Constant.font500, fontSize: 14, alignSelf: 'center',
                                       paddingTop: (Constant.isIOS) ? 30 : 15
                                   }}
                                   tabBarInactiveTextColor={appColor.scrollableInactiveFont}
                                   prerenderingSiblingsNumber={Infinity}
                                   onChangeTab={(tab) => this.onTabChange(tab)}>
                    <View tabLabel="Activity"/>
                    <View tabLabel={isCurrentUser && "About Me" || "About"}/>
                </ScrollableTabView>
            </View>
        )
    }

    renderFooter = () => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        if (this.state.isLoadingData) {
            return (
                <ActivityIndicator
                    animating={true}
                    style={{marginTop: 20, paddingTop: HEADER_MAX_HEIGHT + this.props.safeAreaInsetsDefault.top}}
                    size="small"
                    color={appColor.activityIndicator}/>
            )
        }
        let listData = (this.props.navigation.state.params.isCurrentUser) && this.props.userEventList || this.props.teamMemberEventList;
        if (listData.length == 0 && this.state.showTab == 0) {
            return (
                <Text style={[styles.placeHolderText, {
                    color: appColor.profileColor,
                    paddingTop: HEADER_MAX_HEIGHT + this.props.safeAreaInsetsDefault.top
                }]}>
                    {"There's nothing here."}
                </Text>
            );
        }
        return null;
    }

    onActivityPress = (item) => {
        try {
            let postId = 0;
            let type = item.type;
            let commentObj = null;
            if (type == "posted_advice_comment" || type == "posted_help_comment" || type == "received_advice_comment_heart" ||
                type == "received_advice_reply" || type == "received_help_reply" || type == "received_help_comment_heart"
                || type == "received_advice_post_reply" || type == "received_help_post_reply") {
                commentObj = {
                    postId: item.entity.id
                };
            }
            if (type.includes("advice")) {
                if (type == "posted_advice" || type == "received_advice_heart") {
                    postId = item.entity.id; //Entity ID
                } else {
                    postId = item.entity.post.id;
                }
                this.props.navigation.navigate('adviceCommentCard', {
                    rowData: null,
                    transition: "myCustomSlideRightTransition",
                    onPressCommunityProfileIcon: this.onPressCommunityProfileIcon,
                    postId: postId,
                    commentObj: commentObj
                });
                this.props.getCommentByAdviceId(postId);
                this.manageEventViewByUser(item.id);
            } else {
                if (type == "posted_help" || type == "received_help_heart") {
                    postId = item.entity.id; //Entity ID
                } else {
                    postId = item.entity.post.id;
                }
                this.props.navigation.navigate('postCommentCard', {
                    rowData: null, transition: "myCustomSlideRightTransition",
                    onPressCommunityProfileIcon: this.onPressCommunityProfileIcon,
                    postId: postId,
                    commentObj: commentObj
                });
                this.props.getCommentByPostId(postId);
                this.manageEventViewByUser(item.id);
            }
        } catch (e) {
            if (__DEV__) {
                alert(e)
            }
        }
    }

    manageEventViewByUser = (itemId) => {
        if (this.props.navigation.state.params.isCurrentUser && this.props.startEventViews &&
            itemId > this.props.startEventViews && this.props.seenUserEvents.indexOf(itemId) < 0) {
            this.props.manageSeenEvents(itemId);
        }
    }

    onPressCommunityProfileIcon = (memberDetail) => {
        try{
            if (memberDetail) {
                let instance = memberDetail;
                instance.porn_free_days = {
                    total: memberDetail.stats.porn_free_days,
                    longest_streak: 0,
                    current_streak: 0,
                }
                instance.hearts_count = 0;
                instance.biography = "";
                if (memberDetail.is_current_user && this.props.userCommunity) {
                    instance = this.props.userCommunity;
                }
                this.props.navigation.push("communityProfile" + "Card", {
                    transition: "myCustomSlideRightTransition",
                    isCurrentUser: memberDetail.is_current_user,
                    memberDetail: instance
                })
                this.props.getMemberDetail(memberDetail.id, memberDetail.is_current_user).then(res => {
                    this.props.getEventsDetails(memberDetail.id, null, memberDetail.is_current_user);
                });
            }
        }catch (e){console.log(e)}
    }

    _customListener = (e) => {
        console.log(e.nativeEvent.contentOffset.y)
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        let listData = (this.props.navigation.state.params.isCurrentUser) && this.props.userEventList || this.props.teamMemberEventList;
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
        let memberDetail = (this.props.memberDetail == null) && this.props.navigation.state.params.memberDetail || this.props.memberDetail;

        return (
            memberDetail == null &&
            <View style={[styles.container, {
                backgroundColor: appColor.textInputBackColor, justifyContent: 'center',
                alignItems: 'center'
            }]}>
                <ActivityIndicator
                    animating={true}
                    size="small"
                    color={appColor.activityIndicator}/>
            </View> ||
            <View style={[styles.container, {backgroundColor: appColor.textInputBackColor}]}>

                <View style={{
                    left: 0, right: 0, height: this.props.safeAreaInsetsDefault.top,
                    position: 'absolute', zIndex: 100000,
                    backgroundColor: appColor.scrollableBack
                }}/>

                <FlatList showsVerticalScrollIndicator={false}
                          removeClippedSubviews={false}
                          style={styles.container}
                          scrollEventThrottle={16}
                          onScroll={Animated.event(
                              [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                          )}
                          data={this.state.showTab == 0 && listData || [1]}
                          automaticallyAdjustContentInsets={false}
                          contentInset={{bottom: this.props.safeAreaInsetsDefault.bottom}}
                          onEndReachedThreshold={0.5}
                          onEndReached={this.onEndReachedChat}
                          initialNumToRender={10}
                          windowSize={5}
                          renderItem={this.renderRow}
                          keyExtractor={(item, index) => {
                              return index + "";
                          }}
                          ListFooterComponent={this.renderFooter}/>

                <Animated.View style={[styles.header, {
                    height: HEADER_MAX_HEIGHT, transform: [{translateY: imageTranslate}],
                    top: this.props.safeAreaInsetsDefault.top
                }]}>
                    <Animated.View style={[styles.outerView]}>
                        {this.renderHeader()}
                    </Animated.View>
                </Animated.View>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}
                       onRequestClose={this.onCloseBtnPress}>
                    <ManageBiography onCloseBtnPress={this.onCloseBtnPress}
                                     rowData={{data: (memberDetail && memberDetail.biography) && memberDetail.biography || ""}}
                                     safeAreaInsetsDefault={this.props.safeAreaInsetsDefault}
                                     appTheme={this.props.appTheme}/>
                </Modal>
                <TouchableHighlight onPress={() => this.onBackButtonPress()}
                                    style={[styles.backView, {paddingTop: 10 + this.props.safeAreaInsetsDefault.top}]}
                                    underlayColor={Constant.transparent}>
                    <Ionicons name='ios-arrow-back'
                              size={35}
                              color={appColor.defaultFont}/>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#03A9F4',
        overflow: 'hidden',
    },
    outerView: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
    },
    titleText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: Constant.font700,
    },
    detailsText: {
        paddingTop: 8,
        fontSize: 12,
        fontFamily: Constant.font500,
        lineHeight: 18,
    },
    placeHolderText: {
        marginTop: 45,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: Constant.font500,
        maxWidth: 280,
        lineHeight: 21,
        alignSelf: 'center'
    },
    backView: {
        height: 60,
        width: 60,
        position: 'absolute',
        left: 10,
        top: Constant.isIOS && 20 || 0,
        paddingLeft: 5,
        backgroundColor: Constant.transparent,
        zIndex: 111
    },
});
const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        teamMemberEventList: state.team.teamMemberEventList || [],
        teamMemberEventPagination: state.team.teamMemberEventPagination || null,
        isConnected: state.user.isConnected,
        memberDetail: state.team.memberDetail || null,
        userEventList: state.team.userEventList || [],
        userEventPagination: state.team.userEventPagination || null,
        seenUserEvents: state.team.seenUserEvents || [],
        startEventViews: state.team.startEventViews || null,
        appBadgeCount: state.user.appBadgeCount,
        userCommunity: state.user.userCommunity || null,
        current_p_clean_days: state.statistic.pornDetail.current_p_clean_days,
    };
};

export default connect(mapStateToProps, {
    getEventsDetails,
    updateUserDetails,
    getCommentByAdviceId,
    getCommentByPostId,
    getMemberDetail,
    manageSeenEvents,
    manageActivityEventBadgeCount,
    manageStartEventViews
})(CommunityProfile);