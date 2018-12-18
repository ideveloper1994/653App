import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Alert, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import SettingRow from '../components/settingRow';
import {resetPornStatistics,
    resetMasturbationStatistics,
    resetRewiringProgress,
    resetRewiringExercises} from '../../../../../../actions/statisticAction';
import Spinner from '../../../../../commonComponent/initialScreen';
import {showThemeAlert} from "../../../../../../helper/appHelper";

class Reset extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            isUpdating: false
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

    onRowSelect = (rowData) => {
        if(rowData && rowData.key){
            showThemeAlert({
                title: "Are you sure?",
                message: "There will be no way to restore this data.",
                leftBtn: "Cancel",
                leftPress: ()=>{
                },
                rightBtn: "Reset",
                styleRight: 'destructive',
                rightPress: ()=>{
                    this.performResetData(rowData.key);
                },
                isLightTheme: this.props.appTheme === Constant.lightTheme
            });
        }
    };

    performResetData = (key) => {
        this.setIsUpdating(true);
        switch (key){
            case "porn":
                this.props.resetPornStatistics(this.props.p_array).then(res=>{
                    this.setIsUpdating(false);
                }).catch(err=>{
                    this.setIsUpdating(false);
                });
                break;
            case "masturbation":
                this.props.resetMasturbationStatistics(this.props.m_array).then(res=>{
                    this.setIsUpdating(false);
                }).catch(err=>{
                    this.setIsUpdating(false);
                });
                break;
            case "rewiringProgress":
                this.props.resetRewiringProgress().then(res=>{
                    this.setIsUpdating(false);
                }).catch(res=>{
                    this.setIsUpdating(false);
                });
                break;
            case "rewiringExercises":
                this.props.resetRewiringExercises().then(res=>{
                    this.setIsUpdating(false);
                }).catch(err=>{
                    this.setIsUpdating(false);
                });
                break;
            case "all":
                this.props.resetPornStatistics(this.props.p_array).then(res=>{
                    return this.props.resetMasturbationStatistics(this.props.m_array);
                }).then(res=>{
                    return this.props.resetRewiringProgress();
                }).then(res=>{
                    return this.props.resetRewiringExercises();
                }).then(res=>{
                    this.setIsUpdating(false);
                }).catch(err=>{
                    this.setIsUpdating(false);
                });
                break;
        }
    };

    setIsUpdating = (flag) => {
        this.setState({
            isUpdating: flag
        });
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Reset'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                        <SettingHeader headerTitle="RESET"/>
                        <SettingRow rowData={{title: 'Reset porn statistics', isONlyText: true, key:"porn"}}
                                    onRowSelect={this.onRowSelect}/>
                        <SettingRow rowData={{title: 'Reset masturbation statistics', isONlyText: true, key:"masturbation"}}
                                    onRowSelect={this.onRowSelect}/>

                        <SettingRow rowData={{title: 'Reset rewiring progress', isONlyText: true, key: "rewiringProgress"}}
                                    onRowSelect={this.onRowSelect}/>

                        <SettingRow rowData={{title: 'Reset rewiring exercises', isONlyText: true, key:"rewiringExercises"}}
                                    onRowSelect={this.onRowSelect}/>
                        <SettingHeader headerTitle=""/>
                        <SettingRow rowData={{title: 'Reset all data', isONlyText: true, key: "all"}}
                                    color="red"
                                    onRowSelect={this.onRowSelect}/>
                </ScrollView>
                {
                    (this.state.isUpdating) &&
                    <Spinner visible={true}
                             backColor="rgba(0,0,0,0.3)"/> || null
                }

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
        p_array: state.statistic.pornDetail.p_array,
        m_array: state.statistic.mosturbutionDetail.m_array,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    resetPornStatistics,
    resetMasturbationStatistics,
    resetRewiringProgress,
    resetRewiringExercises
})(Reset);
