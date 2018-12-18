import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    AsyncStorage,
    Alert
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import PinComponent from './passcodePinComponent';
import TouchId from 'react-native-smart-touch-id'
import { loadAllProducts,restoreAllData,checkForValidation } from '../../../../helper/inAppPurchase';
import Spinner from '../../../commonComponent/initialScreen';
import {NavigationActions, StackActions} from "react-navigation";

class Passcode extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            passcode: '',
            isLoading: false,
            isTouchId: true
        };
    }

    componentWillMount() {
        this.isTouchIDSupported();
        AsyncStorage.getItem('secure').then((passcode) => {
            if(passcode != null) {
                this.setState({
                    passcode: passcode,
                });
            }
        });
    }

    componentWillUnmount() {
    }

    isTouchIDSupported = async () => {
        try {
            await TouchId.isSupported();
            this.trggerTouchId();
            this.setState({
                isTouchId:true
            });
        } catch(e) {
            this.setState({
                isTouchId:false
            });
        }
    };

    trggerTouchId = async () => {
        let description = 'Unlock using Touch ID';
        //let title       //fallback button title will be default as 'Enter Password'(localized)
        //let title = ""  //fallback button will be hidden
        let title = 'Touch ID for "Brain Buddy"';   //fallback button title will be 'Verify Password'(unlocalized)
        try {
            await TouchId.verify({
                description,
                title,
            });
            //await TouchId.verify("123123123123");
            // Alert.alert('verify succeeded');
            this.onComplete();
        } catch(e) {
            if (e.code == '-3') {
                this.isTouchIDSupported();
                // Alert.alert('errorCode: ' + e.code + ' verify failed, user wants to ' + title);
            }
            else {
                this.setState({
                    isTouchId:false
                });
                // Alert.alert('errorCode: ' + e.code + ' Cancel');
            }
        }
    };

    onComplete = () => {
        // this.props.navigation.navigate('rootTabNavigation');

        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'rootTabNavigation', params: {transition: "myCustomTransition"}})],
        }));

        // this.props.navigation.navigate('beforeBeginToday');
        // this.checkForSubscription();
    };

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    //Before enter to the root tab
    checkForSubscription = () => {
        this.setIsLoading(true);
        loadAllProducts().then(res=>{
            restoreAllData()
                .then(res => {
                    checkForValidation()
                        .then(res=>{
                            this.setIsLoading(false);
                            // this.props.navigation.navigate("rootTabNavigation");

                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: "rootTabNavigation",
                                    params: {transition: "myCustomTransition"}})],
                            }))

                        }).catch(err=>{
                        //expired
                        this.setIsLoading(false);
                        Alert.alert("Subscription expired",
                            "Please renew your subscription to continue using Brainbuddy",
                            [
                                {text: 'Continue', onPress: () => {
                                    this.props.navigation.navigate("getStarted",{nextPage: "rootTabNavigation"});
                                }},
                            ],
                        );
                    })
                })
                .catch(err => {
                    this.setIsLoading(false);
                    this.props.navigation.navigate("getStarted",{nextPage: "rootTabNavigation"});
                })
        }).catch(err=>{
            this.setIsLoading(false);
            Alert.alert("Failed to get Subscription details, please try again");
        })
    };

    render() {
        return (
            <View style={ styles.container }>
                {
                    (this.state.isTouchId) ?
                        null
                        :
                        <PinComponent titleText="Enter your passcode"
                                      onComplete={this.onComplete}
                                      passcode={this.state.passcode}/>
                }

                {
                    (this.state.isLoading) &&
                    <Spinner visible={true} /> || null
                }

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor,
        justifyContent:'center',
        alignItems:'center',
    },
});

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, {
})(Passcode);