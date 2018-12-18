import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import OptionRow from '../components/optionRow';
import { setMeditationTime } from '../../../../../../actions/metadataActions';

class MeditationTime extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            meditationTime: props.meditationTime
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
        this.props.navigation.goBack();
    };

    onSelectOption = (type, selectedTime) => {
        this.props.setMeditationTime(selectedTime);
        this.setState({
            meditationTime: selectedTime
        });
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Meditation Time'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>

                        <SettingHeader headerTitle="LONGER IS BETTER"/>

                        <OptionRow title="5 minutes"
                                   type="meditationTime"
                                   onSelectOption={this.onSelectOption}
                                   dbValue={5}
                                   value={this.state.meditationTime}/>
                        <OptionRow title="10 minutes"
                                   dbValue={10}
                                   type="meditationTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.meditationTime}/>
                        <OptionRow title="15 minutes"
                                   dbValue={15}
                                   type="meditationTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.meditationTime}/>
                        <OptionRow title="20 minutes"
                                   dbValue={20}
                                   type="meditationTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.meditationTime}/>
                        <OptionRow title="30 minutes"
                                   dbValue={30}
                                   type="meditationTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.meditationTime}/>
                        <OptionRow title="60 minutes"
                                   type="meditationTime"
                                   dbValue={60}
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.meditationTime}/>
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
        meditationTime: state.metaData.meditationTime || 10,
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {
    setMeditationTime
})(MeditationTime);
