import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Text,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import Constant from '../../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../../../../screens/commonComponent/progressBar';
import {connect} from 'react-redux';
import AppStatusBar from '../../../commonComponent/statusBar';
import * as Animatable from 'react-native-animatable';

const benefitsIcon = {
    "Audio Exercise": ['intro_benefit_audio_1',
        'intro_benefit_audio_2'],

    "Brain Training": ['intro_benefit_braintrain_1',
        'intro_benefit_braintrain_2'],

    "Breathing Practice": ['intro_benefit_breathing_1',
        'intro_benefit_breathing_2'],

    "Choose your Path": ['intro_benefit_choose_1',
        'intro_benefit_choose_2'],

    "Emotional Growth": ['intro_benefit_emotion_1',
        'intro_benefit_emotion_2'],

    "Healthy Activity": ['intro_benefit_healthy_1',
        'intro_benefit_healthy_2'],

    "Kegals": ['intro_benefit_kegals_1',
        'intro_benefit_kegals_2'],

    "Did You Know?": ['intro_benefit_learn_1',
        'intro_benefit_learn_2'],

    "Write Your Letter": ['intro_benefit_letter_1',
        'intro_benefit_letter_2'],

    "Meditation": ['intro_benefit_meditation_1',
        'intro_benefit_meditation_2'],

    "Story": ['intro_benefit_story_1',
        'intro_benefit_story_2'],

    "Stress Relief": ['intro_benefit_stress_1',
        'intro_benefit_stress_2'],

    "Thought Control": ['intro_benefit_thoughtcontrol_1',
        'intro_benefit_thoughtcontrol_2'],

    "Visualize": ['intro_benefit_visualize_1',
        'intro_benefit_visualize_2'],

    "Scripture":  ['intro_benefit_visualize_1',
        'intro_benefit_visualize_2'],

};

class InstructionComponent extends React.PureComponent {

    renderBenefits = (item, index) => {
        const {outerBenefit, benefitIcon, benefitDetailText} = styles;
        return (
            <View style={outerBenefit} key={index}>
                <View style={{flex: 3, alignItems:'center'}}>
                    <Image source={{uri: benefitsIcon[this.props.heading][index]}}
                           resizeMode={"contain"}
                           style={benefitIcon}/>
                </View>
                <View style={{flex: 5}}>
                    <Text style={benefitDetailText}>
                        {item}
                    </Text></View>
            </View>
        );
    };

    render() {
        const {
            container, mainView, mainScroll,
            outerImg, titleText, subTitle15Text,
            textNo, outerView, btnActivity, btnFont, detailText} = styles;
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[container, {backgroundColor: this.props.backgroundColor}]}>
                <Animatable.View style={[container, {backgroundColor: this.props.backgroundColor}]}
                                 animation="fadeIn" duration={800}>
                    <AppStatusBar backColor={this.props.backgroundColor}/>
                    <View style={{flex: 1}}>
                        <StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>
                        <Image source={{uri:'background_brain_texture'}}
                               resizeMode={"stretch"}
                               style={{width: Constant.screenWidth, height: Constant.screenHeight}}/>
                        <ScrollView style={mainScroll}
                                    contentContainerStyle={{top: this.props.safeAreaInsetsDefault.top}}
                                    showsVerticalScrollIndicator={false}>

                            <View style={[mainView, {paddingBottom: 120 + this.props.safeAreaInsetsDefault.bottom}]}>
                                <View style={outerView}>
                                    <Text style={[textNo, {color: this.props.backgroundColor}]}>
                                        {this.props.exeTopTitle}
                                    </Text>
                                </View>

                                <View style={[outerImg, {backgroundColor: this.props.iconBack}]}>
                                    <Image source={this.props.icon}
                                           resizeMode={"contain"}
                                           style={{height: 88, width: 88}}/>
                                </View>

                                <Text style={titleText}>
                                    {this.props.heading}
                                </Text>

                                <Text style={[subTitle15Text, {fontSize: 14, marginTop: 38, opacity: 0.75}]}>
                                    WHY
                                </Text>

                                <Text style={[detailText, {marginTop: 15, fontSize: 16}]}>
                                    {this.props.description}
                                </Text>

                                {(this.props.isProgressBar) ?
                                    <View style={{width: '100%', alignItems: 'center'}}>
                                        <Text style={[subTitle15Text, {
                                            marginTop: 45,
                                            textAlign: 'center',
                                            marginBottom: (this.props.isProgressBar) ? 20 : 0,
                                            fontSize: 14,
                                            opacity: 0.75
                                        }]}>
                                            {this.props.barHeading}
                                        </Text>
                                        <ProgressBar progressVal={this.props.ProgressbarPer || "4%"}
                                                     fillBarColor={'#fff'}
                                                     otherColor={'rgba(255,255,255,0.2)'}/>
                                    </View>
                                    : null
                                }

                                <Text style={[subTitle15Text, {
                                    fontSize: 14,
                                    marginTop: 40,
                                    marginBottom: 10,
                                    opacity: 0.75
                                }]}>
                                    BENEFITS
                                </Text>
                                {
                                    this.props.benefitsArray.map((item, index) => {
                                        return this.renderBenefits(item, index)
                                    })
                                }
                                <Text style={[subTitle15Text, {fontSize: 14, marginTop: 10, opacity: 0.75}]}>
                                    TIPS
                                </Text>

                                <Text style={[detailText, {marginTop: 25}]}>
                                    {this.props.tips}
                                </Text>
                            </View>
                        </ScrollView>
                        <TouchableOpacity onPress={() => this.props.onCloseButtonPress()}
                                          style={[styles.backView, {
                                              top: (this.props.safeAreaInsetsDefault.top == 20) && 25
                                              || 15 + this.props.safeAreaInsetsDefault.top}]}>
                            <Ionicons name='ios-close-outline'
                                      size={35}
                                      color="#FFF"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={[btnActivity, {
                            bottom: (Constant.isIphoneX)
                            && 5 + this.props.safeAreaInsetsDefault.bottom || 15 + this.props.safeAreaInsetsDefault.bottom
                        }]}
                                          onPress={() => this.props.onActivityButtonPress()}
                                          underlayColor={'rgb(5,195,249)'}
                                          disabled={!this.props.isClickable}>
                            {(this.props.isClickable) ?
                                <Text style={btnFont}>
                                    {"Begin"}
                                </Text>
                                :
                                <ActivityIndicator
                                    animating={true}
                                    color={"#FFF"}
                                    size="small"/>
                            }
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        paddingBottom: (Constant.isIOS) && 0 || 12
    },
    mainView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingTop: 35,
        paddingBottom: 120,
        width: "80%",
        alignSelf: 'center',
    },
    mainScroll: {
        flex: 1,
        top: 0, bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute'
    },
    outerView: {
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    textNo: {
        fontFamily: Constant.font700,
        fontSize: 12,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 25,
        paddingRight: 25,
    },
    outerImg: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Constant.orangeColor,
        height: 88,//Constant.screenWidth/4,
        width: 88,//Constant.screenWidth/4,
        borderRadius: 44,//Constant.screenWidth/8,
        marginTop: 22,
    },
    subTitle15Text: {
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#fff',
    },
    titleText: {
        fontSize: 24,
        fontFamily: Constant.font300,
        color: '#fff',
        marginTop: 35
    },
    backView: {
        height: 60,
        width: 60,
        position: 'absolute',
        top: 25,
        left: 10,
        paddingLeft: 5,
        paddingTop: 13,
        backgroundColor: 'transparent'
    },
    btnActivity: {
        backgroundColor: 'rgb(5,195,249)',
        width: '82%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        height: 60,
        bottom: 15,
        alignSelf: 'center',
        position: 'absolute',
        maxWidth: 300
    },
    btnFont: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: Constant.font700,
    },
    outerBenefit: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
    },
    benefitIcon: {
        height: 35,
        marginLeft: -10,
        width: 35

    },
    detailText: {
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 22,
        width: "100%"
    },
    benefitDetailText: {
        fontSize: 15,
        fontFamily: Constant.font500,
        color: '#fff',
        lineHeight: 22,
        textAlign: 'left',
        paddingLeft: 3
    }

});

const mapStateToProps = state => {
    return {
        safeAreaInsetsDefault: state.user.safeAreaInsetsDefault,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {})(InstructionComponent);