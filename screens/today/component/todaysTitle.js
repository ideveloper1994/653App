import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    TouchableOpacity,
} from 'react-native';
import Constant from '../../../helper/constant';
import ProgressBar from '../../commonComponent/progressBar';
import moment from "moment/moment";
import * as StoreReview from "react-native-store-review/index";
import {find} from 'lodash';
import {showThemeAlert} from "../../../helper/appHelper";
import {managePopupQueue, removeSafeArea} from "../../../actions/userActions";
import {connect} from "react-redux";
import {addNewCheckupQuestion, setCheckupData} from "../../../actions/metadataActions";

class TodayTitle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowStreakHelp: false,
            streakCase: ""
        }
    }

    componentDidMount() {
        this.isShowHelpBtn(this.props.pornDetail.p_array);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            this.isShowHelpBtn(nextProps.pornDetail.p_array);
        }
    }

    performButtonProcess = (p_array) => {
        try{
            let todayDate = moment().format("YYYY-MM-DD");
            AsyncStorage.getItem("AppInstallationDate").then(installDate => {
                if (installDate) {
                    if (installDate != todayDate) {
                        AsyncStorage.getItem("AppLoginDate").then(loginDate => {
                            if (loginDate) {
                                if (loginDate != todayDate) {
                                    let yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                                    let yesterdayObj = find(p_array, {occurred_at: yesterdayDate});
                                    if (yesterdayObj !== undefined) {
                                        //case 1
                                        if (yesterdayObj.is_relapse) {
                                            //Yesterday is marked as relapse
                                            let i = 2;
                                            let isFound = false;
                                            while (i <= 4) {
                                                let date = moment().subtract(i, 'days').format('YYYY-MM-DD');
                                                if (find(p_array, {occurred_at: date, is_relapse: false}) !== undefined) {
                                                    isFound = true;
                                                    break;
                                                }
                                                i += 1;
                                            }
                                            if (isFound) {
                                                this.showHelpButton(true, 'Yesterday_Replase');
                                            } else {
                                                this.showHelpButton(false);
                                            }
                                        } else {
                                            this.showHelpButton(false);
                                        }
                                    } else {
                                        //case 2
                                        let i = 2;
                                        let isFound = false;
                                        while (i <= 4) {
                                            let date = moment().subtract(i, 'days').format('YYYY-MM-DD');
                                            if (find(p_array, {occurred_at: date, is_relapse: false}) !== undefined) {
                                                isFound = true;
                                                break;
                                            }
                                            i += 1;
                                        }
                                        if (isFound) {
                                            this.showHelpButton(true, "Miss_Yesterday");
                                        } else {
                                            this.showHelpButton(false);
                                        }
                                    }
                                }
                            } else {
                                AsyncStorage.setItem("AppLoginDate", installDate);
                            }
                        }).catch(err => {
                            console.log(err)
                        });
                    }
                }
            }).catch(err => {
                console.log(err)
            });
        }catch (e){
            console.log(e)
        }
    }

    isShowHelpBtn = (p_array) => {
        let todayDate = moment().format("YYYY-MM-DD");
        if (this.props.currentGoal.goalDays == 1) {
            AsyncStorage.getItem("SteakHelpData").then(helpData => {
                if (helpData) {
                    let streakData = JSON.parse(helpData);
                    if (streakData.seenDate !== todayDate) {
                        this.performButtonProcess(p_array);
                    } else {
                        this.showHelpButton(false, "");
                    }
                } else {
                    this.performButtonProcess(p_array);
                }
            }).catch(err => {
                this.performButtonProcess(p_array);
            })
        } else {
            this.showHelpButton(false, "");
        }
    }

    showHelpButton = (flag, streakCase) => {
        if (this.state.isShowStreakHelp !== flag || this.state.streakCase !== streakCase) {
            this.setState({
                isShowStreakHelp: flag,
                streakCase: streakCase
            });
        }
    }

    onBtnPress = () => {
        if (this.state.streakCase == "Miss_Yesterday") {
            showThemeAlert({
                title: "Why has my porn streak reset?",
                message: "Your current porn clean streak has reset because you missed your checkup yesterday.",
                leftBtn: "Complete missed checkup",
                leftPress: () => {
                    this.props.performYesterdayCheckup();
                    //repeat yesterday checkup
                },
                rightBtn: "Dismiss",
                rightPress: () => {
                    //Dismiss
                    this.alreadyShownToday();
                },
            });
        } else {
            showThemeAlert({
                title: "Why has my porn streak reset?",
                message: "Your current porn clean streak has reset because you reported a porn relapse yesterday.",
                leftBtn: "Redo checkup",
                leftPress: () => {
                    this.props.performYesterdayCheckup();
                    //repeat yesterday checkup
                },
                rightBtn: "Dismiss",
                rightPress: () => {
                    //Dismiss
                    this.alreadyShownToday();
                },
            });
        }
    }

    alreadyShownToday = () => {
        this.showHelpButton(false, "");
        let todayDate = moment().format("YYYY-MM-DD");
        let obj = {
            streakCase: this.state.streakCase,
            seenDate: todayDate
        }
        AsyncStorage.setItem("SteakHelpData", JSON.stringify(obj));
    }

    render() {
        let appColor = Constant[this.props.appTheme];
        let goalDays = (this.props.currentGoal.goalDays === 1) ? "24 hours clean"
            : this.props.currentGoal.goalDays + " days clean";
        return (
            <View style={[styles.container, {backgroundColor: appColor.appBackground}]}>
                <View style={styles.titleView}>
                    <Text style={[styles.titleText, {color: appColor.defaultFont}]}>
                        {"Your streak goal - " + goalDays}
                    </Text>
                </View>
                <View style={{paddingLeft: 40, paddingTop: 12, paddingRight: 40}}>
                    <View style={{maxWidth: 400, alignSelf: 'center', width: '100%'}}>
                        <ProgressBar otherColor={appColor.pogressBarOtherColor}
                                     progressVal={this.props.currentGoal.per + "%"}
                                     fillBarColor={Constant.lightBlueColor}
                                     isToday={true}/>
                    </View>
                    <Text style={[styles.titleStyle, {color: appColor.topTodayRemainig}]}>
                        {(this.props.currentGoal.Description.toString().includes("midnight")) &&
                        this.props.currentGoal.Description || "Current streak - " + this.props.currentGoal.Description}</Text>
                </View>

                {
                    this.state.isShowStreakHelp &&
                    <TouchableOpacity onPress={this.onBtnPress}>
                        <View style={[styles.helpBtn, {backgroundColor: appColor.streakHelpBtn}]}>
                            <Text style={[styles.helpBtnText, {color: appColor.streakHelpText}]}>
                                {"Why has my streak reset?"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    || null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Constant.backColor,
        paddingTop: 6,
        paddingBottom: 28
    },
    titleStyle: {
        fontSize: 13,
        paddingTop: 12,
        alignSelf: 'center',
        fontFamily: Constant.font500,
    },
    titleView: {
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 14,
        alignSelf: 'center',
        fontFamily: Constant.font500,
    },
    outerView: {
        alignSelf: 'center',
        justifyContent: 'center',
        height: Constant.screenWidth / 4,
        width: Constant.screenWidth / 4,
        borderRadius: Constant.screenWidth / 5,
        backgroundColor: Constant.backColor2
    },
    helpBtnText: {
        fontSize: 14,
        fontFamily: Constant.font500,
    },
    helpBtn: {
        height: 27,
        marginTop: 10,
        marginBottom: 2,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 13.5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        pornDetail: state.statistic.pornDetail,
        currentGoal: state.statistic.currentGoal,
        appTheme: state.user.appTheme,
    };
};

export default connect(mapStateToProps, {
})(TodayTitle);