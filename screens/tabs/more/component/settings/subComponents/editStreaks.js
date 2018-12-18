import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import SettingRow from '../components/settingRow';

class EditStreacks extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onSelectOption = (rowData) => {
        if(rowData.type == 'porn'){
        }else{
        }
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               title='Edit streaks'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>

                    <SettingHeader headerTitle="STREAKS"/>

                    <SettingRow rowData={{title: 'Edit current porn streak', type:'porn'}}
                                onRowSelect={this.onSelectOption}/>

                    <SettingRow rowData={{title: 'Edit current masturbation streak', type:'masturbation'}}
                                onRowSelect={this.onSelectOption}/>

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
});

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, {

})(EditStreacks);