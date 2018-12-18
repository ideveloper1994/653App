import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import Constant from '../../../../../../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class InternetFilterHelp extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    renderTitle = (que) => {
        const {queText} = styles;
        return(
            <View style={{paddingTop: 40, paddingBottom: 20}}>
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
                        <Text style={styles.titleText}>Internet Filter Help</Text>
                    </View>
                    <Ionicons name='ios-close-outline'
                              size={35}
                              color="transparent"/>
                </View>

                <ScrollView style={container}>
                    <View style={{flex: 1, paddingLeft: 25, paddingRight: 25}}>

                        {this.renderTitle("How can I block multiple keywords in a single URL?")}

                        <Text style={detailText}>
                            {"You can block up to two keywords by adding a period and asterix (.*) between the two words you wish to block.\n\n" +
                            "For example, if you want to block any URLS that contain both the words sun and moon, then add an entry like this -\n\n" +
                             "sun.*moon\n\n" +
                            "This entry will block:\n" +
                            "www.suntimeandmoontime.com\n\n" +
                            "However it will not block:\n" +
                            "www.sun.com"
                            }
                        </Text>

                        {this.renderTitle("Why is the Brainbuddy content filter button greyed out in Safari settings?")}

                        <Text style={detailText}>
                            {"The content filter toggle is disabled because you have Safari restrictions enabled on your device." +
                            " Disable Restrictions, enable the Brainbuddy Internet Filter, and then you may re-enable your restrictions.\n\n" +
                            "Enabling restrictions after you have turned on the Brainbuddy filter is a great method to prevent" +
                            " yourself from simply disabling the filter in settings."
                            }
                        </Text>

                        {this.renderTitle("My filter doesn’t seem to be blocking keywords correctly?")}

                        <Text style={detailText}>
                            {"First, try ‘force closing’ Safari and reopening it. To do this, bring up the app card switcher, " +
                            "and swipe up on the safari card to close it. If this doesn’t work, try restarting your device.\n\n" +
                            "Still having issues? It’s likely you are running too many content blockers at the same time. To check this," +
                            " visit Settings -> Safari -> Content Blockers and ensure that only Brainbuddy Internet Filter is active.\n\n" +
                            "If you wish to use an Ad Blocker in addition to the Brainbuddy filter, " +
                            "choose one that contains only a minimum number of rules. We recommend AdGuard with only the default block list enabled.\n\n"
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
        backgroundColor:Constant.backColor},
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