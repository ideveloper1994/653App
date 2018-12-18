import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Alert,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';
import Constant from '../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import Button from '../../commonComponent/button';
import SafeArea, {SafeAreaInsets} from 'react-native-safe-area'
import Spinner from '../../commonComponent/initialScreen';
import AppStatusBar from '../../commonComponent/statusBar';
import moment from "moment/moment";
import {resetAllAsyncStorageData} from '../../../helper/appHelper';
import {NavigationActions, StackActions} from "react-navigation";

class Welcome extends React.PureComponent {

    constructor(props) {
        super(props);
        const width = (Constant.screenWidth * 29.5) / 100;
        this.state = {
            isWelcome: false,
            isFullScreen: false,
            imageWidth: width,
            imageHeight: parseInt((width*42)/274),
            isLoading: false,

        };
        this.position = new Animated.ValueXY(0, 0);
        this.position2 = new Animated.ValueXY(0, 0);
        Animated.timing(this.position2, {
            toValue: {x: 0, y: Constant.screenHeight * 2}, duration: 0
        }).start();
    }


    componentWillMount() {
        AsyncStorage.getItem("AppInstallationDate").then(res => {
            let todayDate = moment().format("YYYY-MM-DD");
            if (!res) {
                AsyncStorage.setItem("AppInstallationDate", todayDate);
            }
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({isWelcome: true}, () => {
                this.refs.welcome.zoomIn(400);
                const width = (Constant.screenWidth * 35) / 100;
                this.setState({imageWidth: width,
                    imageHeight: parseInt((width*42)/274),});
                setTimeout(() => {
                    Animated.timing(this.position, {
                        toValue: {x: 0, y: -Constant.screenHeight * 0.21}, duration: 400
                    }).start();
                    Animated.timing(this.position2, {
                        toValue: {x: 0, y: 0}, duration: 400
                    }).start();
                }, 1000);
            })
        }, 1000);
    }

    beginAssignPress = () => {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "quiz", params: {transition: "fadeIn"}})],
        }))
    };

    onLoginPress = () => {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "login", params: {transition: "fadeIn"}})],
        }))
    };

    setIsLoading = (flag) => {
        this.setState({
            isLoading: flag
        });
    };

    renderBottom = () => {
        return (
            <Animated.View style={[{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
                height: Constant.screenHeight
            }, this.position2.getLayout()]}>
                <AppStatusBar backColor="#fbb043"/>

                <View style={{
                    left: 0, right: 0, bottom: Constant.screenHeight * 0.075, position: 'absolute',
                    height: Constant.screenHeight, justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={styles.descriptionText}>
                        Let's start by finding out if you
                        are addicted to porn and masturbation.
                    </Text>
                </View>

                <View style={{
                    left: 0,
                    right: 0,
                    top: Constant.screenHeight * 0.31,
                    position: 'absolute',
                    height: Constant.screenHeight + 25 + Constant.screenHeight * 0.08,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Button title="Begin assessment"
                            backColor="#FFF"
                            color="#fbb043"
                            onPress={this.beginAssignPress}
                            otherStyle={{marginTop: 0}}
                            otherTextStyle={{
                                fontSize: 16,
                                fontFamily: Constant.font700
                            }}/>

                    <View style={{
                        marginTop: Constant.screenHeight * 0.04 - 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={() => this.onLoginPress()}>
                            <Text style={[styles.btnFont]}>
                                Existing user? Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </Animated.View>
        );
    };

    render() {
        return (
            <View style={[styles.container, Constant.isIOS]}>
                {
                    (this.state.isWelcome) &&
                    <View style={{
                        top: 0, left: 0,
                        right: 0, bottom: 0,
                        position: 'absolute',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Animated.View style={this.position.getLayout()}>
                            <Animatable.Image source={{uri:'image_welcome'}}
                                              style={{width: this.state.imageWidth,height: this.state.imageHeight}}
                                              resizeMode='contain'
                                              ref="welcome"

                            />
                        </Animated.View>
                    </View>
                }
                {
                    this.renderBottom()
                }

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
        isConnected: state.user.isConnected,
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {})(Welcome);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbb043',
    },
    descriptionText: {
        fontSize: 17,
        color: 'white',
        fontFamily: Constant.font500,
        textAlign: 'center',
        marginLeft: "10%",
        marginRight: "10%",
        lineHeight: 25
    },
    btnFont: {
        fontSize: 15,
        color: 'white',
        fontFamily: Constant.font500,
        textAlign: 'center',
        alignSelf: 'center',
        padding: 10
    },
});