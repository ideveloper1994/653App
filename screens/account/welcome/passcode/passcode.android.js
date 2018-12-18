import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    AsyncStorage,
    Alert,
    Platform
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import PinComponent from './passcodePinComponent';
import Spinner from '../../../commonComponent/initialScreen';
import TouchID from 'react-native-touch-id'
import AppStatusBar from '../../../commonComponent/statusBar';
import {NavigationActions, StackActions} from "react-navigation";

class Passcode extends Component {

    constructor(props){
        super(props);
        this.state = {
            passcode: '',
            isLoading: false,
            isShowPasscode: false
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('secure').then((passcode) => {
            if(passcode != null) {
                this.setState({
                    passcode: passcode,
                });
            }
        });
        this.managedTouchId();
    }

    componentWillUnmount() {
    }

    managedTouchId = () => {
        try{
            if (Platform.Version >= 23) {
                TouchID.isSupported()
                    .then(biometryType => {
                        if (biometryType) {
                            const optionalConfigObject = {
                                title: "Touch ID for \"Brain Buddy\"",
                                color: "rgb(255,148,167)",
                            };
                            TouchID.authenticate('Unlock using Touch ID', optionalConfigObject)
                                .then(success => {
                                    // Success code
                                    this.onComplete();
                                })
                                .catch(error => {
                                    // Failure code
                                    this.showPasscodeView();
                                });
                        } else {
                            this.showPasscodeView();
                        }
                    })
                    .catch(error => {
                        this.showPasscodeView();
                    });
            }else{
                this.showPasscodeView();
            }
        }catch (e){
            this.showPasscodeView();
        }
    };

    showPasscodeView = () => {
        this.setState({
            isShowPasscode: true
        });
    };

    onComplete = () => {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'rootTabNavigation', params: {transition: "myCustomTransition"}})],
        }));
    };

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    render() {
        return (
            <View style={ styles.container }>
                <AppStatusBar backColor={Constant.backColor}
                              hidden={false}/>
                {
                    (this.state.isShowPasscode) &&
                        <PinComponent titleText="Enter your passcode"
                                      onComplete={this.onComplete}
                                      passcode={this.state.passcode}/> || null
                }
                {
                    (this.state.isLoading || !this.state.isShowPasscode) &&
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