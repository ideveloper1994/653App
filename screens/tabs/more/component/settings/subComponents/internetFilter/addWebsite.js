import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Alert,
    AsyncStorage,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import Constant from './../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import SettingRedtBtn from '../../components/settingRedBtton';
import SettingRow from '../../components/mainSettingRow';
import { manageInternetFilter} from "../../../../../../../actions/userActions";
import {find, sortBy} from 'lodash';
import moment from "moment/moment";

let kBlockList = "blockAllList";
let kBlockWebsite = "websites";
let kBlockKeyword = "keywords";

class AddWebsite extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            websiteName: "",
            // selectedDurationType: {title: "Block duration", dbValue:""},
            selectedDurationType: {title:'Block temporarily', dbValue:'temporary'},
            backColor: "#FFF"
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('preDuration').then((preDuration) => {
            if(preDuration){
                let jsonObj = JSON.parse(preDuration);
                this.setState({
                    selectedDurationType: jsonObj,
                    backColor: "#FFF",
                    websiteName: "",
                });
            }else{
                this.setState({
                    websiteName: "",
                    selectedDurationType: {title:'Block temporarily', dbValue:'temporary'},
                    backColor: "#FFF"
                });
            }
        });
    }

    componentDidMount() {
    };

    componentWillUnmount() {
        Keyboard.dismiss();
    }

    onTextChange = (text) => {
        this.setState({
            websiteName: text.trim()
        });
    }

    onAddWebsiteClicked = () => {

    };

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    }

    onDurationSelect = () => {
        this.props.navigation.navigate("blockDurationCard", {isWebSite: true,
            onSelectedDurationType: this.onSelectedDurationType,
            transition: "myCustomSlideRightTransition"});
    }

    addToBlockList = () => {
        try{
            if(this.state.websiteName.trim().length == 0){
                Alert.alert("Please enter website name that you want to block");
            }else if(this.state.selectedDurationType.dbValue == ""){
                Alert.alert("Please select duration for block this website");
            }else {
                    let obj = find(this.props.internetFilterList[1][kBlockWebsite][0].allWebSite, {name: this.state.websiteName});
                    if(obj !== undefined){
                        Alert.alert("Website already exists in blocked list");
                    }else{
                        let internetFilterList = [];
                        let settingDetail = this.props.internetFilterList;
                        let obj = {};
                        internetFilterList = this.props.internetFilterList[1][kBlockWebsite][0].allWebSite;
                        let startingDate = moment().format('YYYY-MM-DD HH:mm:ss');
                        let endingDate = moment().format('YYYY-MM-DD HH:mm:ss');
                        let dbVal = this.state.selectedDurationType.dbValue;
                        if (dbVal == 'day') {
                            endingDate = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
                        } else if (dbVal == 'week') {
                            endingDate = moment().add(1, 'week').format('YYYY-MM-DD HH:mm:ss');
                        } else if (dbVal == 'month') {
                            endingDate = moment().add(1, 'month').format('YYYY-MM-DD HH:mm:ss');
                        } else if (dbVal == 'year') {
                            endingDate = moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
                        } else if (dbVal == 'passcode') {
                        }
                        let daysLeft = moment(endingDate).diff(moment(startingDate), 'days');
                        obj = {
                            name: this.state.websiteName.trim(), duration: dbVal,
                            startingDate, endingDate, daysLeft
                        };
                        obj.isTemporaty = dbVal == "temporary";
                        internetFilterList.push(obj);
                        internetFilterList = sortBy(internetFilterList, obj => obj.name);
                        settingDetail[1][kBlockWebsite][0].allWebSite = internetFilterList

                        this.props.manageInternetFilter(settingDetail);

                        this.onBackButtonPress();
                    }
            }
        }catch (e){
                    console.log("err - onselectOption", e);
                }
    }

    onSelectedDurationType = (selectedDuration) => {
        this.setState({
            selectedDurationType: selectedDuration
        });
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Add a website...'/>
                <SettingHeader headerTitle={"DETAILS"}/>

                <View>
                    <View style={styles.containerStyle}>
                        <TextInput
                            style={{backgroundColor: '#FFF', flex:1, fontSize: 14}}
                            placeholder={'www.example.com'}
                            clearButtonMode="while-editing"
                            value={this.state.websiteName}
                            onChangeText={(text) => this.onTextChange(text)}
                            ref="txtInput"
                            keyboardType={"url"}
                            autoFocus={true}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            selectionColor={Constant.selectionColor}/>
                    </View>
                    <SettingRow rowData={this.state.selectedDurationType}
                                onRowSelect={this.onDurationSelect} />
                </View>

                <SettingHeader headerTitle={""} viewStyle={{height: 45}}/>

                <SettingRedtBtn title="Add to block list"
                                onPress={this.addToBlockList}/>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.settingHeaderColor,
    },
    containerStyle:{
        borderBottomColor: Constant.settingGrayColor,
        borderBottomWidth: 1,
        height: 45,
        width:Constant.screenWidth,
        backgroundColor:'#FFF',
        paddingLeft:20,
        paddingRight:10,
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
})(AddWebsite);