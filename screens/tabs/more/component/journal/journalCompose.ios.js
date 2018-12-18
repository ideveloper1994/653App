import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    TextInput,
    Keyboard,
    Alert,
    ScrollView
} from 'react-native';
import Constant from '../../../../../helper/constant';
import NavigationBar from '../../../../commonComponent/navBar';
import {connect} from 'react-redux';
import {updateJournalContent, addJournalDays} from '../../../../../actions/statisticAction';
import {showNoInternetAlert, showCustomAlert, callTodayScreenEcentListner} from '../../../../../helper/appHelper';

let textData = "";
let isBackProcessDone = false;
let downCount = 0;

class JournalCompose extends Component {

    constructor(props) {
        super(props);
        let messageTemp = (props.navigation.state.params.rowData.data && props.navigation.state.params.rowData.data !== '@@@') &&
            props.navigation.state.params.rowData.data || ""
        this.state = {
            keyboardHeight: 0,
            messageText: messageTemp,
            isShowDone: props.navigation.state.params.rowData.data.length === 0,
            isKeyBoard: props.navigation.state.params.rowData.data.length === 0,
            selection: {
                start: 70,
                end: 70
            }
        };
        textData = props.navigation.state.params.rowData.data || "";
        this.offset = 0;
        downCount = 0;
    }

    componentWillMount() {
        callTodayScreenEcentListner(false);
        isBackProcessDone = false;
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentDidMount() {
        if (this.props.navigation.state.params) {
            if (this.props.navigation.state.params.rowData.data.length == 0) {
                if (this.refs.txtInput) {
                    this.refs.txtInput.focus();
                }
            } else {
                //Keyboard.dismiss()
            }
        }
    }

    componentWillUnmount() {
        callTodayScreenEcentListner();
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
        this.keyboardDidHideListener.remove();
        Keyboard.dismiss();
        if (!isBackProcessDone) {
            this.onBackButtonPress(false)
        }
    }

    _keyboardWillShow = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height,
            // isShowDone: true,
            // isKeyBoard: true,
        });
    };

    _keyboardWillHide = (e) => {
        this.setState({
            keyboardHeight: 0,
            isShowDone: false,
        });
    };

    _keyboardDidHide = (e) => {
        this.setState({
            isKeyBoard: false,
        });
    };

    onBackButtonPress = (isBackPress = true) => {
        isBackProcessDone = true;
        Keyboard.dismiss();
        if (this.props.navigation.state.params.rowData.data != textData) {
            if (!textData.trim().length) {
                textData = '@@@';
            }
            this.props.navigation.state.params.rowData.data = textData;
            if (this.props.navigation.state.params.rowData.id != 0) {
                if (this.props.isConnected) {
                    this.props.updateJournalContent(this.props.navigation.state.params.rowData).then(res => {
                    }).catch(err => {
                        showCustomAlert("Failed to update journal entry.", "Brainbuddy", "Try again");
                    });
                } else {
                    showNoInternetAlert();
                }
            } else {
                if (this.props.isConnected) {
                    this.props.addJournalDays(this.props.navigation.state.params.rowData).then(res => {
                    }).catch(err => {
                        showCustomAlert("Failed to add journal entry.", "Brainbuddy", "Try again");
                    });
                } else {
                    showNoInternetAlert();
                }
            }
        }
        if (isBackPress) {
            if (this.props.navigation.state.params.isOptional) {
                callTodayScreenEcentListner();
                if (!this.props.navigation.state.params.isReplay) {
                    this.props.navigation.state.params.onCompleteExercises("journalActivity");
                }
                this.props.navigation.state.params.makeFadeInAnimation();
            }
            this.props.navigation.goBack();
        }
    };

    onTextChange = (text) => {
        let message = text.toString().trim();
        textData = message;
        this.setState({
            messageText: text,
        });
    };

    onDonePress = () => {
        this.setState({
            messageText: textData,
        });
        Keyboard.dismiss();
    }

    handleSelectionChange = ({nativeEvent: {selection}}) => {
        if (this.state.isShowDone) {
            this.setState({selection})

        } else {
            let selection = {
                start: 50,
                end: 50
            }
            this.setState({selection})
        }
    }

    render() {
        let objIcon = (this.props.navigation.state.params && this.props.navigation.state.params.isOptional) ?
            {name: "md-close", size: 28} : null;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const {formatedDate, data} = this.props.navigation.state.params.rowData;

        return (
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <NavigationBar onBackButtonPress={this.onBackButtonPress}
                                   top={this.props.safeAreaInsetsDefault.top}
                                   backIcon={objIcon}
                                   title={formatedDate}/>
                    {
                        (this.state.isShowDone) &&
                        <TouchableHighlight style={styles.doneView}
                                            onPress={() => this.onDonePress()}
                                            underlayColor={Constant.transparent}>
                            <Text style={[styles.doneText, {
                                paddingTop: 10 + this.props.safeAreaInsetsDefault.top,
                                color: appColor.navDoneBtn
                            }]}>
                                DONE
                            </Text>
                        </TouchableHighlight>
                        || null
                    }

                    <ScrollView keyboardShouldPersistTaps={"auto"}
                                keyboardDismissMode="on-drag"
                                showsVerticalScrollIndicator={true}
                                automaticallyAdjustContentInsets={false}>
                        {
                            (this.state.isKeyBoard)
                            &&

                            <TextInput placeholder={(data === "" || data === '@@@') ? "Write about your day." : ""}
                                       placeholderTextColor="gray"
                                       multiline={true}
                                       onChangeText={(text) => this.onTextChange(text)}
                                       autoFocus={true}
                                       underlineColorAndroid={Constant.transparent}
                                       ref="txtInput"

                                       value={this.state.messageText}
                                       blurOnSubmit={false}
                                       style={[styles.textView,
                                           {
                                               height: Constant.screenHeight - this.state.keyboardHeight - (100 + this.props.safeAreaInsetsDefault.top),
                                               lineHeight: 24
                                           }]}
                                       selectionColor={Constant.selectionColor}
                            />
                            ||
                            <TouchableHighlight
                                onPress={() => {
                                    this.setState({
                                        isShowDone: true,
                                        isKeyBoard: true
                                    });
                                }}
                                underlayColor={Constant.transparent}>
                                {
                                    (this.state.messageText === "" || this.state.messageText === '@@@') &&
                                    <Text style={[styles.textData, {
                                        color: 'gray',
                                        minHeight: Constant.screenHeight - (100 + this.props.safeAreaInsetsDefault.top),
                                        paddingBottom: (this.props.safeAreaInsetsDefault.top > 20) && 20 || 15
                                    }]}>
                                        {"Write about your day."}
                                    </Text>
                                    ||
                                    <Text style={[styles.textData, {
                                        minHeight: Constant.screenHeight - (100 + this.props.safeAreaInsetsDefault.top),
                                        paddingBottom: (this.props.safeAreaInsetsDefault.top > 20) && 20 || 15
                                    }]}>
                                        {this.state.messageText}
                                    </Text>
                                }
                            </TouchableHighlight>
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textView: {
        fontSize: 15,
        color: '#4e4e4e',
        minHeight: 40,
        fontFamily: Constant.font500,
        backgroundColor: '#fff',
        marginLeft: 18,
        paddingRight: 18,
        paddingTop: 30,
        paddingBottom: 10,
        lineHeight: 24,
    },
    doneView: {
        top: 30,
        right: 10,
        position: 'absolute',
        width: 50,
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    doneText: {
        fontSize: 14,
        color: '#a7b0b6',
        fontFamily: Constant.font700,
    },
    textData: {
        fontSize: 15,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        backgroundColor: '#fff',
        marginLeft: 18,
        paddingRight: 18,
        paddingTop: 30,
        paddingBottom: 10,
        lineHeight: 24,
        flex: 1,
    }
});

const mapStateToProps = state => {
    return {
        initialMsg: state.statistic.initialMsg,
        backup_data: state.statistic.backup_data,
        isConnected: state.user.isConnected,
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    updateJournalContent, addJournalDays
})(JournalCompose);