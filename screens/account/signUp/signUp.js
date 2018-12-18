import React, { Component } from 'react';
import {
    View
} from 'react-native';
import LoginComponent from './signUpComponent';
import Spinner from '../../../helper/loader';
import { connect } from 'react-redux';
import Constant from '../../../helper/constant';
import axios from 'axios';
import {NavigationActions, StackActions} from "react-navigation";
import AppStatusBar from '../../commonComponent/statusBar';

class SignUp extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            isLoading: false
        };
    }

    onLoginPress = () =>{
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'login', params: {transition: "fadeIn"}})],
        }))
    };

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    render() {
        return (
            <View style={{flex:1,paddingTop:this.props.safeAreaInsetsData.top,backgroundColor: Constant.backColor}}>
                <AppStatusBar backColor={Constant.backColor}/>
                <LoginComponent
                    {...this.props}
                    email={this.props.email}
                    password={this.props.password}
                    onLoginPress={this.onLoginPress}
                    setIsLoading={this.setIsLoading}/>
            </View>
        );
    }

}
//<Spinner visible={this.state.isLoading} />
const mapStateToProps = state => {
    return {
        email: state.user.email,
        password: state.user.password,
        isLoading: state.user.isLoading,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {
})(SignUp);