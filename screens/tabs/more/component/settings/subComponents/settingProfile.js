import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Keyboard, BackHandler, AsyncStorage
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import OptionRow from '../components/optionRow';
import SettingRow from '../components/mainSettingRow';
import { updateUserDetail } from '../../../../../../actions/userActions';
import {updateMetaDataNoCalculation} from "../../../../../../actions/metadataActions";

class ProfileSettings extends Component {

    constructor(props){
        super(props);
        this.state = {
            gender: props.userDetails.gender,
            sexuality: props.userDetails.orientation,
            firstName: props.userDetails.name,
            age: props.userDetails.age.toString(),
            region: props.userDetails.region,
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
        this.props.updateUserDetail({
            name: this.state.firstName,
            age: parseInt(this.state.age) || 0,
            gender: this.state.gender,
            region: this.state.region,
            orientation: this.state.sexuality,
        });
        Keyboard.dismiss();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onSelectOption = (type, selectedTitle) => {
        let state = this.state;
        state[type] = selectedTitle;
        this.setState(state);
        if(type=="gender"){
            this.updateUserDetails(selectedTitle);
        }
    };

    focusNextField = (nextField) => {
        if(this.refs && this.refs[nextField]){
            this.refs[nextField].focus();
        }
    };

    onSelectAvatarRow = (objRowData) => {
        const pageName = objRowData.pageName + "Card"
        this.props.navigation.navigate(pageName,
            {transition: "myCustomSlideRightTransition"});
    };

    updateUserDetails = (type) => {
        let obj = this.props.userDetails;
        if(obj.gender !== type){
            obj.gender = type;
            this.props.updateUserDetail(obj);
        }
    };

    onSelectReligion = (objRowData) => {
        this.setState({
            isReligious: !objRowData.value
        });
        if(objRowData.value){
            AsyncStorage.setItem('isShowReligiousContent',"No");
        }else{
            AsyncStorage.setItem('isShowReligiousContent',"Yes");
        }
        this.props.updateMetaDataNoCalculation({wants_religious_content: !objRowData.value});
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Profile settings'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>

                    <SettingHeader headerTitle="ABOUT YOU"/>
                    <View style={styles.mainView}>
                        <Text style={styles.rowTitle}>First Name</Text>
                        <TextInput  ref="txtFName"
                                    value={this.state.firstName}
                                    style={ styles.textInput }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(text) => {
                                        this.setState({
                                            firstName:text
                                        });
                                    }}
                                    returnKeyType={'done'}
                                    maxLength={100}
                                    selectionColor={Constant.selectionColor}
                                    enablesReturnKeyAutomatically={true}
                                    //onSubmitEditing={() => this.focusNextField('txtAge')}
                                    underlineColorAndroid={Constant.transparent}/>
                    </View>
                    <View style={styles.mainView}>
                        <Text style={styles.rowTitle}>Age</Text>
                        <TextInput  ref="txtAge"
                                    keyboardType={'numeric'}
                                    value={this.state.age}
                                    style={ styles.textInput }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType={'done'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            age: text
                                        });
                                    }}
                                    maxLength={3}
                                    selectionColor={Constant.selectionColor}
                                    underlineColorAndroid={Constant.transparent}/>
                    </View>
                     <SettingHeader headerTitle="GENDER"/>
                        <OptionRow title="Male"
                                   type="gender"
                                   value={this.state.gender}
                                   dbValue="male"
                                   onSelectOption={this.onSelectOption}/>

                        <OptionRow title="Female"
                                   type="gender"
                                   dbValue="female"
                                   value={this.state.gender}
                                   onSelectOption={this.onSelectOption}/>

                        <OptionRow title="Transgender - Male"
                                   type="gender"
                                   dbValue="transgender_male"
                                   value={this.state.gender}
                                   onSelectOption={this.onSelectOption}/>

                        <OptionRow title="Transgender - Female"
                                   type="gender"
                                   dbValue="transgender_female"
                                   value={this.state.gender}
                                   onSelectOption={this.onSelectOption}/>

                        <SettingHeader headerTitle="SEXUALITY"/>

                        <OptionRow title="Heterosexual"
                                   type="sexuality"
                                   dbValue="heterosexual"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.sexuality}/>

                        <OptionRow title="Homosexual"
                                   type="sexuality"
                                   dbValue="homosexual"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.sexuality}/>

                        <OptionRow title="Transsexual"
                                   type="sexuality"
                                   dbValue="bisexual"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.sexuality}/>

                        <SettingHeader headerTitle="REGION"/>

                        <OptionRow title="North America"
                                   type="region"
                                   dbValue="america"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.region}/>

                        <OptionRow title="Europe"
                                   type="region"
                                   dbValue="europe"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.region}/>

                        <OptionRow title="Asia"
                                   type="region"
                                   dbValue="asia"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.region}/>

                        <OptionRow title="Australia and New Zealand"
                                   type="region"
                                   dbValue="pacific"
                                   onSelectOption={this.onSelectOption}
                                   value={this.state.region}/>

                    <SettingHeader headerTitle="RELIGION"/>
                    <SettingRow rowData={{title: 'Religious content', pageName: 'Religious', isSwitch: true, value: this.props.isReligious}}
                                onRowSelect={this.onSelectReligion}/>

                    <SettingHeader headerTitle="PERSONALIZE"/>
                    <SettingRow rowData={{title: 'Change avatar', pageName: 'changeAvatarImage'}}
                                    onRowSelect={this.onSelectAvatarRow}/>
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
        fontSize: 15,
        color: 'rgb(75,75,75)',
        fontFamily: Constant.font500,
        flex:0.3
    },
    textInput:{
        color: 'rgb(75,75,75)',
        fontSize: 14,
        paddingBottom: 0,
        height:45,
        fontFamily: Constant.font500,
        flex:0.7    ,
        marginLeft:20,
        textAlign:'right'
    }
});

const mapStateToProps = state => {
    return {
        userDetails:state.user.userDetails,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        isReligious: state.metaData.metaData.wants_religious_content || false,
        checkupTime: state.metaData.metaData.checkup_time || 18,
    };
};

export default connect(mapStateToProps, {
    updateUserDetail, updateMetaDataNoCalculation
})(ProfileSettings);
