import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Alert,
    AsyncStorage,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal
} from 'react-native';
import Constant from './../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import moment from 'moment';
import SettingHeader from '../../components/settingHeader';
import SettingRedtBtn from '../../components/settingRedBtton';
import { manageInternetFilter} from "../../../../../../../actions/userActions";
import EnterPasscodeForunblock from './subComponent/enterPasscodeForUnblock';

let kBlockList = "blockAllList";
let kBlockWebsite = "websites";
let kBlockKeyword = "keywords";

class DetailsView extends React.PureComponent{

    constructor(props) {
        super(props)
        this.state = {
            webSite: props.navigation.state.params.Website,
            isLeftDays: false,
            leftDayText: "",
            isWebSite: props.navigation.state.params.isWebSite,
            modalVisible: false
        };
    };

    componentWillMount() {
        let date = this.props.navigation.state.params.Website.endingDate;
        let date1 = moment(date,"YYYY-MM-DD HH:mm:ss").toDate();
        let daysLeft = moment(date1).diff(moment(), 'days');
        if(daysLeft >= 0 && this.props.navigation.state.params.Website.duration !== "passcode"){
            let formatedDate = moment(date1).format("MMMM D, YYYY");
            this.setState({
                isLeftDays: true,
                leftDayText: formatedDate
            });
        }
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    manageUnblockList = () => {
        try{
            let settingDetail = this.props.internetFilterList;
            if(this.state.isWebSite){
                let allWebsites = this.props.internetFilterList[1][kBlockWebsite][0].allWebSite;
                let index = allWebsites.indexOf(this.state.webSite);
                allWebsites.splice(index,1);
                settingDetail[1][kBlockWebsite][0].allWebSite = allWebsites;
            }else{
                let allKeyword = this.props.internetFilterList[2][kBlockKeyword][0].allKeywords;
                let index = allKeyword.indexOf(this.state.webSite);
                allKeyword.splice(index,1);
                settingDetail[2][kBlockKeyword][0].allKeywords = allKeyword;
            }
            this.props.manageInternetFilter(settingDetail);
            this.onBackButtonPress();
        }catch(e){
        }
    };

    onUnblockSelect = () => {
        if(this.state.webSite.isTemporaty || !this.state.isLeftDays){
            if(this.props.navigation.state.params.Website.duration === "passcode"){
                this.setState({
                    modalVisible: true
                });
            }else{
                this.manageUnblockList();
            }
        }else{
            let title = "Keyword Blocked";
            let description = "You cannot remove this keyword before " + this.state.leftDayText;
            if(this.state.isWebSite){
                title = "Website Blocked";
                description = "You cannot remove this website before " + this.state.leftDayText;
            }
            Alert.alert(title,
                description,
                [
                    {text: 'OK', onPress: () => {}},
                ],
            );
        }
    };


    onCloseModal = (isDone) => {
        if(isDone){
            this.manageUnblockList();
            setTimeout(()=>{
                this.setState({
                    modalVisible: false
                });
            },300);
        }else{
            this.setState({
                modalVisible: false
            });
        }
    }


    render() {
        let title = "";
        let blockTitle = "";
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Details'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>

                    <SettingHeader headerTitle={"DETAILS"}/>

                    <View style={styles.mainView}>
                        <Text style={styles.rowTitle}>
                            {this.state.webSite.name}
                        </Text>
                    </View>
                    {
                        <View style={styles.mainView}>
                            <Text style={styles.rowTitle}>
                                {
                                    (this.props.navigation.state.params.Website.duration == "passcode") &&
                                    "Blocked until passcode entered" ||
                                    (!this.state.webSite.isTemporaty && this.state.isLeftDays)
                                    && "Blocked until " + this.state.leftDayText
                                    || "Blocked temporarily"
                                }

                            </Text>
                        </View>
                        || null
                    }

                    <SettingHeader headerTitle={""} viewStyle={{height: 45}}/>

                    <SettingRedtBtn title={"Unblock"}
                                    onPress={this.onUnblockSelect}/>

                </ScrollView>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <EnterPasscodeForunblock onCloseModal={this.onCloseModal}/>
                </Modal>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    },
    mainView:{
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        height:45,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },
    rowTitle:{
        fontSize: 14,
        color: '#4e4e4e',
        fontFamily: Constant.font500,
        flex:1
    }
});


const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        internetFilterList:state.user.internetFilterList,
    };
};

export default connect(mapStateToProps, {
    manageInternetFilter
})(DetailsView)