import React, { Component } from 'react';
import {
    View
} from 'react-native';
import LoginComponent from './loginComponent';
import Spinner from '../../../helper/loader';
import {
    startLoading
} from '../../../actions/userActions';
import Constant from '../../../helper/constant';
import { connect } from 'react-redux';
import {NavigationActions, StackActions} from "react-navigation";
import AppStatusBar from '../../commonComponent/statusBar';

class Login extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentWillMount() {
        this.props.startLoading(false);
    }

    onSignUpPress = () => {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'signUp', params: {transition: "fadeIn"}})],
        }))
    };

    componentDidMount() {
        //this.refs.mainView.fadeIn(400);
    }

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    //Render signIn page component
    render() {
        return (
            <View style={{flex:1,paddingTop:this.props.safeAreaInsetsData.top,backgroundColor: Constant.backColor}} ref="mainView">
                <AppStatusBar backColor={Constant.backColor}/>
                <LoginComponent
                    {...this.props}
                    email={this.props.email}
                    password={this.props.password}
                    onSignUpPress={ this.onSignUpPress }
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
    startLoading
})(Login);