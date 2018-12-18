import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';
import Constant from '../../../../../helper/constant';
import TermsConditions from '../../../../../helper/termsConditions';

export default  class ViewDetails extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            selectedTab: 0
        };
    }

    componentWillMount() {
    }

    changeTab = (selected) => {
        this.setState({
            selectedTab: selected
        });
    };

    render() {
        const {container, textDetail} = styles;
        return (
            <ScrollView style={container}
                        contentContainerStyle={{paddingTop:45, paddingLeft:20, paddingRight:20, paddingBottom:50}}
                        showsVerticalScrollIndicator={false}>
                <Text style={textDetail}>
                    {this.getText()}
                </Text>
            </ScrollView>
        );
    }

    getText = () => {
        if(this.props.selectedTab == 0) {
            return TermsConditions.subscription;
        }else if(this.props.selectedTab == 1) {
            return TermsConditions.termsOfUse;
        }else{
            return TermsConditions.privacyPolicy;
        }
    }

}
////"\n\n'Unlock Full Access' subscriptions are priced at $12.99 per month, or $32.99 for three months.*" +
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backProgressBarColor,
    },
    textDetail:{
        fontSize: 14,
        color: '#FFF',
        fontFamily: Constant.font500,
        lineHeight: 18,
    }
});