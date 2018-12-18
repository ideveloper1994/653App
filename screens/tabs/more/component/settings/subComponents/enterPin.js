import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Keyboard,
    AsyncStorage, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import Pin from '../components/pinComponent';

class EnterPin extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            firstPasscode: ''
        };
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


    onBackButtonPress = () => {
        Keyboard.dismiss();
        AsyncStorage.removeItem("secure");
        this.props.navigation.goBack();
    };

    onComplete = (data) => {
        if (data.type == "Enter new passcode") {
            this.setState({
                firstPasscode: data.passcode
            });
            return Promise.resolve()
        }else{
            if(this.state.firstPasscode === data.passcode){
                AsyncStorage.setItem("secure",data.passcode,(res)=>{
                });
                Keyboard.dismiss();
                this.props.navigation.state.params.setValue();
                this.props.navigation.goBack();
                return Promise.resolve()
            }else{
                this.setState({
                    firstPasscode: ''
                });
                return Promise.resolve("not matched")
            }
        }
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Turn on passcode' type2="Cancel"/>
                <View style={{marginTop:166, flex:1}}>
                    {(this.state.firstPasscode == '') ?
                        <Pin type="Enter new passcode" onComplete={this.onComplete}/>
                        :
                        <Pin type="Confirm passcode" onComplete={this.onComplete}/>
                    }
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

})(EnterPin);
