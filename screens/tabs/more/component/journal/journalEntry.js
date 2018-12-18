import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView, BackHandler
} from 'react-native';
import moment from 'moment';
import Constant from '../../../../../helper/constant';
import NavigationBar from '../../../../commonComponent/navBar';
import SectionHeader from './entrySectionHeader';
import EntryRow from './entryRow';
import {removeSafeArea} from "../../../../../actions/userActions";
import {getJournalDays} from "../../../../../actions/statisticAction";
import { connect } from 'react-redux';

class JournalEntry extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.props.getJournalDays();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    componentWillUnmount(){
        this.props.removeSafeArea(true);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }


    onBackButtonPress = () => {
        this.props.removeSafeArea(true);
        this.props.navigation.goBack();
    };

    onRowSelect = (rowData) => {
        this.props.navigation.navigate('journalComposeCard', { rowData: rowData,
            transition: "myCustomSlideRightTransition"});
    };

    onSwipeRight(gestureState) {
        this.onBackButtonPress();
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               title="Journal entries"
                               top={this.props.safeAreaInsetsData.top}
                               isRightButton={false}/>
                <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:50}}>
                    {
                        Object.keys(this.props.journal_date_wise_list).map((obj) => {
                            let a = moment(obj,'MMMM-YYYY').format('MMMM YYYY');
                            return(
                                <View key={obj}>
                                    <SectionHeader sectionTitle={a} key={obj} />
                                    {
                                        Object.keys(this.props.journal_date_wise_list[obj]).map(item => {
                                            let rowData = this.props.journal_date_wise_list[obj][item];
                                            return(
                                                <EntryRow onRowSelect={this.onRowSelect}
                                                          rowData = { rowData }
                                                          key = { rowData.key }/>
                                            );
                                        })
                                    }
                                </View>
                            );
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
        backgroundColor: Constant.grayBackground
    },
});

const mapStateToProps = state => {
    return {
        journal_date_wise_list:state.statistic.journal_date_wise_list,
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {
    removeSafeArea,getJournalDays
})(JournalEntry);
