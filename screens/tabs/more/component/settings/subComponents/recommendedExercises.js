import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Keyboard
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import OptionRow from '../components/multipleOptionSelection';
import _ from 'lodash';

class RecommendedExercises extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            recommendedData:[]
        };
    }

    componentWillMount() {
        let settingDetails = [
            {"THOUGHT CONTROL":[
                {title: 'Thought Control', isSelected: true},
                {title: 'Rewiring Exercises', isSelected: true},
                {title: 'Brain Training', isSelected: true},
            ]},
            {"WISDOM":[
                {title: 'Choose Your Path', isSelected: true},
                {title: 'Letters To Yourself', isSelected: true},
                {title: 'Stories', isSelected: true},
                {title: 'Learning Videos', isSelected: true},
            ]},
            {"DOPAMINE REWIRING":[
                {title: 'Visualization', isSelected: true},
                {title: 'Healthy Activity', isSelected: true},
            ]},
            {"STRESS REDUCTION":[
                {title: 'Breathing Practice', isSelected: true},
                {title: 'Stress Relief', isSelected: true},
                {title: 'Escape', isSelected: true},
            ]}
        ];
        this.setState({
            recommendedData: settingDetails
        });
    }

    componentWillUnmount() {
    }

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    };

    onRowSelect = (mainKey, mainIndex, innerIndex) => {
        let data = this.state.recommendedData;
        data[mainIndex][mainKey][innerIndex].isSelected = !data[mainIndex][mainKey][innerIndex].isSelected;
        this.setState({
            recommendedData: data
        });
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               title='Recommended exercises'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>
                    {
                        this.state.recommendedData.map((objSetting,index) => {
                            let headerTitle = Object.keys(objSetting);
                            return(
                                <View key={index}>
                                    <SettingHeader headerTitle={headerTitle[0]}/>
                                    {
                                        objSetting[headerTitle[0]].map((objRow, i) => {
                                            return <OptionRow rowData={objRow}
                                                              mainIndex={index}
                                                              innerIndex={i}
                                                              mainKey={headerTitle}
                                                              onRowSelect={this.onRowSelect}
                                                              key={Math.random()}/>
                                        })
                                    }
                                </View>
                            )
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
    };
};

export default connect(mapStateToProps, {

})(RecommendedExercises);