import React, {Component} from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing
} from 'react-native';
import Constant from '../../../helper/constant';
import {connect} from 'react-redux';
import MessageList from './dailyCheckUp';
import moment from 'moment';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {removeSafeArea, managePopupQueue, manageCheckupPopup} from "../../../actions/userActions";
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner} from "../../../helper/appHelper";
import AppStatusBar from './../../commonComponent/statusBar';

let isContinuePress = true

class CheckupComplete extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            backColor: "transparent",
            topText: "",
            showList: false
        };
        this.position = new Animated.ValueXY(0, 0);
        this.showAnimation = true;
        this.fadeInAnimation = new Animated.Value(0);
    }

    componentDidMount() {
        try{
            isContinuePress = true;
            this.setMidNight();
            if (this.showAnimation) {
                setTimeout(() => {
                    this.setState({
                        showList: false
                    }, () => {
                        setTimeout(() => {
                            Animated.timing(this.position, {
                                toValue: {x: 0, y: -Constant.fullScreenHeight * 0.27},
                                duration: 300,
                                easing: Easing.linear
                            }, {useNativeDriver: true}).start(() => {
                                this.setState({
                                    showList: false
                                });
                                Animated.timing(this.fadeInAnimation, {
                                    toValue: 1,
                                    duration: 500
                                },{useNativeDriver: true}).start()

                            });
                        }, 500);
                    });
                }, 400);
                this.showAnimation = false;
            }
        }catch (e){
            console.log(e);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setMidNight();
    }

    setMidNight = () => {
        let topText = "";
        let backColor = 'transparent';
        let todayDate = moment().format("YYYY-MM-DD");
        let obj = _.find(this.props.p_array, {occurred_at: todayDate});
        if (obj !== undefined) {
            if (obj.is_relapse) {
                topText = "TOMORROW IS A NEW DAY";
                backColor = "#58c0f4";
            } else {
                topText = "UPDATES AT MIDNIGHT";
                backColor = "#48b3ae";
            }
            if (this.state.backColor !== backColor && this.state.topText !== topText) {
                this.setState({
                    backColor: backColor,
                    topText: topText
                });
            }
        }
    };

    onContinuePress = () => {
        AsyncStorage.setItem('isCheckupClicked', "false");
        if (isContinuePress) {
            this.props.manageCheckupPopup({
                isShow: false,
                checkUpDetail: {}
            });
            let obj = this.props.popupQueue;
            obj.checkup = null;
            this.props.managePopupQueue(obj);
            this.props.removeSafeArea(true);
            if (this.props.navigation.state.params.isPornFreeDay) {
                AsyncStorage.setItem('isTodayCheckUpDone', "true");
            }

            if (this.props.navigation.state.params && this.props.navigation.state.params.onBackToTabView) {
                callTodayScreenEcentListner();
                this.props.navigation.state.params.onBackToTabView()
            }
            if (this.props.navigation.state.params && this.props.navigation.state.params.scrollToTopToday) {
                callTodayScreenEcentListner();
                this.props.navigation.state.params.scrollToTopToday()
            }

            this.props.navigation.popToTop();
        }
        isContinuePress = false
    };

    render() {
        //const top = (Constant.isIOS) && ((Constant.fullScreenHeight/2-49) - (Constant.fullScreenHeight*0.108)) || ((Constant.fullScreenHeight/2-40) - (Constant.fullScreenHeight*0.108))
        let msg = MessageList[parseInt(moment.duration(moment(new Date()).diff(moment().startOf('year'))).asDays())];
        return (
            <View style={styles.container}>
                <AppStatusBar backColor='rgb(90,194,189)'/>
                <Animated.View style={[{
                    height: Constant.fullScreenHeight, width: Constant.screenWidth,
                    justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, right: 0, bottom: 0
                },
                    this.position.getLayout()]}>

                    <View style={{backgroundColor: 'transparent', alignItems: 'center'}}>
                        <Animatable.Image source={{uri:'complete_large_tick_icon'}}
                                          style={styles.mainIcon}
                                          easing="ease-out-back"
                                          useNativeDriver={true}
                                          animation="zoomIn"
                                          ref="imgCircle"
                                          duration={400}
                                          delay={200}
                                          resizeMode={"contain"}/>

                        <Animatable.Text style={styles.titleText}
                                         animation="fadeIn"
                                         useNativeDriver={true}
                                         delay={200}
                                         duration={400}>
                            {"Checkup complete"}
                        </Animatable.Text>

                        <Animated.View style={{alignItems: 'center', marginTop: 10, opacity: this.fadeInAnimation}}>
                            <View style={{
                                backgroundColor: this.state.backColor, borderRadius: 5,
                                height: 24, paddingLeft: 10, paddingRight: 10, justifyContent: 'center'
                            }}>
                                <Text style={styles.subTitleText}>
                                    {this.state.topText}
                                </Text>
                            </View>
                        </Animated.View>
                    </View>

                </Animated.View>
                <Animated.View style={{
                    top: 0, left: 0, right: 0, bottom: 0, position: 'absolute',
                    alignItems: 'center', backgroundColor: 'transparent', opacity: this.fadeInAnimation
                }}>

                    <View style={[{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: Constant.fullScreenHeight,
                        position: 'absolute',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        justifyContent: 'center'
                    }]}>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{marginRight: 60, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.textTotal}>
                                    {this.props.current_p_clean_days.toString() || 0}
                                </Text>
                                <Text style={styles.txtSubTitle}>
                                    {"Current porn-free \n streak"}
                                </Text>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.textTotal}>
                                    {this.props.total_p_clean_days.toString() || 0}
                                </Text>
                                <Text style={styles.txtSubTitle}>
                                    {"Total porn-free \n days"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        top: Constant.fullScreenHeight * 0.22,
                        left: 0,
                        right: 0,
                        height: Constant.fullScreenHeight,
                        bottom: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        justifyContent: 'center'
                    }}>
                        <Image source={{uri:'checkup_quote_icon_orange'}}
                               style={{height: 27, width: 30}}
                               resizeMode={"contain"}/>
                        <Text style={styles.txtDetail}>
                            {msg}
                        </Text>
                    </View>

                    <View
                        style={{top: 0, left: 0, right: 0, bottom: 0, position: 'absolute', alignItems: 'center'}}>
                        <TouchableHighlight onPress={() => this.onContinuePress()}
                                            style={{flex: 1, width: "100%"}}
                                            underlayColor={Constant.transparent}>
                            <Text style={styles.txtBottom}>
                                TAP ANYWHERE TO COMPLETE
                            </Text>
                        </TouchableHighlight>
                    </View>
                </Animated.View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(90,194,189)',
        alignItems: 'center'
    },
    mainIcon: {
        height: 88,
        width: 88,
    },
    titleText: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: Constant.font300,
        marginTop: 14
    },
    subTitleText: {
        fontSize: 12,
        color: '#FFF',
        fontFamily: Constant.font700,
    },
    textTotal: {
        fontSize: 36,
        color: '#FFF',
        fontFamily: Constant.font700,
    },
    textTotalPorn: {
        fontSize: 36,
        color: '#FFF',
        fontFamily: Constant.font700,
    },
    txtSubTitle: {
        marginTop: 12,
        fontSize: 12,
        color: '#b9e2e0',
        textAlign: 'center',
        fontFamily: Constant.font700,
    },
    txtDetail: {
        marginTop: 16,
        fontSize: 15,
        color: '#e4f4f3',
        textAlign: 'center',
        fontFamily: Constant.font500,
        width: "80%",
        lineHeight: 22,
    },
    txtBottom: {
        marginTop: (Constant.isIOS) && Constant.fullScreenHeight * 0.92 - 10 || Constant.fullScreenHeight * 0.92 - 30,
        fontSize: 12,
        color: '#b9e2e0',
        textAlign: 'center',
        fontFamily: Constant.font700,
        padding: 10
    },
});

const mapStateToProps = state => {
    return {
        p_array: state.statistic.pornDetail.p_array,
        total_p_clean_days: state.statistic.pornDetail.total_p_clean_days,
        current_p_clean_days: state.statistic.pornDetail.current_p_clean_days,
        best_p_clean_days: state.statistic.pornDetail.best_p_clean_days,
        popupQueue: state.user.popupQueue,
    };
};

export default connect(mapStateToProps, {
    removeSafeArea, managePopupQueue, manageCheckupPopup
})(CheckupComplete);