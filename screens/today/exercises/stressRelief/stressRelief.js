import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import StressImageComponent from '../../component/exerices/stressReliefComponent';
import StressReliefInit from './stressReliefInit';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';
let arrRandom=[];

class StressRelief extends Component {

    constructor(props) {
        super(props);
        this.state={
            arrData:[],
            backcolor:"rgb(253,172,161)",
            isInstruction: true,
            exercise_number_stress_relief: props.exercise_number_stress_relief,
            params: props.navigation.state.params
        };
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        callTodayScreenEcentListner(false);
        if(this.props.navigation.state.params.isReplay){
            let exeNo = this.props.exercise_number_stress_relief;
            if(exeNo > 1) {
                exeNo -= 1;
                this.setState({
                    exercise_number_stress_relief: exeNo
                });
            }
        }
        arrRandom = [];
        this.setState({
            arrData: this.makeData()
        });
    }

    componentDidMount(){
        setTimeout(() => {
            this.generateRandom();
        }, 1000);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        callTodayScreenEcentListner();
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    generateRandom = () => {
        let maximun=39,minimum=0;
        let randomnumber = Math.floor(Math.random() * (maximun - minimum + 1)) + minimum;
        if(arrRandom.indexOf(randomnumber)  >  -1) {
            if(arrRandom.length != 40) {
                this.generateRandom();
            }else{
                setTimeout(() => {
                    this.onCompleteActivity();
                }, 1000);
            }
        } else{
            arrRandom.push(randomnumber);
            let arrDate = this.state.arrData;
            arrDate[randomnumber].isReviewing=true;
            // let strKey = "view" + randomnumber;
            // this.refs[strKey].pulse(100);
            this.setState({
                arrData:arrDate,
            });
        }
    };

    makeData = () => {
        let arrData = [];
        for(i=0;i<40;i++) {
            arrData.push({
                index:i,
                isSelected:false,
                isReviewing:false
            });
        }
        return arrData;
    };

    faceClicked = (obj) => {
        let arrDate = this.state.arrData;
        if(!arrDate[obj.index].isSelected && arrDate[obj.index].isReviewing) {
            arrDate[obj.index].isSelected = true;
            arrDate[obj.index].isReviewing = false;
            // let strKey = "view" + obj.index.toString();
            // this.refs[strKey].pulse();
            this.setState({
                arrData: arrDate,
            });
            this.generateRandom();
            this.setBackground();
        }
    };

    setBackground = () => {
        let colorstring = this.state.backcolor.split("(");
        let text = colorstring[1].split(",");
        let final = "rgb("+(parseInt(text[0])-2.625).toString()+","+(Math.floor(parseInt(text[1])+1.15)).toString()+","
            +(Math.floor(parseInt(text[2])+1.325)).toString()+")";
        this.setState({backcolor:final});
    };

    //Instruction Page
    onCloseButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));
        this.props.navigation.popToTop();
    };

    onCompleteActivity = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            let activityNo = this.props.exercise_number_stress_relief;
            activityNo += 1;
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.props.updateMetaData({ exercise_number_stress_relief: activityNo }, this.state.params.improve || []);
            if(this.state.params.isOptional){
                this.props.navigation.navigate("completeOptionalActivity",
                    {title: "Stress relief complete", data: ["Stress"]});
            }else{
                this.state.params.setDoneMorningRoutine(this.state.params.pageName);
                if(this.state.params.isLast){
                    this.props.navigation.navigate("completeMorningRoutine");
                }else{
                    this.manageMorningRoutine();
                }
            }
        }
    };

    manageMorningRoutine = () => {
        try{
            let morningRoutine = this.props.morningRoutine;
            let obj = _.find(morningRoutine,{pageName: this.state.params.pageName});
            let nextIndex = morningRoutine.indexOf(obj) + 1;
            let isLast = (morningRoutine.length-1 == nextIndex);
            let length = morningRoutine.length;
            let introTitle= (nextIndex + 1) + " of " + length;

            this.props.navigation.navigate(morningRoutine[nextIndex].pageName,
                {pageName: morningRoutine[nextIndex].pageName,
                    setDoneMorningRoutine: this.state.params.setDoneMorningRoutine,
                    isLast: isLast,
                    isOptional: false,
                    improve: morningRoutine[nextIndex].improve,
                    onCompleteExercises: this.state.params.onCompleteExercises,
                    makeFadeInAnimation: this.state.params.makeFadeInAnimation,
                    isReplay: false,
                    introTitle: introTitle,
                    scrollToTopToday: this.state.params.scrollToTopToday});
        }catch (e){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.popToTop();
        }
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setState({ isInstruction: false });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Stress"});
        if(obj != undefined){
            per = obj.progressPer
        }
        let title = "";

        if(this.state.params.isOptional) {
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            title = days[new Date().getDay()] + " Stress Relief";
        }else{
            title = (this.state.params.introTitle != undefined) && "Exercise " + this.state.params.introTitle || ""
        }

        return(
            <StressReliefInit
                introTitle={title}
                excerciseNumber = {this.state.exercise_number_stress_relief}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable={true}
                per={per}
            />
        )
    };

    render() {
        const {container,innerContainer} = styles;
        return (
            <View  style={{flex:1, backgroundColor: 'rgb(121,120,253)'}}>
                <AppStatusBar backColor={this.state.backcolor}/>
                <View style={{flex:1}}>
                    <View style={[container,{backgroundColor:this.state.backcolor}]}>
                        <View style={innerContainer}>
                            {
                                this.state.arrData.map((obj)=> {
                                    return (
                                        <StressImageComponent rowData={obj}
                                                              faceClicked={this.faceClicked}
                                                              key = {obj.index}/>
                                    )
                                })
                            }
                        </View>
                        {(this.state.isInstruction) ?
                            this.renderInitComponent()
                            : null }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'rgb(240,198,191)',
        justifyContent:'center',
        alignItems:'center'
    },
    innerContainer: {
        flexDirection:'row',
        flexWrap:'wrap',
        paddingTop:30,
        paddingBottom:30,
        paddingLeft:10,
        paddingRight:10,
        justifyContent:'center',
        alignItems:'center'
    },
});


const mapStateToProps = state => {
    return {
        exercise_number_stress_relief: state.metaData.metaData.exercise_number_stress_relief || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(StressRelief);