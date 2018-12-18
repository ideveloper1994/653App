import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    Keyboard,
    Modal, NativeModules
} from 'react-native';
import Constant from '../../../helper/constant';
import {
    emailChanged,
    passChanged,
    createUser,
    setSubscriptionInProcess
} from '../../../actions/userActions';
import {updateMetaData} from '../../../actions/metadataActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Button from '../../commonComponent/button';
import moment from 'moment';
import TermsAndCondition from '../../account/welcome/getStarted/termsAndConditions/termsAndConditions';
import {
    showThemeAlert, showNoInternetAlert, showServerNotReachable,
    backendNotReachable
} from "../../../helper/appHelper";
import {checkForRechability} from "../../../services/apiCall";

let NativeModulesIOS = NativeModules.checkBundle;
let AndroidNativeModule = NativeModules.AndroidNativeModule;

class SignUpComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            isLoading: false
        };
    }

    ////On Login Press validate the field and make call
    onSignUpPress = () => {
        if (this.props.email.trim().length <= 0 || this.props.password.trim().length <= 0) {
            showThemeAlert({
                title: "Brainbuddy",
                message: "Enter Data in all fields.",
                leftBtn: "OK",
            });
        }
        else if (!this.validateEmail(this.props.email.trim())) {
            showThemeAlert({
                title: "Brainbuddy",
                message: "Enter valid Email Address",
                leftBtn: "OK",
            });
        } else if (!this.isValidPassword(this.props.password)) {
            showThemeAlert({
                title: "Invalid character",
                message: "Special symbol or character not supported",
                leftBtn: "OK",
            });
        } else {
            Keyboard.dismiss();
            if (Constant.isIOS) {
                this.askForAggrements();
            } else {
                this.askForAgreementAndroid();
            }
        }
    };

    //CALL API
    performsignUp = () => {
        if (this.props.isConnected) {
            this.setIsLoading(true);
            checkForRechability().then(reachabilityStatus => {
                if (reachabilityStatus === Constant.REACHABLE) {
                    this.props.createUser(this.props.email, this.props.password)
                        .then((res) => {
                            this.subscriptionCheckDone(false);
                        })
                        .catch((err) => {
                            this.setIsLoading(false);
                            if (err.Heading && err.status) {
                                showThemeAlert({
                                    title: "Brainbuddy",
                                    message: err.Description.toString(),
                                    leftBtn: "OK",
                                });
                            } else {
                                showThemeAlert({
                                    title: "Brainbuddy",
                                    message: "Something went wrong, Please try again",
                                    leftBtn: "OK",
                                });
                            }
                        });
                }else if(reachabilityStatus === Constant.NOT_REACHABLE_BACKEND){
                    this.setIsLoading(false);
                    backendNotReachable();
                }else{
                    this.setIsLoading(false);
                }
            }).catch(err => {
                this.setIsLoading(false);
                if(err === Constant.NOT_REACHABLE){
                    if (this.props.isConnected) {
                        showServerNotReachable();
                    }else{
                        showNoInternetAlert()
                    }
                }
            })
        } else {
            this.setIsLoading(false);
            showNoInternetAlert();
        }
    }

    //Email validation
    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    isValidPassword = (password) => {
        let regularExpression = /^[a-zA-Z0-9!@#$%^_&*]+$/;
        return regularExpression.test(password);
    };

    //Focus on next field - onpress keyboard next
    focusNextField = (nextField) => {
        if (this.refs && this.refs[nextField]) {
            this.refs[nextField].focus();
        }
    };

    subscriptionCheckDone = (isFailed) => {
        this.props.updateMetaData({
            registered_at: moment().format("YYYY-MM-DD"),
            //last_checkup_at: moment().subtract(1, 'days').format('YYYY-MM-DD')
        });
        if (isFailed) {
            this.props.navigation.navigate("getStarted", {nextPage: "beforeBegin"});
        } else {
            this.props.navigation.navigate("beforeBegin");
        }
    };

    onPrivacyTerms = (flag = false) => {
        this.setState({
            modalVisible: flag
        });
    };

    //ask for agreement if user is in european country
    askForAggrements = () => {
        NativeModulesIOS.isEuropeanCountry((error, res) => {
            if (res === "YES") {
                this.showPrivacyPrompt();
            } else {
                this.performsignUp();
            }
        })
    };

    //ask for agreement if user is in european country
    askForAgreementAndroid = () => {
        AndroidNativeModule.isEuropeanCountry((res) => {
            const arrEuropeanCountryCode = ["AT", "BE", "BG", "CY", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "LV",
                "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK", "GB"];
            if (arrEuropeanCountryCode.indexOf(res) >= 0) {
                this.showPrivacyPrompt();
            } else {
                this.performsignUp();
            }
        });
    };

    showPrivacyPrompt = () => {
        showThemeAlert({
            title: "Privacy Confirmation",
            message: "By continuing, I acknowledge that I have read and agree to both the terms and conditions and privacy policy.",
            leftBtn: "Cancel",
            styleLeft: 'destructive',
            leftPress: () => {
            },
            rightBtn: "I agree",
            rightPress: () => {
                this.performsignUp();
            },
        });
    }

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    render() {
        return (
            <View style={styles.container} pointerEvents={this.state.isLoading && "none" || 'auto'}>
                <Text style={styles.titleFont}>
                    Create Your Account
                </Text>
                <View style={{
                    left: 0,
                    right: 0,
                    top: Constant.screenHeight * 0.2 - 11,
                    bottom: 0,
                    position: 'absolute',
                    alignItems: 'center'
                }}>
                    <View style={styles.outerTextView}>
                        <View style={styles.iconView}>
                            <Ionicons name='ios-mail-outline' size={30} color={Constant.lightTheamColor}/>
                        </View>
                        <View style={{justifyContent: 'center', flex: 1, marginLeft: 20}}>
                            <TextInput ref="txtEmail"
                                       value={this.props.email}
                                       keyboardType={'email-address'}
                                       placeholder={"Email"}
                                       placeholderTextColor={Constant.lightTheamColor}
                                       style={[styles.textBox,{fontFamily: Constant.font500}]}
                                       autoCapitalize="none"
                                       autoCorrect={false}
                                       returnKeyType={'next'}
                                       onChangeText={(text) => {
                                           this.props.emailChanged(text)
                                       }}
                                       onSubmitEditing={() => this.focusNextField('txtPassword')}
                                       underlineColorAndroid={Constant.transparent}
                                       maxLength={100}
                                       selectionColor={Constant.selectionColor}
                            />
                        </View>
                    </View>

                    <View style={styles.textBorder}/>

                    <View style={[styles.outerTextView, {marginTop: 26}]}>
                        <View style={[styles.iconView, {paddingLeft: 2}]}>
                            <Ionicons name='ios-lock-outline' size={30} color={Constant.lightTheamColor}/>
                        </View>
                        <View style={{justifyContent: 'center', flex: 1, marginLeft: 20}}>
                            <TextInput ref="txtPassword"
                                       value={this.props.password}
                                       placeholder={"Password"}
                                       placeholderTextColor={Constant.lightTheamColor}
                                       style={styles.textBox}
                                       secureTextEntry={true}
                                       returnKeyType={"done"}
                                       blurOnSubmit={true}
                                       onChangeText={(text) => {
                                           this.props.passChanged(text);
                                       }}
                                       autoCapitalize="none"
                                       autoCorrect={false}
                                       maxLength={50}
                                       underlineColorAndroid={Constant.transparent}
                                       selectionColor={Constant.selectionColor}/>

                        </View>
                    </View>
                    <View style={styles.textBorder}/>

                    <Button title="Get Started"
                            backColor="rgb(255,180,0)"
                            color="#FFF"
                            otherStyle={{marginTop: Constant.screenHeight * 0.05}}
                            otherTextStyle={{fontFamily: Constant.font700}}
                            onPress={this.onSignUpPress}
                            isActivityIndicator={this.state.isLoading}/>

                    <View style={{marginTop: 7, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.btnCreateAcc} onPress={() => {
                            this.props.onLoginPress()
                        }}>
                            Login
                        </Text>
                        <Text style={{color: '#496e7e', fontSize: 15, padding: 5, fontFamily: Constant.font500,}}>
                            or
                        </Text>
                        <Text style={styles.btnCreateAcc} onPress={() => {
                            this.onPrivacyTerms(true)
                        }}>
                            privacy and terms
                        </Text>
                    </View>
                </View>

                <Modal animationType="slide"
                       transparent={false}
                       onRequestClose={this.onPrivacyTerms}
                       visible={this.state.modalVisible}>
                    <TermsAndCondition onClosePress={this.onPrivacyTerms}
                                       safeAreaInsetsData={this.props.safeAreaInsetsDefault}/>
                </Modal>

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        email: state.user.email,
        password: state.user.password,
        isLoading: state.user.isLoading,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        isConnected: state.user.isConnected,
    };
};

export default connect(mapStateToProps, {
    createUser,
    emailChanged,
    passChanged,
    updateMetaData,
    setSubscriptionInProcess
})(SignUpComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Constant.backColor,
        paddingTop: 40
    },
    titleFont: {
        color: '#FFFFFF',
        fontSize: 15,
        marginBottom: 60,
        fontFamily: Constant.font700,
    },
    textView: {
        backgroundColor: '#FFF'
    },
    btnFont: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: Constant.font700,
    },
    btnCreateAcc: {
        color: Constant.lightTheamColor,
        // color: '#7999a7',
        fontSize: 15,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: Constant.font500,
    },
    textBorder: {
        backgroundColor: Constant.lightTheamColor,
        height: 1.5,
        alignSelf: 'center',
        width: Constant.screenWidth - 60
    },
    textBox: {
        color: '#FFFFFF',
        fontSize: 15,
        paddingBottom: 0,
        height: 40,
    },
    btnLogin: {
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        alignSelf: 'center',
        backgroundColor: 'rgb(255,180,0)',
        width: Constant.screenWidth - 60,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 17,
        borderRadius: 30
    },
    outerTextView: {
        marginLeft: 30,
        marginRight: 30,
        height: 40,
        flexDirection: 'row'
    },
    iconView: {
        justifyContent: 'center',
        // flex: 1.5
    }
});