import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Text, BackHandler,
    AppState
} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import {removeSafeArea, manageLifeTreeOnToday} from "../../../../../actions/userActions";
import {calculateCurrentGoalForLifeTree} from "../../../../../actions/statisticAction";
import moment from 'moment';
import _ from 'lodash';
import {callTodayScreenEcentListner} from "../../../../../helper/appHelper";
import AppStatusBar from '../../../../commonComponent/statusBar';
import LottieView from 'lottie-react-native';

const iconImage = {
    tree_sky_after_clean: {uri: 'tree_sky_clean'},
    tree_grass_after_clean: {uri: 'tree_grass_clean'},
    tree_sky_after_relapse: {uri: 'tree_sky_relapse'},
    tree_grass_after_relapse: {uri: 'tree_grass_relapse'}
};

const lifetreeImage = {
    animation: [
        require('../../../../../helper/animation/data_1'),
        require('../../../../../helper/animation/data_2'),
        require('../../../../../helper/animation/data_3'),
        require('../../../../../helper/animation/data_4'),
        require('../../../../../helper/animation/data_5'),
        require('../../../../../helper/animation/data_6'),
        require('../../../../../helper/animation/data_7'),
        require('../../../../../helper/animation/data_8'),
        require('../../../../../helper/animation/data_9'),
        require('../../../../../helper/animation/data_10'),
        require('../../../../../helper/animation/data_11'),
        require('../../../../../helper/animation/data_12'),
        require('../../../../../helper/animation/data_13'),
        require('../../../../../helper/animation/data_14'),
        require('../../../../../helper/animation/data_15'),
        require('../../../../../helper/animation/data_16'),
        require('../../../../../helper/animation/data_17'),
        require('../../../../../helper/animation/data_18'),
        require('../../../../../helper/animation/data_19'),
        require('../../../../../helper/animation/data_20'),
        require('../../../../../helper/animation/data_21'),
        require('../../../../../helper/animation/data_22'),
        require('../../../../../helper/animation/data_23'),
        require('../../../../../helper/animation/data_24'),
        require('../../../../../helper/animation/data_25'),
        require('../../../../../helper/animation/data_26'),
        require('../../../../../helper/animation/data_27'),
        require('../../../../../helper/animation/data_28'),
        require('../../../../../helper/animation/data_29'),
        require('../../../../../helper/animation/data_30'),
        require('../../../../../helper/animation/data_31'),
        require('../../../../../helper/animation/data_32'),
        require('../../../../../helper/animation/data_33'),
        require('../../../../../helper/animation/data_34'),
        require('../../../../../helper/animation/data_35'),
        require('../../../../../helper/animation/data_36'),
        require('../../../../../helper/animation/data_37'),
        require('../../../../../helper/animation/data_38'),
        require('../../../../../helper/animation/data_39'),
        require('../../../../../helper/animation/data_40'),
        require('../../../../../helper/animation/data_41'),
        require('../../../../../helper/animation/data_42'),
        require('../../../../../helper/animation/data_43'),
        require('../../../../../helper/animation/data_44'),
        require('../../../../../helper/animation/data_45'),
        require('../../../../../helper/animation/data_46'),
        require('../../../../../helper/animation/data_47'),
        require('../../../../../helper/animation/data_48'),
        require('../../../../../helper/animation/data_49'),
        require('../../../../../helper/animation/data_50'),
        require('../../../../../helper/animation/data_51'),
        require('../../../../../helper/animation/data_52'),
        require('../../../../../helper/animation/data_53'),
        require('../../../../../helper/animation/data_54'),
    ]
}

class LifeTree extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            treeImage: "",
            glowImage: "",
            backgroundImage: "",
            forgroundImage: "",
            treeGlowOpacity: 1,
            animationImg: "",
        };
    }

    componentWillMount(){
        callTodayScreenEcentListner(false);
        this.setImages();
        let interval1Id =  setInterval(() => {
            this.setImages()
        }, 60000);
        this.setState({
            interval1Id: interval1Id
        })
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentDidMount(){
        this.animation.play();
        this.animation1.play();
        if(this.props.todayLifeTree && this.props.todayLifeTree.isShow && !this.props.todayLifeTree.isCompleted){
            if(this.animation2){
                this.animation2.play();
            }
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        // if(this.props.navigation.state.params && this.props.navigation.state.params.scrollToTopToday) {
        // setTimeout(()=>{
        //     this.props.navigation.state.params.scrollToTopToday();
        // },1000)
        // }

        //this.props.todayLifeTree && this.props.todayLifeTree.isShow && !this.props.todayLifeTree.isCompleted
    }

    _handleAppStateChange = (nextAppState) => {
        if(nextAppState === 'active') {
            this.animation.play();
            this.animation1.play();
        }
    }

    handleBackPress = () => {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        if(this.props.todayLifeTree && this.props.todayLifeTree.isShow && !this.props.todayLifeTree.isCompleted){
            let dateToday = new Date().toDateString();
            this.props.manageLifeTreeOnToday({isShow: true,isCompleted: true, completedDate: dateToday});
        }
        if(this.props.navigation.state.params && this.props.navigation.state.params.onBackLifeTree) {
            this.props.navigation.state.params.onBackLifeTree();
            callTodayScreenEcentListner();
        }
        this.props.removeSafeArea(true);
        clearInterval(this.state.interval1Id);
    }

    //Set Images
    setImages(){
        let todayDate = moment().format("YYYY-MM-DD");
        let treeStatus = "clean";
        if(this.props.last_checkup_at === todayDate){
            let obj = _.find(this.props.p_array, {occurred_at: todayDate});
            if(obj !== undefined){
                if(obj.is_relapse){
                    //relapse
                    this.props.calculateCurrentGoalForLifeTree().then(res=>{
                        if(res > 0){
                            let lifeTree = res - 3;
                            if(lifeTree > 0){
                                lifeTree = (lifeTree > 53) ? 53 : lifeTree;
                                this.setLifeTree(treeStatus, lifeTree)
                            }else{
                                // treeStatus = 'relapse';
                                this.setLifeTree(treeStatus, 0)
                            }
                        }else{
                            treeStatus = 'relapse';
                            this.setLifeTree(treeStatus, 0)
                        }
                    })
                }else{
                    //clean
                    let cleanStreak = (this.props.current_clean_streak > 53) ? 53 : this.props.current_clean_streak;
                    this.setLifeTree(treeStatus, cleanStreak)
                }
            }else{
                let cleanStreak = (this.props.current_clean_streak > 53) ? 53 : this.props.current_clean_streak;
                this.setLifeTree(treeStatus, cleanStreak)
            }
        }else{
            let cleanStreak = (this.props.current_clean_streak > 53) ? 53 : this.props.current_clean_streak;
            if(cleanStreak > 0){
                cleanStreak = cleanStreak - 1;
            }
            this.setLifeTree(treeStatus, cleanStreak)
        }
    }

    setLifeTree = (treeStatus, cleanStreak) => {
        let currentHour = new Date().getHours();
        let backgroundImage = iconImage.tree_sky_after_clean;
        let forgroundImage = iconImage.tree_grass_after_clean;
        if(treeStatus === "relapse"){
            backgroundImage = iconImage.tree_sky_after_relapse
            forgroundImage = iconImage.tree_grass_after_relapse
        }
        let opacity = (currentHour > 17) ? 0.15 : 0.4;
        let animationImage = lifetreeImage['animation'][cleanStreak];
        this.setState({
            opacity: opacity,
            backgroundImage: backgroundImage,
            forgroundImage: forgroundImage,
            animationImg: animationImage,
        });
    }

    onBackButtonPress = () => {
        if(this.props.todayLifeTree && this.props.todayLifeTree.isShow && !this.props.todayLifeTree.isCompleted){
            let dateToday = new Date().toDateString();
            this.props.manageLifeTreeOnToday({isShow: true,isCompleted: true, completedDate: dateToday});
        }
        if(this.props.navigation.state.params && this.props.navigation.state.params.onBackLifeTree){
            //let dateToday = new Date().toDateString();
            this.props.navigation.state.params.onBackLifeTree();
            //this.props.manageLifeTreeOnToday({isShow: true,isCompleted: true, completedDate: dateToday});
        }else{
            this.props.removeSafeArea(true);
        }
        this.props.navigation.goBack();
    };

    render() {
        return (
            <View style={{flex:1,overflow:'hidden'}}>
                <AppStatusBar/>
                <Image style={styles.backImage}
                       source={this.state.backgroundImage} resizeMode="stretch"/>

                <Image style={styles.backImage}
                       source={this.state.forgroundImage}
                       resizeMode="stretch"/>

                <LottieView source={require('../../../../../helper/animation/data_cloud.json')}
                            ref={animation => {
                                this.animation1 = animation;
                            }}
                            style={{height:"100%", width:"100%",position:'absolute',top:0,left:0,right:0,bottom:0,
                                backgroundColor:'transparent'}}/>

                {
                    (this.state.animationImg != "") &&
                    <LottieView source={this.state.animationImg}
                                ref={animation => {
                                    this.animation2 = animation;
                                }}
                                progress={(this.props.todayLifeTree && this.props.todayLifeTree.isShow && !this.props.todayLifeTree.isCompleted) && 0 || 1}
                                loop={false}
                                imageAssetsFolder={"lottie/"}
                                style={{height:"100%", width:"100%",position:'absolute', left:0, top:0,backgroundColor:'transparent'}}/>
                }

                <LottieView source={require('../../../../../helper/animation/data')}
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{height:"100%", width:"100%",position:'absolute', left:0, top:0, backgroundColor:'transparent'}}/>

                {
                    (this.props.navigation.state.params && this.props.navigation.state.params.isFromTodayScreen) &&
                    <TouchableHighlight onPress={() => this.onBackButtonPress()}
                                        style={{position:'absolute', top:0,left:0,right:0,bottom:0,backgroundColor:'transparent'}}
                                        underlayColor={Constant.transparent}>
                        <Text style={styles.txtBottom}>
                            TAP TO RETURN
                        </Text>
                    </TouchableHighlight>
                    ||
                    <TouchableHighlight onPress={() => this.onBackButtonPress()}
                                        style={[styles.backView,{paddingTop:10+this.props.safeAreaInsetsDefault.top}]}
                                        underlayColor={Constant.transparent}>
                        <Ionicons name='ios-arrow-back'
                                  size={35}
                                  color="#FFF"/>
                    </TouchableHighlight>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backView:{
        height:60,
        width:60,
        position:'absolute',
        left:10,
        top:10,
        paddingLeft:5,
        backgroundColor: Constant.transparent
    },
    backImage: {
        height:Constant.screenHeight,
        width:Constant.screenWidth,
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        overflow:'hidden'
    },
    txtBottom:{
        paddingTop:Constant.screenHeight*0.92,
        fontSize: 12,
        color: '#FFF',
        textAlign: 'center',
        fontFamily: Constant.font700,
        backgroundColor:'transparent'
    },
});

const mapStateToProps = state => {
    return {
        current_clean_streak: state.statistic.pornDetail.current_p_clean_days,
        last_checkup_at: state.metaData.metaData.last_checkup_at || "",
        p_array:state.statistic.pornDetail.p_array,
        safeAreaInsetsDefault:state.user.safeAreaInsetsDefault,
        todayLifeTree: state.user.todayLifeTree || null,
    };
};

export default connect(mapStateToProps, {
    removeSafeArea,
    manageLifeTreeOnToday,
    calculateCurrentGoalForLifeTree
})(LifeTree);