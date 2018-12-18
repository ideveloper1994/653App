import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text, BackHandler
} from 'react-native';
import Constant from '../../../../../../../helper/constant';
import NavigationBar from '../../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../../components/settingHeader';
import SettingRow from '../../components/mainSettingRow';
import SettingRedtBtn from '../../components/settingRedBtton';

class AccountDetails extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
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

    renderObj = (obj) => {
        return Object.keys(obj).map((key, index) =>{
            return(
                <Text style={styles.text} key={index}>
                    {key} : {obj[key] || "null"}
                </Text>
            )
        })
    }

    //Porn or Masturbation days
    renderDays = (obj) => {
        return(
            <View>
                <Text style={styles.text}>
                    {"id : " + obj.id.toString()}
                </Text>
                <Text style={styles.text}>
                    {obj.occurred_at + " : "}
                    {obj.is_relapse && "RELAPSE" || "CLEAN"}
                </Text>
            </View>
        )
    };

    renderArray = (objArr) => {
        return objArr.map(obj=>{
            if(Array.isArray(obj)){
                this.renderArray(obj);
            }else if(typeof obj === "object"){
                this.renderObj(obj);
            }
        })
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='My data'/>

                <ScrollView contentContainerStyle={{paddingBottom:50}}>

                    <SettingHeader headerTitle={"User".toLocaleUpperCase()}/>
                    {
                        this.renderObj(this.props.userDetails)
                    }
                    <SettingHeader headerTitle={"Meta".toLocaleUpperCase()}/>
                    {
                        this.renderObj(this.props.metaData)
                    }

                    <SettingHeader headerTitle={"Letters".toLocaleUpperCase()}/>
                    {
                        this.props.letters.map(obj=>{
                            return this.renderObj(obj)
                        })
                    }

                    <SettingHeader headerTitle={"Porn Days".toLocaleUpperCase()}/>
                    {
                        this.props.p_array.map(obj=>{
                            return this.renderDays(obj)
                        })
                    }

                    <SettingHeader headerTitle={"Masturbation Days".toLocaleUpperCase()}/>
                    {
                        this.props.m_array.map(obj=>{
                            return this.renderDays(obj)
                        })
                    }
                    <SettingHeader headerTitle={"Journal Entries".toLocaleUpperCase()}/>
                    {
                        this.props.j_array.map(obj=>{
                            return this.renderObj(obj)
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
        backgroundColor: Constant.settingHeaderColor,
    },
    text:{
        marginLeft: 20,
        color: '#4e4e4e',
        fontSize: 15,
        fontFamily: Constant.font500,
        marginTop: 10
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        userDetails: state.user.userDetails,
        metaData: state.metaData.metaData,
        letters:state.letters.letters,
        p_array: state.statistic.pornDetail.p_array,
        m_array: state.statistic.mosturbutionDetail.m_array,
        j_array: state.statistic.j_array,
    };
};

export default connect(mapStateToProps, {

})(AccountDetails);
