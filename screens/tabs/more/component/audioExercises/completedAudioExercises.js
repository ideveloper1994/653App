import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView, BackHandler, AsyncStorage,
} from 'react-native';
import NavigationBar from '../../../../commonComponent/navBar';
import AudioRow from './audioRow';
import { connect } from 'react-redux';
import {removeSafeArea} from "../../../../../actions/userActions";
import AudioLockPopUp from './audioLockPopUp';
import Constant from "../../../../../helper/constant";

class AudioExercises extends React.PureComponent {

    constructor(props){
        super(props);
        let i = 1;
        let arr = [];
        while(i <= 35){
            arr.push(i);
            i++;
        }
        this.state = {
            arrAudioExercises: arr,
            completedAllAudioExercises: false,
            showPopup: false,
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('completedAllAudioExercises').then((value) => {
            if(value && value === 'Completed'){
                this.setState({
                    completedAllAudioExercises: true
                })
            }
        })
        if(this.props.audio_exercises_completed){
            this.setState({
                completedAllAudioExercises: true
            })
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount(){
        this.props.removeSafeArea(true);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onBackButtonPress = () => {
        this.props.removeSafeArea(true);
        this.props.navigation.goBack();
    };

    onRowSelect = (rowData) => {
        if(!rowData.isLock){
            this.props.navigation.navigate("settingAudioActivityCard", {exercise_number_audio: rowData.audioNo,
                transition: "myCustomSlideRightTransition"});
        }else{
            this.setState({
                showPopup: true,
            });
        }
    };

    getDescriptionText = (number) => {
        switch (number){
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
    };

    getTitleText = (number) => {
        switch (number){
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

    onPopUpButtonPress = () => {
        this.setState({
            showPopup: false,
        });
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               title="Audio exercises"
                               top={this.props.safeAreaInsetsData.top}
                               backColor={appColor.navSettingAudioActivity}
                               borderColor={appColor.navSettingAudioActivityBorder}
                               isRightButton={false}/>
                <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:50}}>
                    {
                        this.state.arrAudioExercises.map((obj, index) => {
                            let objData = {
                                audioNo: obj,
                                title: this.getDescriptionText(obj),
                                isLock: obj >= this.props.exercise_number_audio && !this.state.completedAllAudioExercises
                            };
                            return <AudioRow rowData={objData}
                                             onRowSelect={this.onRowSelect}
                                             key={index}/>
                        })
                    }
                </ScrollView>

                {(this.state.showPopup) &&
                <AudioLockPopUp onPopUpButtonPress={this.onPopUpButtonPress}/>
                || null}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        exercise_number_audio: state.metaData.metaData.exercise_number_audio || 1,
        appTheme: state.user.appTheme,
        audio_exercises_completed: state.metaData.metaData.audio_exercises_completed || false,
    };
};

export default connect(mapStateToProps, {
    removeSafeArea
})(AudioExercises);
