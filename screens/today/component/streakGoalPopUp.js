import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing,
    AsyncStorage, Linking, Alert
} from 'react-native';
import {connect} from 'react-redux';
import Constant from '../../../helper/constant';
import AchievementIcon from '../../tabs/progress/subComponent/achievementIcon';
import Button from '../../../screens/commonComponent/button';
import _ from 'lodash';
import moment from 'moment';
import * as StoreReview from 'react-native-store-review';
import Rate, {AndroidMarket} from 'react-native-rate';
import {showThemeAlert} from "../../../helper/appHelper";

let isClicked = false;

class StreakPopUp extends Component {

    constructor(props) {
        super(props);
        this.offset = new Animated.Value(Constant.screenHeight);
        this.animatedValue = new Animated.ValueXY(0, 0);
    }

    componentWillMount() {
        this.animatedValue = new Animated.ValueXY(0, 0);
        isClicked = false;
    }

    componentDidMount() {
        this.cycleAnimation();
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),
            toValue: 0,
            useNativeDriver: true
        }).start();
    }

    cycleAnimation() {
        this.animatedValue.setValue({x: 0, y: -((Constant.screenWidth * 10.67) - Constant.screenHeight)});
        Animated.timing(this.animatedValue, {
            toValue: {x: 0, y: 0},
            duration: 90000,
            easing: Easing.linear
        }, {useNativeDriver: true}).start(() => {
            setTimeout(() => {
                this.cycleAnimation();
            }, 0)
        });
    }

    hidePopup = () => {
        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(() => {
            this.props.onHidePopup()
        });
    };

    onButtonPress = () => {
        if (!isClicked) {
            isClicked = true;
            if (this.props.currentGoal.goalDays < 30 && this.props.currentGoal.previousAchieved > 1) {
                AsyncStorage.getItem("AppInstallationDate").then(res => {
                    if (res) {
                        let iDate = moment(res, 'YYYY-MM-DD').toDate();
                        let diff = moment().diff(iDate, 'days');
                        if (diff >= 2) {
                            AsyncStorage.getItem("isAskToGiveRate").then(isAsk => {
                                if (isAsk === null || isAsk !== "true") {
                                    Animated.timing(this.offset, {
                                        duration: 200,
                                        toValue: Constant.screenHeight,
                                        useNativeDriver: true
                                    }).start(() => {
                                        this.showRatePopup();
                                        this.props.onHidePopup()
                                    });
                                } else {
                                    this.hidePopup();
                                }
                            }).catch(err => {
                                console.log("err", err)
                                this.hidePopup();
                            });
                        } else {
                            this.hidePopup();
                        }
                    } else {
                        this.hidePopup();
                    }
                }).catch(err => {
                    // alert("catch", err)
                    console.log("err", err)
                    this.hidePopup();
                });
            } else {
                // alert("else part")
                this.hidePopup();
            }
        }
    };

    showRatePopup = () => {
        if (Constant.isIOS) {
            if (StoreReview.isAvailable) {
                //alert("Ask for rate popup");
                StoreReview.requestReview();
                AsyncStorage.setItem("isAskToGiveRate", "true");
            }
        } else {
            showThemeAlert({
                title: "Enjoying Brainbuddy?",
                message: "Please take a moment to leave a review.",
                leftBtn: "Never ask again",
                leftPress: () => {
                },
                rightBtn: "Review now",
                rightPress: () => {
                    let options = {
                        GooglePackageName: "com.brainbuddy.android",
                        preferredAndroidMarket: AndroidMarket.Google,
                        preferInApp: false,
                    };
                    Rate.rate(options, (success) => {
                        if (success) {
                            //rated
                        }
                    });
                },
                isLightTheme: this.props.appTheme === Constant.lightTheme
            });
            AsyncStorage.setItem("isAskToGiveRate", "true");
        }
    };

    onPopupPress = (obj) => {
    };

    getLabel = () => {
        if (this.props.currentGoal.previousAchieved <= 1) {
            return "24 hours clean";
        } else {
            return this.props.currentGoal.previousAchieved + " days clean";
        }
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={styles.outerView}>
                <View style={[styles.transparentView, {
                    backgroundColor: appColor.todayPopupBackgroundColor,
                    opacity: appColor.todayPopupBackOpacity || 0.5
                }]}/>
                <View style={{position: 'absolute', width: '100%', height: Constant.screenHeight}}>
                    <Animated.View style={{
                        width: Constant.screenWidth, height: Constant.screenWidth * 10.67,
                        marginTop: this.animatedValue.y
                    }}>
                        <Image source={{uri:'intro_slider_confetti8000'}}
                               resizeMode={"contain"}
                               style={{
                                   width: Constant.screenWidth,
                                   height: Constant.screenWidth * 10.67,
                                   opacity: 0.3
                               }}/>
                    </Animated.View>

                </View>
                <Animated.View style={[styles.innerPopupView, {transform: [{translateY: this.offset}]}]}>
                    <AchievementIcon objIcon={{
                        icon: "Y", val: (this.props.currentGoal.previousAchieved)
                        && this.props.currentGoal.previousAchieved.toString() || 1
                    }}
                                     otherStyle={{height: 80, width: "100%"}}
                                     imageStyle={{height: 80, width: "100%"}}
                                     onIconPress={this.onPopupPress}/>
                    <Text style={styles.topTitle}>
                        {"Streak goal achieved"}
                    </Text>
                    <Text style={styles.subTitle}>
                        {this.getLabel()}
                    </Text>
                    <Button title={"Continue"}
                            backColor="#FFF"
                            color='rgb(237,194,115)'
                            otherStyle={{height: 60, width: '86%', marginTop: 30}}
                            otherTextStyle={{fontSize: 15, fontFamily: Constant.font700}}
                            onPress={this.onButtonPress}/>
                </Animated.View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView: {
        width: Constant.screenWidth,
        height: Constant.screenHeight,
        top: 0, left: 0,
        position: 'absolute', backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transparentView: {
        top: 0, left: 0, right: 0, bottom: 0, position: 'absolute',
        backgroundColor: '#173d51',
        opacity: 0.9, alignItems: 'center', justifyContent: 'center'
    },
    innerPopupView: {
        backgroundColor: 'rgb(237,194,115)',
        width: Constant.screenWidth - 40,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 13,
        paddingTop: 41,
        height: 320,
        marginBottom: 10,
        maxWidth: 340,
    },
    topTitle: {
        color: "#f7e4c5",
        fontSize: 15,
        marginTop: 24,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
    bottomTitle: {
        color: "#f7e4c5",
        fontSize: 14,
        marginTop: 20,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
    subTitle: {
        color: "#fff",
        fontSize: 22,
        marginTop: 10,
        fontFamily: Constant.font300,
        textAlign: 'center'
    },
});

const mapStateToProps = state => {
    return {
        currentGoal: state.statistic.currentGoal,
    };
};

export default connect(mapStateToProps, {})(StreakPopUp);