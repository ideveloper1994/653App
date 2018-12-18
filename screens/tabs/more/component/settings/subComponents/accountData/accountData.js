import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView, Alert, BackHandler
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import SettingRow from '../../components/mainSettingRow';
import SettingRedtBtn from '../../components/settingRedBtton';
import {resetAllAsyncStorageData, showCustomAlert,
    showNoInternetAlert, showThemeAlert} from "../../../../../../../helper/appHelper";
import {resetStoreData, deleteUserAccount, userArchiveNotification} from "../../../../../../../actions/userActions";

let isApiCall = false;
import Spinner from '../../../../../../commonComponent/initialScreen';

class AccountData extends React.PureComponent {

    constructor(props){
        super(props);
        isApiCall = false;
        this.state={
            isDeleting: false,
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }


    onRowSelect = (objRowData) => {
        const pageName = objRowData.pageName;
        this.props.navigation.navigate(pageName,
            {transition: "myCustomSlideRightTransition"});
    };

    onDeleteAccountPress = () => {
        if(this.props.isConnected) {
            showThemeAlert({
                title: "",
                message: "Are you sure you want to permanently delete this account? This cannot be undone.",
                leftBtn: "Cancel",
                leftPress: ()=>{
                },
                styleRight: 'destructive',
                rightBtn: "Delete account",
                rightPress: ()=>{
                    this.deleteUserAction();
                },
            });
        }else {
            showNoInternetAlert();
        }
    };

    deleteUserAction = () => {
        this.setState({
            isDeleting: true
        })
        this.props.deleteUserAccount().then(res=>{
            this.setState({
                isDeleting: false
            })

            if(Constant.isIOS){
                Alert.alert("",
                    "Account successfully deleted",
                    [
                        {text: 'Continue', onPress: () => {
                                resetAllAsyncStorageData();
                                this.props.resetStoreData();
                                this.props.navigation.navigate('welcome');
                            }},
                    ],
                );
            }else{
                showThemeAlert({
                    title: "",
                    message: "Account successfully deleted",
                    leftBtn: "Continue",
                    leftPress: ()=>{
                        resetAllAsyncStorageData();
                        this.props.resetStoreData();
                        this.props.navigation.navigate('welcome');
                    },
                });

            }

        }).catch(res=>{
            showCustomAlert("Failed to delete account.", "Brainbuddy", "Try again");
            this.setState({
                isDeleting: false
            })
        })
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onGetData = (data) => {
        const subTitle = "A copy of your data will be sent to " + this.props.email + ".";
        showThemeAlert({
            title: "Download data",
            message: subTitle,
            leftBtn: "Cancel",
            leftPress: ()=>{
            },
            rightBtn: "Confirm",
            rightPress: ()=>{
                this.sendUserData();
            },
        });
    };

    sendUserData = () => {
        if (this.props.isConnected) {
            if (!isApiCall) {
                isApiCall = true;
                this.props.userArchiveNotification().then(res => {
                    showThemeAlert({
                        title: "Data export successful",
                        message: "A copy of your data has been sent to your email address and should arrive shortly.",
                        leftBtn: "Okay",
                        leftPress: ()=>{
                        },
                    });
                    isApiCall = false;
                }).catch(err => {
                    isApiCall = false;
                });
            }
        }else{
            showNoInternetAlert();
        }
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Your account data'/>

                    <SettingHeader headerTitle="COLLECTED DATA"/>
                    <SettingRow rowData={{title: 'View my data', pageName: 'viewUserDetailsCard'}}
                                onRowSelect={this.onRowSelect}/>

                    <SettingRow rowData={{title: 'Download my data', pageName: '', isONlyText: true}}
                                onRowSelect={this.onGetData}/>

                    <SettingHeader headerTitle="ACCOUNT"/>
                    <SettingRedtBtn title={"Permanently delete my account"}
                                    onPress={this.onDeleteAccountPress}/>

                {
                    (this.state.isDeleting) &&
                    <Spinner visible={true}
                             backColor="rgba(0,0,0,0.3)"/> || null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        isConnected: state.user.isConnected,
        email:state.user.email,
    };
};

export default connect(mapStateToProps, {
    resetStoreData, deleteUserAccount, userArchiveNotification
})(AccountData);
