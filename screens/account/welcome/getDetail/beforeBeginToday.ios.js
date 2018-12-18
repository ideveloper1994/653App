import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableHighlight,
    AsyncStorage
} from 'react-native';
import BeforeBeginComponent from './beforeBeginComponent';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import { updateUserDetail } from '../../../../actions/userActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InitialSplashView from '../../../commonComponent/initialSplashScreen';
import {NavigationActions, StackActions} from "react-navigation";

class BeforeBeginLogin extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isFirstName: props.userDetails.name == "Unknown",
            userDetails: props.userDetails,
            avatarId: 0,
            isReceivedProps: false,
            pageNum: 0,
            isAvatarId: props.userDetails.avatar_id == 0
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        AsyncStorage.setItem("isUserDetailSet",'true');
        if(this.props.userDetails.avatar_id != 0 && this.props.userDetails.name != "Unknown"){
            this.navigateToNextScreen();
        }
        setTimeout(()=>{
            if(!this.state.isReceivedProps){
                this.setState({
                    isReceivedProps: this.props.userDetails.name == "Unknown" || this.props.userDetails.avatar_id == 0,
                    isFirstName: this.props.userDetails.name == "Unknown",
                    isAvatarId: this.props.userDetails.avatar_id == 0
                });
                if(this.props.userDetails.avatar_id != 0 && this.props.userDetails.name != "Unknown"){
                    this.navigateToNextScreen();
                }
            }
            setTimeout(()=>{
                if(!this.state.isReceivedProps){
                    this.navigateToNextScreen();
                }
            },800)
        },800);
    }

    navigateToNextScreen = () => {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "rootTabNavigation", params: {transition: "fadeIn", isFadeToday:true}})],
        }))
    }

    componentWillReceiveProps (nextProps){
        if(!this.state.isReceivedProps){
            this.setState({
                isFirstName: nextProps.userDetails.name == "Unknown",
                userDetails: nextProps.userDetails,
                isReceivedProps: true,
                isAvatarId: nextProps.userDetails.avatar_id == 0
            },()=>{
                if(nextProps.userDetails.avatar_id == 0 || nextProps.userDetails.name == "Unknown"){
                    this.refs.firstView.fadeIn(600);
                }
            });
            if(nextProps.userDetails.avatar_id != 0 && nextProps.userDetails.name != "Unknown"){
                this.navigateToNextScreen();
            }
        }
    }

    onPressNext = (selectedItem, type) => {
        let pageNo = 0;
        let userObj = this.state.userDetails;
        switch (type){
            case "firstName":
                userObj.name = selectedItem;
                this.setState({
                    userDetails: userObj
                });
                pageNo=1;
                if(this.state.isAvatarId){
                    this.scrollToNextView(pageNo);
                }else{
                    setTimeout(()=>{
                        this.props.updateUserDetail(userObj);
                        this.navigateToNextScreen();
                    },200);
                }
                break;
            case "chooseAvatar":
                if(selectedItem == 1) {
                    if(userObj.gender.includes("female")){
                        selectedItem = 46;
                    }
                }
                userObj.avatar_id = selectedItem;
                this.props.updateUserDetail(userObj);
                setTimeout(()=> {
                    this.navigateToNextScreen();
                },200);
                break;
        }
    };


    scrollToNextView = (pageNo) => {
        setTimeout(()=>{
            if(this.refs.mainScroll) {
                this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
            }
        },200);
    };

    onScroll = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        if(this.state.pageNum != pageNum){
            this.setState({
                pageNum: pageNum
            });
        }
    };

    onBackButtonPress = () => {
        let pageNo = this.state.pageNum - 1;
        if(this.refs.mainScroll) {
            this.refs.mainScroll.scrollTo({x: (Constant.screenWidth * pageNo), y: 0, animated: true});
        }
    };

    render() {
        return (
            <View style={styles.container}>
                {
                    (this.state.isReceivedProps) &&
                    <View style={styles.container}>
                        <ScrollView style={{flex:1}}
                                    bounces={false}
                                    pagingEnabled={true}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    scrollEnabled={false}
                                    onMomentumScrollEnd={this.onScroll}
                                    ref="mainScroll">

                            {
                                (this.state.isFirstName)
                                &&
                                <Animatable.View style={styles.outerView} ref="firstView">
                                    <BeforeBeginComponent pickerItems={this.state.arrDays}
                                                          subTitle={"What is your first name?"}
                                                          type="firstName"
                                                          selectedDay={""}
                                                          onPressNext={this.onPressNext} />
                                </Animatable.View>
                                || null
                            }
                            {
                                (this.state.isAvatarId)
                                &&
                                <Animatable.View style={styles.outerView} ref="firstView">
                                    <BeforeBeginComponent pickerItems={this.state.arrDays}
                                                          subTitle={(this.state.isFirstName)
                                                          && "Finally, choose your avatar."
                                                          || "Choose an avatar"}
                                                          type="chooseAvatar"
                                                          selectedDay={1}
                                                          onPressNext={this.onPressNext} />
                                </Animatable.View>
                                || null
                            }
                        </ScrollView>
                        {
                            (this.state.pageNum) &&
                            <TouchableHighlight onPress={() => this.onBackButtonPress()}
                                                style={[styles.backView,{paddingTop:10+this.props.safeAreaInsetsDefault.top}]}
                                                underlayColor={Constant.transparent}>
                                <Ionicons name='ios-arrow-back'
                                          size={35}
                                          color="rgba(255,255,255,0.7)"/>
                            </TouchableHighlight>
                            || null
                        }
                    </View>
                    ||
                    <InitialSplashView/>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgb(22,93,120)',
    },
    outerView:{
        height: Constant.screenHeight,
        width: Constant.screenWidth
    },
    backView:{
        height:60,
        width:60,
        position:'absolute',
        left:10,
        top:10,
        paddingLeft:5,
        backgroundColor: Constant.transparent
    },
});

const mapStateToProps = state => {
    return {
        userDetails: state.user.userDetails,
        safeAreaInsetsDefault:state.user.safeAreaInsetsDefault,
    };
};

export default connect(mapStateToProps, {
    updateUserDetail
})(BeforeBeginLogin);