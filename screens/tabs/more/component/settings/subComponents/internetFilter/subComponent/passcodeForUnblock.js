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
            firstPasscode: ''
        };
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    onBackButtonPress = () => {
        Keyboard.dismiss();
        // AsyncStorage.removeItem("filterPasscode");
        // this.props.navigation.goBack();
        this.props.onCloseModal();
    };

    onComplete = (data) => {
        if (data.type == "Choose filter passcode") {
            this.setState({
                firstPasscode: data.passcode
            });
            return Promise.resolve()
        }else{
            if(this.state.firstPasscode === data.passcode) {
                AsyncStorage.setItem("filterPasscode",data.passcode,(res)=>{
                });
                Keyboard.dismiss();
                //this.props.navigation.state.params.setValue();
                this.props.onCloseModal(true);
                // this.props.navigation.goBack();
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
                               title='Create passcode' type2="Cancel"/>
                <View style={{backgroundColor:'blue',marginTop:166, flex:1}}>
                    {(this.state.firstPasscode == '') ?
                        <Pin type="Choose filter passcode" onComplete={this.onComplete}/>
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

})(EnterPasscode);