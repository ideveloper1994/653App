import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../helper/constant';
import Button from '../../commonComponent/button';
import Spinner from '../../commonComponent/initialScreen';
import AppStatusBar from '../../commonComponent/statusBar';

const width = Constant.screenWidth*0.35;
const height = parseInt((width*42)/274);

class WelcomeBack extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            isLoading: false
        };
    }

    beginAssignPress = () => {
        this.props.navigation.navigate("quiz");
    };

    onLoginPress = () => {
        this.props.navigation.navigate("login");
    };

    onGetStarted = () => {
        this.props.navigation.navigate("getStarted", {nextPage: "signUp"});
    };

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <AppStatusBar backColor="#fbb043"/>
                <View style={{top: Constant.screenHeight*0.23-10, left:0, right:0,position: 'absolute', alignItems:'center'}}>
                    <Image source={{uri:'image_welcome'}}
                           style={{width:width,height:height, marginBottom:10}}
                           resizeMode='contain'/>

                    <Text style={styles.descriptionText}>
                        {"Brainbuddy helps you fight porn addiction and rewire your brain. Become stronger, healthier and happier."}
                    </Text>
                </View>

                <View style={{top:Constant.screenHeight*0.64, left:0, right:0, bottom:0,position: 'absolute'}}>
                    <Button title="Retake addiction test"
                            backColor="#FFF"
                            color="#fbb043"
                            onPress={this.beginAssignPress}
                            otherStyle={{marginTop:0, height:60}}
                            otherTextStyle={{fontSize: 15,fontFamily: Constant.font700}}/>

                    <Button title="Get started now"
                            backColor="rgb(127,242,136)"
                            color="#FFF"
                            onPress={this.onGetStarted}
                            otherStyle={{marginTop:15, height:60}}
                            otherTextStyle={{fontSize: 15,fontFamily: Constant.font700}}/>
                </View>
                <View style={{top:Constant.screenHeight*0.9-15, left:0, right:0, bottom:0,position: 'absolute', backgroundColor:"transparent"}}>
                    <TouchableOpacity onPress={() => this.onLoginPress()}>
                        <Text style={styles.bottomText}>
                            {"Existing user? Login"}
                        </Text>
                    </TouchableOpacity>

                </View>

                {
                    (this.state.isLoading) &&
                    <Spinner visible={true}
                             backColor="rgba(0,0,0,0.4)"/> || null
                }

            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, {
})(WelcomeBack);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbb043',
        justifyContent: 'center',
        alignItems:'center'
    },
    descriptionText:{
        fontSize:15,
        color:'white',
        marginTop:18,
        width: "80%",
        fontFamily: Constant.font500,
        textAlign: 'center',
        lineHeight: 23
    },
    bottomText:{
        fontSize:14,
        padding:10,
        color:'#fef1e2',
        fontFamily: Constant.font700,
        textAlign: 'center',
        alignSelf: 'center',
        backgroundColor:"transparent"
    },
});