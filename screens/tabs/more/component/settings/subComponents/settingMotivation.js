import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Keyboard, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import OptionRow from '../components/optionRow';
import { updateUserDetail } from '../../../../../../actions/userActions';

class SettingsMotivation extends Component {

    constructor(props){
        super(props);
        this.state = {
            motivation: props.motivation
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
        if(this.state.motivation != this.props.motivation){
            this.props.updateUserDetail({
                motivation: this.state.motivation
            });
        }
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onSelectOption = (type, selectedTitle) => {
        let state = this.state;
        state[type] = selectedTitle;
        this.setState(state);
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Motivation'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>

                    <SettingHeader headerTitle="WHAT MOTIVATES YOU"/>

                    <OptionRow title="Quitting porn and masturbation"
                               type="motivation"
                               dbValue="both"
                               onSelectOption={this.onSelectOption}
                               value={this.state.motivation}/>

                    <OptionRow title="Quitting porn"
                               type="motivation"
                               dbValue="porn"
                               onSelectOption={this.onSelectOption}
                               value={this.state.motivation}/>

                    <OptionRow title="Quitting masturbation (nofap)"
                               type="motivation"
                               dbValue="masturbation"
                               onSelectOption={this.onSelectOption}
                               value={this.state.motivation}/>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
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
        motivation:state.user.userDetails.motivation,
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {
    updateUserDetail
})(SettingsMotivation);
