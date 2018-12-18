import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView, BackHandler,
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import HelpRowComponent from './helpFAQRow';

let faqData = [
    {
        question: "What is porn addiction?",
        answer: "Porn addiction is the excessive viewing of pornography that" +
        " becomes problematic for the individual due to excessive time spent viewing pornography, " +
        "while neglecting other important aspects of their life." +
        "\n\nIndividuals may report depression, low self-esteem, career loss, decreased productivity, or" +
        " negative relationship consequences as a result of their addiction.",
    },
    {
        question: "What is rebooting?",
        answer: "Rebooting is a common term for recovering from porn addiction and the associated symptoms. The quickest way to reboot" +
        " is to give your brain a rest from artificial sexual stimulation, masturbation, and orgasm." +
        "\n\nWhile quitting masturbation is not strictly required, many users report an improved reboot by quitting masturbation as well." +
        "\n\nReal sex during your reboot can be beneficial , as it can help rewire your brain to it's natural state of desiring genuine intercourse.",
    },
    {
        question: "Brainbuddy exercises",
        answer: "Our Brainbuddy exercises are designed to help make your reboot more effective, while also strengthening key " +
        "areas that improve motivation, wisdom, and reduce the likelihood of relapse.",
    },
    {
        question: "What happens if I miss my checkup?",
        answer: "Should you miss your checkup, you'll be prompted to complete it the next day. If you miss more than one," +
        " we'll ask you to take a moment to look over your calendars to ensure your progress is accurate. For best results," +
        " we recommend completing your checkup as often as possible so Brainbuddy can best measure your progress.",
    },
    {
        question: "How are my streaks calculated?",
        answer: "Your streak is determined from the number of full days since your last relapse. So if you relapse at 3pm," +
        " your streak will reach one at midnight the next day.",
    },
    {
        question: "Account and payment settings",
        answer: (Constant.isIOS) && "You can start, modify or cancel your Brainbuddy subscription by going to your Apple App Store account " +
        "in your iPhone settings. If you need help finding your App Store account settings, get in contact with us for help." ||
        "You can start, modify or cancel your Brainbuddy subscription by accessing your Google Play account." +
        " If you need help finding your account settings, get in contact with us for help.",
    },
    {
        question: "Protecting your privacy",
        answer: "Unlike some other apps, we appreciate that for many, porn addiction is a deeply personal and private subject." +
        " As such we do not collect any user identifiable information, all account details are securely encrypted, " +
        "and your personal data is not sold to third parties. For more information, please refer to our privacy policy.",
    }
];
class HelpFAQ extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            faqData,
            selectedIndex: -1
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

    onRowSelect = (index) => {
        this.setState({
            selectedIndex: index
        });
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Help & FAQ'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    {
                        this.state.faqData.map((obj,index) => {
                            return (
                                <HelpRowComponent rowData={obj}
                                                  onRowSelect={this.onRowSelect}
                                                  selectedIndex={this.state.selectedIndex}
                                                  index={index}
                                                  key={index}/>
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
        backgroundColor: '#FFF',
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

})(HelpFAQ);
