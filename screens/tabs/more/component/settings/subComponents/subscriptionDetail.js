import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView, BackHandler,
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import DetailText from '../components/detailText';
import TermsConditions from '../../../../../../helper/termsConditions';

class SubscriptionDetails extends React.PureComponent {

    constructor(props){
        super(props);
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

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Subscription details'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    <DetailText detailText={this.detailText()}/>
                </ScrollView>
            </View>
        );
    }
    detailText = () => {
        return TermsConditions.subscription;
    }

}
//"\n\n'Unlock Full Access' subscriptions are priced at $12.99 per month, or $32.99 for three months.*" +
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {

})(SubscriptionDetails);
