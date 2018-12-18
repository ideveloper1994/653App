import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import Constant from '../../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class SymptomsDetail extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    renderTitle = (que) => {
        const {queText} = styles;
        return(
            <View style={{paddingTop: 40, paddingBottom: 40}}>
                <Text style={queText}>
                    {que}
                </Text>
            </View>
        )
    };

    render() {
        const {container, detailText, mainView} = styles;
        return (
            <View style={container}>
                <View style={[mainView,{height:74+this.props.safeAreaInsetsData.top,paddingTop:this.props.safeAreaInsetsData.top + 10}]}>
                    <TouchableHighlight onPress={() => this.props.onClosePress(false)}
                                        underlayColor={Constant.transparent}>
                        <Ionicons name='ios-close-outline'
                                  size={35}
                                  color="#FFF"/>
                    </TouchableHighlight>
                    <View style={{flex:1,justifyContent:'center', alignItems: 'center'}}>
                        <Text style={styles.titleText}>Assessment Criteria</Text>
                    </View>
                    <Ionicons name='ios-close-outline'
                              size={35}
                              color="transparent"/>
                </View>

                <ScrollView style={container}>
                    <View style={{flex: 1, paddingLeft: 25, paddingRight: 25}}>

                        {this.renderTitle("What is pornography addiction?")}

                        <Text style={detailText}>
                            {"Porn addiction, also known as cybersex addiction or internet sex addiction, has been" +
                            " proposed as a sexual addiction characterized by virtual " +
                            "Internet sexual activity that causes serious negative consequences" +
                            " to one's physical, mental, social, and/or financial well-being. \n\n" +
                            "As a form of a compulsive behavior, it can be identified by three criteria: the" +
                            " failure of making a decision about engagement in the behavior, obsession with the behavior," +
                            " and the inability to stop " +
                            "the behavior despite negative consequences."
                            }
                        </Text>

                        {this.renderTitle("How do we determine your results?")}

                        <Text style={detailText}>
                            {"Your proprietary Brainbuddy test results are based on the following four categories, " +
                            "listed in descending order of importance. \n\n" +
                            "1. Severity of addiction. \n\n" +
                            "2. Age (in years) that you became ‘hooked’. \n\n" +
                            "3. Affect of addiction on personal, social and professional life. \n\n" +
                            "4. Duration of addiction. \n\n" +
                            "Your addiction percentage is based on the statistical difference between your results and the results of a " +
                            "control group who do not self-identify as ‘addicted’ nor present any of the symptoms commonly" +
                            " associated with pornography addiction. \n\n" +
                            "While support for pornography addiction is mounting, due to it’s novelty it is currently a disputed topic" +
                            " among health experts. Your results from this test should not be treated as a professional or " +
                            " physchiatric diagnosis, but rather as a strong indication that you may have an addiction problem in need of addressing. \n\n" +
                            "While the pyschiatric and mental health field continues to better understand pornography " +
                            "addiction, a number of studies (1)(2)(3) have found neurological markers of addiction in internet porn users, " +
                            "which is consistent with a large body of research finding similar markers in other kinds of problematic internet users. " +
                            "\" There’s a growing consensus among the top addiction neuroscientists worldwide that internet porn use alters some users’ " +
                            "brains in some of the same ways substance abuse does, and that these brain changes are " +
                            "consistent with the established addiction model.\" (4). \n\n"
                            }
                        </Text>

                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    mainView:{
        height: 74,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop:12,
        backgroundColor:'#EC3b29'},
    titleText:{
        fontSize: 14,
        color: '#FFF',
        textAlign: 'center',
        fontFamily: Constant.font700,
    },
    queText:{
        fontSize: 16,
        color: '#000',
        fontFamily: Constant.font500,
    },
    detailText:{
        lineHeight:20,
        color: '#4e4e4e',
        fontSize: 16,
        fontFamily: Constant.font500,
    }
});