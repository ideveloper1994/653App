import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    AsyncStorage, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import NavigationBar from '../../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import SettingHeader from '../components/settingHeader';
import OptionRow from '../components/multipleOptionSelection';
import { setSelectedTodayExercises } from '../../../../../../actions/metadataActions';
import _ from 'lodash';

let todayScreenExercise = [
    {title: 'Brain Training', isSelected: true, pageName: 'brainActivity'},
    {title: 'Emotional growth', isSelected: true, pageName: 'emotionalActivity'},
    {title: 'Visualize', isSelected: true, pageName: 'visualizationActivity'},
    {title: 'Healthy Activity', isSelected: true, pageName: 'healthyActivity'},

    {title: 'Meditation', isSelected: true, pageName: 'medicationActivity'},
    {title: 'Thought control', isSelected: true, pageName: 'thoughtActivity'},
    {title: 'Breathing practice', isSelected: true, pageName: 'breathingActivity'},

    {title: 'Stress relief', isSelected: true, pageName: 'stressRelief'},

    {title: 'Audio Exercise', isSelected: true, pageName: 'audioActivity'},
    {title: 'Choose your path', isSelected: true, pageName: 'chooseYourPathActivity'},
    {title: 'Story', isSelected: true, pageName: 'storyDetail'},
    {title: 'Did you know?', isSelected: true, pageName: 'didYouKnow'},

    {title: 'Kegal Exercises', isSelected: true, pageName: 'kegalsActivity'},
    {title: 'Faith and scripture', isSelected: false, pageName: 'faithActivity'},
    {title: 'Letters to Yourself', isSelected: true, pageName: 'lettersToYourSelf'},

    {title: 'Life tree', isSelected: true, pageName: 'lifeTree'},
    {title: 'Journal', isSelected: false, pageName: 'journal'},
    {title: 'About You', isSelected: true, pageName: 'aboutYouActivity'},

    {title: 'Notifications reminder', isSelected: true, pageName: 'notificationsReminder'},
];

class OptionalExercises extends Component {

    constructor(props){
        super(props);
        this.state = {
            todayScreenExercise: props.todayScreenExercise
        }
    }

    componentWillMount(){
        let propsTodayExercise = this.props.todayScreenExercise;
        if(propsTodayExercise.length !== todayScreenExercise.length){
            let diff = todayScreenExercise.length - propsTodayExercise.length;
            let i = 1;
            while (diff != 0){
                propsTodayExercise.push(todayScreenExercise[todayScreenExercise.length - i]);
                i+=1;
                diff -= 1;
            }
            this.setState({
                todayScreenExercise: propsTodayExercise
            });
            this.props.setSelectedTodayExercises(_.cloneDeep(propsTodayExercise));
        }
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

    onRowSelect = (mainKey) => {
        AsyncStorage.setItem('isTodayActivityChanged',"true");
        let data = this.state.todayScreenExercise;
        data[mainKey].isSelected = !data[mainKey].isSelected;
        this.setState({
            todayScreenExercise: data
        });
        this.props.setSelectedTodayExercises(_.cloneDeep(data));
    };

    onResetToDefault = (mainKey, objData) => {
        AsyncStorage.setItem('isTodayActivityChanged',"true");
        this.setState({
            todayScreenExercise: todayScreenExercise
        });
        this.props.setSelectedTodayExercises(_.cloneDeep(todayScreenExercise));
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               top={this.props.safeAreaInsetsData.top}
                               title='Today screen exercises'/>
                <ScrollView showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:50}}>

                        <SettingHeader headerTitle={"DOPAMINE REWIRING"}/>

                        <OptionRow rowData={this.state.todayScreenExercise[0]}
                                   mainIndex={0}
                                   onRowSelect={this.onRowSelect}/>

                        <OptionRow rowData={this.state.todayScreenExercise[1]}
                                   mainIndex={1}
                                   onRowSelect={this.onRowSelect}/>

                        <OptionRow rowData={this.state.todayScreenExercise[2]}
                                   mainIndex={2}
                                   onRowSelect={this.onRowSelect}/>

                        <OptionRow rowData={this.state.todayScreenExercise[3]}
                                   mainIndex={3}
                                   onRowSelect={this.onRowSelect}/>

                        <SettingHeader headerTitle={"HYPOFRONTALITY"}/>
                        <OptionRow rowData={this.state.todayScreenExercise[4]}
                                   mainIndex={4}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[5]}
                                   mainIndex={5}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[6]}
                                   mainIndex={6}
                                   onRowSelect={this.onRowSelect}/>

                        <SettingHeader headerTitle={"STRESS CONTROL"}/>
                        <OptionRow rowData={this.state.todayScreenExercise[7]}
                                   mainIndex={7}
                                   onRowSelect={this.onRowSelect}/>

                        <SettingHeader headerTitle={"WISDOM"}/>

                        <OptionRow rowData={this.state.todayScreenExercise[8]}
                                   mainIndex={8}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[9]}
                                   mainIndex={9}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[10]}
                                   mainIndex={10}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[11]}
                                   mainIndex={11}
                                   onRowSelect={this.onRowSelect}/>

                        <SettingHeader headerTitle={"OPTIONAL"}/>
                        <OptionRow rowData={this.state.todayScreenExercise[12]}
                                   mainIndex={12}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[13]}
                                   mainIndex={13}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[14]}
                                   mainIndex={14}
                                   onRowSelect={this.onRowSelect}/>
                    {
                        (Constant.isIOS) &&
                        <OptionRow rowData={this.state.todayScreenExercise[18]}
                                   mainIndex={18}
                                   onRowSelect={this.onRowSelect}/>
                    }
                        <SettingHeader headerTitle={"SHOW ON TODAY SCREEN"}/>

                        <OptionRow rowData={this.state.todayScreenExercise[15]}
                                   mainIndex={15}
                                   onRowSelect={this.onRowSelect}/>
                        <OptionRow rowData={this.state.todayScreenExercise[16]}
                                   mainIndex={16}
                                   onRowSelect={this.onRowSelect}/>


                        <OptionRow rowData={this.state.todayScreenExercise[17]}
                                   mainIndex={17}
                                   onRowSelect={this.onRowSelect}/>


                        <SettingHeader headerTitle={"RESET"}/>
                        <OptionRow rowData={{title: 'Reset to default'}}
                                   mainIndex={17}
                                   textStyle={{color:'#F00'}}
                                   onRowSelect={this.onResetToDefault}/>

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
        todayScreenExercise: state.metaData.todayScreenExercise,
        safeAreaInsetsData:state.user.safeAreaInsetsData
    };
};

export default connect(mapStateToProps, {
    setSelectedTodayExercises
})(OptionalExercises);

/*
 <SettingHeader headerTitle={"SHOW ON TODAY SCREEN"}/>
 <OptionRow rowData={this.state.todayScreenExercise[14]}
 mainIndex={14}
 onRowSelect={this.onRowSelect}/>
 <OptionRow rowData={this.state.todayScreenExercise[15]}
 mainIndex={15}
 onRowSelect={this.onRowSelect}/>
 * */
