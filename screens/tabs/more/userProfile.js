import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView, AppState,
} from 'react-native';
import Constant from '../../../helper/constant';
import ProfImage from './component/profileImage'
import RowSeparator from './component/rowSeperator';
import {removeSafeArea} from "../../../actions/userActions";
import ProfileSettingRow from './component/profileSettingsRow';
import { connect } from 'react-redux';
import { getAvatar } from '../../../helper/appHelper';
import TopButton from '../../commonComponent/topButton';
import {EventRegister} from "react-native-event-listeners";

const iconImage = {
    feelingTampered: 'moretab_icon_tempted',
    profileMale: 'avatar_male',
    profileFemale: 'avatar_female',
    journal: 'moretab_icon_journal',
    advice: 'moretab_icon_advice',
    lifeTree: 'moretab_icon_tree',
    completedExercise : 'moretab_icon_exercise',
    internetFilterIcon : 'moretab_icon_filter',
    settings : 'moretab_icon_settings'
};

class UserProfile extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            isLoad: false
        };
    }

    componentWillReceiveProps(nextProps){
        // if(nextProps.visibleTab == "more"){
        //     this.loadThisScreen();
        // }
    }

    componentWillMount () {
        // console.log("-----------moreTab-----------");
        // EventRegister.removeEventListener(this.moreTab);
        // this.moreTab = EventRegister.addEventListener('moreTab', (data) => {
        //     this.loadThisScreen();
        // });
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.moreTab);
    }

    loadThisScreen = () => {
        if(this.state.isLoad)
            return;
        this.setState({
            isLoad: true
        });
        console.log("-----------moreTab Load-----------");
    }

    //Navigate to inner view
    goTo = (page) => {
        this.props.navigation.navigate(page+"Card",{transition: "myCustomSlideRightTransition"});
        this.props.removeSafeArea();
    };

    getAvatarImage = () => {
        return getAvatar(this.props.avatar_id, this.props.gender);
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.container,{backgroundColor: appColor.appBackground}]}>
                <ScrollView contentContainerStyle={{top: this.props.safeAreaInsetsData.top}}>
                    <View style={{marginBottom: 40, marginTop: 45, backgroundColor: appColor.pressInMoreRow}}>
                        <ProfImage profileName={(this.props.userName) ? this.props.userName : 'Unknown'}
                                   profileEmail={this.props.email}
                                   profileImage={this.getAvatarImage()}
                                   viewName="moreSettings"
                                   appTheme={this.props.appTheme}
                                   goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>

                        <ProfileSettingRow imageUrl={iconImage.feelingTampered}
                                           rowTitle="I'm feeling tempted"
                                           viewName="feelingTempted"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>

                        <ProfileSettingRow imageUrl={iconImage.journal}
                                           rowTitle="Journal"
                                           viewName="journalEntry"
                                           goTo={this.goTo}
                                           appTheme={this.props.appTheme}
                        />
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <ProfileSettingRow imageUrl={iconImage.advice}
                                           rowTitle="Advice"
                                           viewName="savedAdvice"
                                           goTo={this.goTo}
                                           appTheme={this.props.appTheme}
                        />
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <ProfileSettingRow imageUrl={iconImage.lifeTree}
                                           rowTitle="Life Tree"
                                           viewName="lifeTree"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <ProfileSettingRow imageUrl={iconImage.completedExercise}
                                           rowTitle="Audio exercises"
                                           viewName="completedAudioExercises"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        {
                            (Constant.isIOS) &&
                            <View>
                                <RowSeparator separatorColor={appColor.moreSeparator}/>
                                <ProfileSettingRow imageUrl={iconImage.internetFilterIcon}
                                                   rowTitle="Internet filter"
                                                   viewName="internetFilter"
                                                   appTheme={this.props.appTheme}
                                                   goTo={this.goTo}/>
                            </View>
                        }
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                        <View style={{height: 27, backgroundColor: appColor.appBackground}}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>

                        <ProfileSettingRow imageUrl={iconImage.settings}
                                           rowTitle="Settings"
                                           viewName="moreSettings"
                                           appTheme={this.props.appTheme}
                                           goTo={this.goTo}/>
                        <RowSeparator separatorColor={appColor.moreSeparator}/>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor,
    }
});
const mapStateToProps = state => {
    return {
        email:state.user.email,
        userName:state.user.userDetails.name || "",
        gender:state.user.userDetails.gender || 'male',
        avatar_id:state.user.userDetails.avatar_id,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme,
        // visibleTab: state.user.visibleTab,
    };
};

export default connect(mapStateToProps, {
    removeSafeArea
})(UserProfile);