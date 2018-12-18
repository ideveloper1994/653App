import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    RefreshControl, AsyncStorage, Alert, Text, LayoutAnimation, NetInfo
} from "react-native";
import Constant from "../../../helper/constant";
import {connect} from "react-redux";
import SmallButton from "../../commonComponent/smallButtonComponent";
import HelpOtherRow from "./component/helpOthers/helpOtherComponent";
import {getHelpPostDetail, sortHelpPost,
    likeHelpPost, unlikeHelpPost,
    getCommentByPostId, sortHelpPostRecent} from "../../../actions/helpPostActions";
import NewHelpPost from "./component/helpOthers/comment/newHelpPost";
import {showCustomAlert, showNoInternetAlert} from "../../../helper/appHelper";
import _ from 'lodash';
import { getEventsDetails, getMemberDetail } from '../../../actions/teamAction';

let isApiCalling = false;
let inProcessId = 0;

let sortIcon = {
    "New": {uri:'sort_new'},
    "Hot": {uri:'sort_hot'},
    "Top": {uri:'sort_top'}
};

class HelpOthers extends Component {

    constructor(props){
        super(props);
        this.state={
            modalVisible: false,
            selectedId: 0,
            isRefreshing: false,
            selectedTab: 1,
            isShowAll: false,
            isVisibleAll: false,
            arrSort:[{value: 2, label: "New"},{value: 1, label: "Hot"},{value: 0, label: "Top"}],
            isEdit: false,
            editData: {},
            isShowData:false
        };
        isApiCalling = false;
        inProcessId = 0;
    }

    componentWillMount () {
        let selectedType = 1;
        if(this.props.sortType === "top"){
            selectedType = 0;
        }else if(this.props.sortType === "new"){
            selectedType = 2;
        }
        this.setState({
            selectedTab: selectedType,
        });
    }

    componentDidMount() {
        //call if lazy = true
        /*
        if(!this.state.isShowData && this.props.visibleTab == "milestone"){
            setTimeout(()=>{
                this.setState({
                    isShowData: true
                })
            },300);
        }*/
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.visibleTab == "milestone"){
            if(!this.state.isShowData){
                setTimeout(()=>{
                    this.setState({
                        isShowData: true
                    })
                },300);
            }
        }
    }

    //show Community Profile
    onPressCommunityProfileIcon = (memberDetail) => {
        if(memberDetail){
            let instance = memberDetail;
            instance.porn_free_days = {
                total:memberDetail.stats.porn_free_days,
                longest_streak:0,
                current_streak:0,
            }
            instance.hearts_count = 0;
            instance.biography = "";
            if(memberDetail.is_current_user && this.props.userCommunity) {
                    instance = this.props.userCommunity;
            }
            this.props.navigation.navigate("communityProfile"+"Card",{transition: "myCustomSlideRightTransition",
                isCurrentUser:memberDetail.is_current_user, memberDetail: instance})
            this.props.getMemberDetail(memberDetail.id, memberDetail.is_current_user).then(res=>{
                this.props.getEventsDetails(memberDetail.id,null, memberDetail.is_current_user);
            });
        }
    }

    onPostHelpPress = () => {
        AsyncStorage.getItem("getHelpDateHour").then(getHelpAdvice => {
            let today = new Date().toDateString();
            let hour = new Date().getHours();
            let objdateHour = JSON.stringify({addedDate: today, postedHour: hour});
            if(getHelpAdvice === null || getHelpAdvice !== objdateHour) {
                this.setState({
                    modalVisible: true,
                    isEdit: false,
                    editData: {}
                });
            }else{
                showCustomAlert("Post limit exceeded",
                    "You can only write a help post once per hour","OK",
                    this.props.appTheme === Constant.lightTheme)
            }
        });
    };

    onSortPress = (type) => {
        //     this.props.sortHelpPost(!this.props.isHelpPostSort, this.props.helpPostList);
        if(this.props.isConnected) {
            this.props.sortHelpPostRecent(type).then((response) => {
                if(this.refs.flatlist){
                    this.refs.flatlist.scrollToIndex({index: 0, animated: false})
                }
            }).catch((error) => {
                console.log(error)
            });
        } else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    changeTab = (selected) => {
        LayoutAnimation.easeInEaseOut();
        if(selected === 0 && this.state.selectedTab !== 0){
            this.onSortPress("top");
        }
        else if(selected === 1 && this.state.selectedTab !== 1){
            this.onSortPress("hot");

        }else if(selected === 2 && this.state.selectedTab !== 2){
            this.onSortPress("new");
        }

        if(this.state.selectedTab === selected && !this.state.isShowAll){
            this.setState({
                selectedTab: selected,
                isShowAll:true
            });
        }else{
            this.setState({
                selectedTab: selected,
                isShowAll:false
            });
        }
    };

    onRowSelect = (rowData)=> {
        this.props.getCommentByPostId(rowData.id);
        this.props.navigation.navigate('postCommentCard', { rowData: rowData, transition: "myCustomSlideRightTransition",
            onPressCommunityProfileIcon:this.onPressCommunityProfileIcon});
    };

    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false,
            isEdit: false,
            editData: {}
        });
    };

    onEndReachedHelpPost = () => {
        try{
            if(this.props.isConnected) {
                if(!isApiCalling){
                    if(this.props.helpPostPagination && this.props.helpPostPagination.next_page_url) {
                        isApiCalling = true;
                        this.props.getHelpPostDetail(this.props.helpPostPagination.next_page_url).then(res=>{
                            isApiCalling = false;
                        }).catch(err=>{
                            isApiCalling = false;
                        });
                    }
                }
            }
        }catch (e){
            isApiCalling = false;
            console.log("Help other",e);
        }
    };

    onRefresh = () => {
        if(this.props.isConnected) {
            this.setState({isRefreshing: true});
            this.props.sortHelpPostRecent(this.props.sortType).then((response) => {
                this.setState({isRefreshing: false});
            }).catch((error) => {
                this.setState({isRefreshing: false});
                console.log(error)
            });
        } else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);;
        }
    };

    likeHelpPost = (id) => {
        if(this.props.isConnected){
            if(id !== undefined && inProcessId !== id){
                inProcessId = id;
                this.props.likeHelpPost(id).then(res=>{
                    inProcessId = 0;
                }).catch(err=>{
                    inProcessId = 0;
                });
            }
        }else {
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);;
        }
    };

    unlikeHelpPost = (id) => {
        if(this.props.isConnected){
            if(id !== undefined && inProcessId !== id){
                inProcessId = id;
                this.props.unlikeHelpPost(id).then(res=>{
                    inProcessId = 0;
                }).catch(err=>{
                    inProcessId = 0;
                });
            }
        }else{
            showNoInternetAlert(this.props.appTheme === Constant.lightTheme);
        }
    };

    renderSortElement = ({value, label}) => {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TouchableOpacity onPress={()=>this.changeTab(value)}
                              key={value}
                              style={(value === this.state.selectedTab) && [styles.selectedSideBtn,{backgroundColor: appColor.selectedSortBtn}]
                              || [styles.sideBtn,{backgroundColor: appColor.unselectedSortBtn}]}>
                <View style={styles.sideView}>
                    <Image style={styles.img} resizeMode={'contain'}
                           source={sortIcon[label]}/>
                    <Text style={styles.sideText}>
                        {label}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };

    onEditButtonPress = (rowDara) => {
        this.setState({
            modalVisible: true,
            isEdit: true,
            editData: rowDara
        });
    };

    renderItem = ({item, index}) => {
        if(item && item.content){
            return( <HelpOtherRow
                rowData={item}
                likeHelpPost={this.likeHelpPost}
                unlikeHelpPost={this.unlikeHelpPost}
                key={index}
                appTheme={this.props.appTheme}
                avatar_id={this.props.avatar_id}
                onRowSelect={this.onRowSelect}
                onEditButtonPress={this.onEditButtonPress}
                onPressCommunityProfileIcon={this.onPressCommunityProfileIcon}/>)
        }
        return <View/>
    }

    render() {
        let views = [];
        let arr = this.state.arrSort;
        if(this.state.isShowAll){
            let selectedObj = _.find(arr, {value: this.state.selectedTab});
            let objIndex = _.findIndex(arr, {value: this.state.selectedTab});
            arr.splice(objIndex, 1);
            arr.push(selectedObj);
            arr.map((obj)=>{
                views.push(this.renderSortElement(obj));
            })
        }else{
            arr.map((obj)=>{
                if(obj.value === this.state.selectedTab) {
                    views.push(this.renderSortElement(obj));
                }
            })
        }
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            !this.state.isShowData &&
            <View/>
            ||
            <View style={{flex:1}}>
                <FlatList ref='flatlist'
                          style={{paddingTop: 9}}
                          showsVerticalScrollIndicator={false}
                          removeClippedSubviews={false}
                          data={this.props.helpPostList}
                          onEndReachedThreshold={0.5}
                          onEndReached={this.onEndReachedHelpPost}
                          automaticallyAdjustContentInsets={false}
                          contentInset={{bottom:55}}
                          keyExtractor={(item, index) => {
                              return index+"";
                          }}
                          initialNumToRender={10}
                          windowSize={5}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.isRefreshing}
                                  onRefresh={this.onRefresh}
                                  tintColor={appColor.appRefreshControl}
                              />}
                          renderItem={this.renderItem}/>
                <View style={ styles.btnPostAdvise }>
                    <SmallButton title="Get help"
                                 color={'white'}
                                 otherStyle={{width:130,height:38}}
                                 backColor={appColor.poastButton}
                                 onPress={()=>{this.onPostHelpPress()}}/>
                </View>

                <View style={{ right:15, bottom: 10,position: 'absolute', backgroundColor:'transparent'}}>
                    {views}
                </View>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}
                       onRequestClose={this.onCloseBtnPress}>
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
        paddingBottom:100
    },
    btnPostAdvise:{
        alignSelf: 'center',
        backgroundColor: Constant.transparent,
        position:'absolute',
        bottom:10,
        left:0,
        right:0
    },
    textDetail:{
        color: '#FFF',
        fontSize: 15,
        fontFamily: Constant.font700,
    },
    btnPostSort:{
        alignSelf: 'flex-end',
        backgroundColor: '#003e53',//Constant.transparentBackColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding:10,
        borderRadius: 30,
        position:'absolute',
        right:10,
        bottom:10,
    },
    sideBtn:{
        marginTop:10,
        height:38,
        width: 75,
        borderRadius: 30,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: Constant.lightTheamColor
    },
    selectedSideBtn:{
        marginTop:10,
        height:38,
        width: 75,
        borderRadius: 30,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#003e53',
    },
    sideView:{
        flexDirection:'row',
        width:75,
        justifyContent:'center',
        height:38,
        alignItems:"center"
    },
    img:{
        width:16,
        height:16
    },
    sideText:{
        color:'#FFF',
        fontSize:15,
        fontFamily:Constant.font500,
        marginLeft:4
    }
});

const mapStateToProps = state => {
    return {
        helpPostList: state.helpPost.helpPostList,
        helpPostPagination:state.helpPost.helpPostPagination,
        isHelpPostSort: state.helpPost.isHelpPostSort,
        avatar_id:state.user.userDetails && state.user.userDetails.avatar_id || 0,
        isConnected: state.user.isConnected,
        sortType:state.helpPost.sortType || "hot",
        appTheme: state.user.appTheme,
        userCommunity: state.user.userCommunity || null,
        visibleTab: state.user.visibleTab,
    };
};

export default connect(mapStateToProps, {
    getHelpPostDetail, sortHelpPost, getCommentByPostId, sortHelpPostRecent,
    likeHelpPost, unlikeHelpPost, getEventsDetails, getMemberDetail
})(HelpOthers);