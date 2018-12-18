import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    ActivityIndicator, PanResponder
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constant from '../../../../../helper/constant';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AppStatusBar from '../../../../commonComponent/statusBar';

const centerX = Constant.screenWidth / 2
const centerY = Constant.screenHeight / 2
const btnRadius = 10
const circleSize = 156;
const dialRadius = circleSize / 2;
let angle = 0;
let fillVal = 0;

export default class AudioContainer extends React.PureComponent {

    constructor(props) {
        super(props);
        angle = 0;
        fillVal = 0;
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gs) => true,
            onStartShouldSetPanResponderCapture: (e, gs) => false,
            onMoveShouldSetPanResponder: (e, gs) => true,
            onMoveShouldSetPanResponderCapture: (e, gs) => false,
            onPanResponderMove: (e, gs) => {
                let xOrigin = centerX - (dialRadius + btnRadius);
                let yOrigin = centerY - (dialRadius + btnRadius);
                angle = this.cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);
                fillVal = (angle * 100) / 360;
                // this.setState({angle: angle, fillVal: fillVal});
                this.props.updateProgressValue(fillVal);
            },
            onPanResponderRelease: (evt, gs) => {
                this.props.seekToTime(angle, fillVal)
            },
        });
    }

    cartesianToPolar = (x, y) => {
        let hC = dialRadius + btnRadius;

        if (x === 0) {
            return y > hC ? 0 : 180;
        }
        else if (y === 0) {
            return x > hC ? 90 : 270;
        }
        else {
            return (Math.round((Math.atan((y - hC) / (x - hC))) * 180 / Math.PI) +
                (x > hC ? 90 : 270));
        }
    };

    render() {
        const {container, backView, titleText, textView, points, pointsAndroid} = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        const top = (Constant.isIOS) && 0 || 12
        return (
            <View style={container}>
                <AppStatusBar barStyle={appColor.statusBarStyle}
                              backColor={"rgb(49,165,159)"}/>
                <View style={{
                    alignItems: 'center',
                    left: 0,
                    right: 0,
                    top: Constant.screenHeight * 0.13 - 24,
                    position: 'absolute'
                }}>
                    <Text style={[textView]}>{"Exercise " + this.props.exercise_number_audio + " of 35"}</Text>
                    <Text style={[titleText, {paddingTop: 13}]}>
                        {this.getTitleText(this.props.exercise_number_audio)}
                    </Text>
                </View>

                <View style={{
                    height: circleSize, width: circleSize, alignSelf: 'center',
                    position: 'absolute', borderRadius: dialRadius, top: Constant.screenHeight * 0.365
                }}
                      {...this._panResponder.panHandlers}>
                    <AnimatedCircularProgress
                        size={circleSize}
                        width={10}
                        fill={this.props.progressVal}
                        // fill={this.state.fillVal}
                        tintColor="rgb(255,255,255)"
                        backgroundColor="rgba(255,255,255,0.4)"
                        linecap={'round'}
                        duration={0}
                        rotation={0}>
                        {(fill) => (
                            <View/>
                        )}
                    </AnimatedCircularProgress>
                </View>

                <View style={{
                    height: 100,
                    width: 100,
                    alignSelf: 'center',
                    position: 'absolute',
                    top: Constant.screenHeight * 0.365 + 28
                }}>
                    {
                        (this.props.isLoading) &&
                        <View style={{
                            height: 100, width: 100,
                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 50
                        }}>
                            <ActivityIndicator
                                animating={true}
                                size="small"
                                color={'rgb(49,165,159)'}/>
                        </View>
                        ||
                        <TouchableHighlight underlayColor={Constant.transparent}
                                            onPress={() => this.props.onPlayPausePressed()}
                                            disabled={this.props.isLoading}>
                            <Image resizeMode="contain" style={{
                                height: 100, backgroundColor: 'transparent', width: 100}}
                                   source={(this.props.isPlaying) && {uri: 'button_pause'} || {uri: 'button_play'}}/>
                        </TouchableHighlight>
                    }
                </View>

                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: Constant.screenHeight * 0.365 + circleSize,
                    width: '100%', bottom: Constant.screenHeight * 0.25 + top}}>
                    <ActivityIndicator
                        animating={this.props.status == "BUFFERING" && !this.props.isLoading}
                        size="small"
                        color={'#fff'}/>
                </View>


                <View style={{
                    alignItems: 'center',
                    left: 0,
                    right: 0,
                    top: Constant.screenHeight * 0.75 - top,
                    position: 'absolute'
                }}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text
                            style={[textView, {color: 'white'}]}>{this.getDescriptionText(this.props.exercise_number_audio)}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', paddingTop: 13}}>
                        <Text style={textView}>{this.props.getTimestamp}</Text>
                    </View>
                </View>
                {
                    (this.props.isHideBackBtn) && <View/> ||

                    <TouchableHighlight onPress={() => this.props.onBackButtonPress()}
                                        style={[backView, {top: 10 + this.props.top}]}
                                        underlayColor={Constant.transparent}>
                        <Ionicons name='ios-arrow-back'
                                  size={35}
                                  color="#FFF"/>
                    </TouchableHighlight>
                }
            </View>
        );
    }

    getTitleText = (number) => {
        switch (number) {
            case 1:
                return "Introduction";

            case 2:
                return "The podium";

            case 3:
                return "Know your enemy";

            case 4:
                return "Just say no";

            case 5:
                return "Flatline fear";

            case 6:
                return "Mind modification";

            case 7:
                return "Baseline balance";

            case 8:
                return "Lucky to be alive";

            case 9:
                return "The wise parent";

            case 10:
                return "Self-esteem booster";

            case 11:
                return "Porn and sex appeal";

            case 12:
                return "Benefits of rebooting";

            case 13:
                return "Mind modification 2";

            case 14:
                return "Healthy habits";

            case 15:
                return "Escape hypnosis";

            case 16:
                return "Words from a women";

            case 17:
                return "A new you";

            case 18:
                return "More healthy habits";

            case 19:
                return "Why I closed up shop";

            case 20:
                return "Oasis";

            case 21:
                return "Mind modification 3";

            case 22:
                return "A world without men";

            case 23:
                return "Kegel exercises";

            case 24:
                return "Achieving zen mind";

            case 25:
                return "How you see yourself";

            case 26:
                return "Dealing with rejection";

            case 27:
                return "The perfect partner";

            case 28:
                return "Externalization training";

            case 29:
                return "Neuroplasticity";

            case 30:
                return "No more Mr Nice guy";

            case 31:
                return "The science of showers";

            case 32:
                return "The rainforest";

            case 33:
                return "NLP self-improvement";

            case 34:
                return "Diet and balancing libido";

            case 35:
                return "Reality rebalancing";

            default:
                return "Null";
        }
    };

    getDescriptionText = (number) => {
        switch (number) {
            case 1:
                return "How porn addiction happens";

            case 2:
                return "A future worth fighting for";

            case 3:
                return "Dopamine - friend and foe";

            case 4:
                return "Develop awareness and self-control";

            case 5:
                return "How to get your libido to rebound";

            case 6:
                return "Reinforce positive and healthy beliefs";

            case 7:
                return "Resetting your dopamine baseline";

            case 8:
                return "Winning the genetic lottery";

            case 9:
                return "Willpower vizualisation exercise";

            case 10:
                return "Start to feel good";

            case 11:
                return "The effect of porn on natural attraction";

            case 12:
                return "How rebooting changes you";

            case 13:
                return "Reinforce positive and healthy beliefs";

            case 14:
                return "How to become your best self";

            case 15:
                return "Take a break from the everyday world";

            case 16:
                return "Keep fighting the good fight";

            case 17:
                return "Create a new identity for yourself";

            case 18:
                return "How to become your best self";

            case 19:
                return "Exposure Response Therapy";

            case 20:
                return "The beauty of nature";

            case 21:
                return "Reinforce positive beliefs";

            case 22:
                return "The demise of the traditional man";

            case 23:
                return "Exercises for better sex and pleasure";

            case 24:
                return "Taming a wild mind";

            case 25:
                return "Creating a positive self-image";

            case 26:
                return "Staying strong in hard moments";

            case 27:
                return "Don't waste your precious energy";

            case 28:
                return "You are not your mind";

            case 29:
                return "The brain that changes itself";

            case 30:
                return "Repression and 'nice guy' syndrome";

            case 31:
                return "The brain psychology of cold showers";

            case 32:
                return "Escape the everyday world";

            case 33:
                return "Rewire in a 'trance' state";

            case 34:
                return "Food and brain function";

            case 35:
                return "Align your beliefs with reality";

            default:
                return "Null";
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(49,165,159)',
        height: Constant.screenHeight,
        width: Constant.screenWidth,
        position: 'absolute',
        justifyContent: 'center'
    },
    backView: {
        height: 60,
        width: 60,
        position: 'absolute',
        left: 10,
        paddingLeft: 5,
        paddingTop: 10,
        backgroundColor: Constant.transparent
    },
    textView: {
        color: '#dceeec',
        fontSize: 15,
        fontFamily: Constant.font500,
    },
    titleText: {
        color: '#FFF',
        fontSize: 22,
        fontFamily: Constant.font300,
    },
    points: {
        backgroundColor: '#FFF',
        position: 'absolute',
        top: 0,
        height: 135,
        width: 135,
        alignSelf: 'center',
        borderRadius: 67.5
    },
    pointsAndroid: {
        alignSelf: 'center',
    },

});