import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Linking, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import SettingRow from '../components/settingRow';
import Mailer from 'react-native-mail'

class ContactUs extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            settingDetail:[]
        };
    }

    componentWillMount() {
        let optionalData = [
            {"CHOOSE A SUBJECT":[
                {title: 'I have a suggestion', key:'suggestion'},
                {title: "I'm having a problem", key: 'problem'},
                {title: "Managing my subscription", key: 'subscription'},
                {title: "Something else", key: 'else'},
            ]},
        ];
        this.setState({
            settingDetail: optionalData
        });
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

    onRowSelect = (rowData) => {
        switch (rowData.key){
            case 'suggestion':
                Mailer.mail({
                    subject: 'Brainbuddy Suggestion',
                    recipients: ['support@brainbuddyapp.com'],
                    body: '',
                }, (error, event) => {
                    if(error) {
                        // alert('Could not send mail. Please send a mail to support@example.com');
                    }
                });
                break;
            case 'problem':
                Mailer.mail({
                    subject: (Constant.isIOS) && 'Brainbuddy Help' || "Brainbuddy Help (Android)",
                    recipients: ['support@brainbuddyapp.com'],
                    body: '',
                }, (error, event) => {
                    if(error) {
                        // alert('Could not send mail. Please send a mail to support@example.com');
                    }
                });
                break;
            case 'subscription':

                if(Constant.isIOS){
                    Linking.openURL("https://support.apple.com/en-au/HT202039")
                        .catch(err => {});
                }else{
                    Linking.openURL("https://support.google.com/googleplay/answer/7018481")
                        .catch(err => {});
                }
                break;
            case 'else':
                Mailer.mail({
                    subject: 'Brainbuddy Feedback',
                    recipients: ['support@brainbuddyapp.com'],
                    body: '',
                }, (error, event) => {
                    if(error) {
                        // alert('Could not send mail. Please send a mail to support@example.com');
                    }
                });
                break;
        }
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Get in contact'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    {
                        this.state.settingDetail.map((objSetting,index) => {
                            let headerTitle = Object.keys(objSetting);
                            return(
                                <View key={index}>
                                    <SettingHeader headerTitle={headerTitle[0]}/>
                                    {
                                        objSetting[headerTitle[0]].map((objRow) => {
                                            return <SettingRow rowData={objRow}
                                                               onRowSelect={this.onRowSelect}
                                                               key={Math.random()}/>
                                        })
                                    }
                                </View>
                            )
                        })
                    }
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
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {

})(ContactUs);
