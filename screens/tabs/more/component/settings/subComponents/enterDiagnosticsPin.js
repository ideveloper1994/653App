import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Keyboard,
    Alert, BackHandler, AsyncStorage
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import Pin from '../components/pinComponent';
import {showThemeAlert} from "../../../../../../helper/appHelper";

class EnterDiagnosticsPin extends React.PureComponent {

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
        this.props.navigation.goBack();
    };

    onComplete = (data) => {
        if(data.passcode === "1988"){
            Keyboard.dismiss();
            this.props.navigation.navigate("diagnosticsCard", { onGoBack: this.onBackButtonPress,
                transition: "myCustomSlideRightTransition"});
        }else if(data.passcode === "1427"){
            AsyncStorage.setItem('completedAllAudioExercises', "Completed")
            showThemeAlert({
                title: "Brainbuddy",
                message: "Audio exercises unlocked",
                leftBtn: "OK",
            });
            this.onBackButtonPress()
        }
        this.setState({
            firstPasscode: ''
        });
        return Promise.reject(false)
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Diagnostics' type2="Cancel"/>
                <View style={{marginTop:166, flex:1}}>
                    <Pin type="Enter diagnostics passcode" onComplete={this.onComplete}/>
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

})(EnterDiagnosticsPin);
