import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import OptionRow from '../components/optionRow';
import { updateMetaData } from '../../../../../../actions/metadataActions';
import {  setUpLocalNotificationAlerts } from '../../../../../../actions/userActions';

class CheckupTime extends Component {

    constructor(props){
        super(props);
        this.state = {
            checkupTime: props.checkupTime
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
        if(this.state.motivation != this.props.checkupTime){
            this.props.updateMetaData({
                checkup_time: this.state.checkupTime
            });
            this.props.setUpLocalNotificationAlerts();
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
                               title='Checkup Time'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>


                    <View>
                        <SettingHeader headerTitle="PREFERRED CHECKUP TIME"/>

                        <OptionRow title="6 pm"
                                   type="checkupTime"
                                   onSelectOption={this.onSelectOption}
                                   dbValue={18}
                                   value={this.state.checkupTime}/>
                        <OptionRow title="7 pm"
                                   dbValue={19}
                                   type="checkupTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.checkupTime}/>
                        <OptionRow title="8 pm"
                                   dbValue={20}
                                   type="checkupTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.checkupTime}/>
                        <OptionRow title="9 pm"
                                   dbValue={21}
                                   type="checkupTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.checkupTime}/>
                        <OptionRow title="10 pm"
                                   dbValue={22}
                                   type="checkupTime"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.checkupTime}/>
                        <OptionRow title="11 pm"
                                   type="checkupTime"
                                   dbValue={23}
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.checkupTime}/>
                    </View>
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
        checkupTime: state.metaData.metaData.checkup_time || 18,
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {
    updateMetaData,setUpLocalNotificationAlerts
})(CheckupTime);
