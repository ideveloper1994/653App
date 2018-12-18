import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Keyboard,
    AsyncStorage
} from 'react-native';
import Constant from '../../../../../../../../helper/constant';
import NavigationBar from '../../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import Pin from './pinComponent';

class EnterPasscode extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            enteredPasscode: '',
            isError: false,
            passcode: ""
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('filterPasscode').then((passcode) => {
            if(passcode != null) {
                this.setState({
                    passcode: passcode,
                });
            }
        });
    }

    componentWillUnmount() {
    }

    onBackButtonPress = () => {
        Keyboard.dismiss();
        // AsyncStorage.removeItem("filterPasscode");
        // this.props.navigation.goBack();
        this.props.onCloseModal();
    };

    onComplete = () => {
        this.props.onCloseModal(true);
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Enter your passcode' type2="Cancel"/>
                <View style={{backgroundColor:'blue',marginTop:166}}>
                        <Pin type="Enter filter passcode" onComplete={this.onComplete}
                             isEnterPasscode={true}
                             passcode={this.state.passcode}
                        />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    textView:{
        marginTop: 10,
        padding:10,
        fontSize: 15,
        color: '#000',
        minHeight: 100,
        fontFamily: Constant.font300,
    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {

})(EnterPasscode);