import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Image, Keyboard,
    BackHandler, AsyncStorage
} from 'react-native';
import Constant from '../../../../helper/constant';
import ChoosePathImage from '../../component/exerices/choosePathComponent/choosePathImage';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import ChooseYourPathInit from './chooseYourPathInit';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';

let imgCounter = 0;

class chooseYourPathActivity extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            pathCounter:1,
            goodImageNo:1,
            goodLayer:false,
            badLayer:false,
            isInstruction: true,
            isLoaded: false,
            exercise_number_choose: props.exercise_number_choose,
            params: props.navigation.state.params
        };
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        let exeNo = this.props.exercise_number_choose;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo = exeNo - 1;
            }
        }else{
            if(exeNo > 50){
                exeNo = 1;
            }
        }
        this.setState({
            exercise_number_choose: exeNo
        });
        imgCounter = 0

        callTodayScreenEcentListner(false);
        // let arrImg = [ "https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+((exeNo*3)-2).toString()+".jpg",
        //     "https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+((exeNo*3)-1).toString()+".jpg",
        //     "https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+(exeNo*3).toString()+".jpg",
        //     "https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-1.jpg",
        //     "https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-2.jpg",
        //     "https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-3.jpg"
        // ];
        // const libraryImages = arrImg.map(img => Image.prefetch(img));
        // Promise.all(libraryImages)
        //     .then(res => {
        //         // setTimeout(()=>{
        //         //     this.setState({isLoaded: true});
        //         // },1000);
        //     }).catch(err => {
        // })
    }

    componentWillUnmount() {
        callTodayScreenEcentListner();
    }

    onCompleteActivity = () => {
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            this.state.params.onCompleteExercises(this.state.params.pageName);
            this.state.params.setDoneMorningRoutine(this.state.params.pageName);
            let activityNo = this.props.exercise_number_choose;
            if(activityNo >= 50){
                if(activityNo > 50){
                    activityNo = 1;
                }else{
                    activityNo = activityNo + 1;
                }
            }else{
                activityNo = activityNo + 1;
            }
            this.props.updateMetaData({ exercise_number_choose: activityNo }, this.props.improve || []);
            if(this.state.params.isLast){
                this.props.navigation.navigate("completeMorningRoutine");
            }else{
                this.manageMorningRoutine();
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
                    setDoneMorningRoutine:  this.state.params.setDoneMorningRoutine,
                    isLast: isLast,
                    isOptional: false,
                    improve: morningRoutine[nextIndex].improve,
                    onCompleteExercises:  this.state.params.onCompleteExercises,
                    makeFadeInAnimation: this.state.params.makeFadeInAnimation,
                    isReplay: false,
                    introTitle: introTitle,
                    scrollToTopToday: this.state.params.scrollToTopToday,
                });
        }catch (e){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.popToTop();
        }
    };

    _onGoodImagePressed = () => {
        // this.refs.goodImage.pulse(500);
        this.setState({goodLayer: true});
        setTimeout(() => {
                if(this.state.pathCounter >= 3) {
                    this.setState({pathCounter:1,goodLayer:false, badLayer: false});
                    this.onCompleteActivity();
                } else {
                    this.setState({pathCounter:++this.state.pathCounter,goodLayer:false, badLayer: false});
                }
            }
            ,800);
    };

    _onBadImagePressed = () => {
        this.setState({badLayer:true});
    };

    //Instruction Page
    onCloseButtonPress = () => {
        //this.props.navigation.goBack();
        // this.props.navigation.navigate("today",{isFadeToday: true})
        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));

        this.props.navigation.popToTop();

    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setState({ isInstruction: false });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Wisdom"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <ChooseYourPathInit
                introTitle={(this.state.params.introTitle != undefined) && this.state.params.introTitle || ""}
                excerciseNumber = {this.state.exercise_number_choose}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {this.state.isLoaded}
                per={per}
            />
        )
    };

    onCompleteImgLoad = () =>{
        if(imgCounter >= 5){
            setTimeout(()=>{
                this.setState({isLoaded: true});
            },2000);
        }else{
            imgCounter = imgCounter+1;
        }
    };

    render(){
        const {container} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor="#FFF" isHidden={true}/>
                <View style={container}>
                    {
                        (this.state.pathCounter==1)
                            ?
                            <View style={{ flex:1,}}>
                                <ChoosePathImage onImagePress={this._onGoodImagePressed}
                                                 imageURL={"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+((this.state.exercise_number_choose*3)-2).toString()+".jpg"}
                                                 isGood={true}
                                                 isLayer={this.state.goodLayer}/>

                                <ChoosePathImage onImagePress={this._onBadImagePressed}
                                                 imageURL={"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-"+this.state.pathCounter+".jpg"}
                                                 isGood={false}
                                                 isLayer={this.state.badLayer}/>
                            </View>
                            :
                            (this.state.pathCounter==2)?
                                <View style={{ flex:1,}}>
                                    <ChoosePathImage onImagePress={this._onBadImagePressed}
                                                     imageURL={"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-"+this.state.pathCounter+".jpg"}
                                                     isGood={false}
                                                     isLayer={this.state.badLayer}
                                    />
                                    <ChoosePathImage onImagePress={this._onGoodImagePressed}
                                                     imageURL={"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+((this.state.exercise_number_choose*3)-1)+".jpg"}
                                                     isGood={true}
                                                     isLayer={this.state.goodLayer}
                                    />
                                </View>
                                :
                                (this.state.pathCounter==3)?
                                    <View style={{ flex:1,}}>

                                        <ChoosePathImage onImagePress={this._onGoodImagePressed}
                                                         imageURL={"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+(this.state.exercise_number_choose*3)+".jpg"}
                                                         isGood={true}
                                                         isLayer={this.state.goodLayer}
                                        />

                                        <ChoosePathImage onImagePress={this._onBadImagePressed}
                                                         imageURL={"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-"+this.state.pathCounter+".jpg"}
                                                         isGood={false}
                                                         isLayer={this.state.badLayer}
                                        />
                                    </View>
                                    :
                                    null
                    }

                    {(this.state.isInstruction) ?
                        <View style={{flex:1, left:0, right:0, top:0, bottom:0, position:'absolute'}}>
                            <Image source={{uri:"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+((this.state.exercise_number_choose*3)-2).toString()+".jpg"}}
                                   style={{height:100,width:100, opacity:0}}
                                   onLoadEnd={()=>this.onCompleteImgLoad()}/>
                            <Image source={{uri:"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+((this.state.exercise_number_choose*3)-1)+".jpg"}}
                                   style={{height:100,width:100, opacity:0}}
                                   onLoadEnd={()=>this.onCompleteImgLoad()}/>
                            <Image source={{uri:"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/good-image-"+(this.state.exercise_number_choose*3)+".jpg"}}
                                   style={{height:100,width:100, opacity:0}}
                                   onLoadEnd={()=>this.onCompleteImgLoad()}/>
                            <Image source={{uri:"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-1.jpg"}}
                                   style={{height:100,width:100, opacity:0}}
                                   onLoadEnd={()=>this.onCompleteImgLoad()}/>
                            <Image source={{uri:"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-2.jpg"}}
                                   style={{height:100,width:100, opacity:0}}
                                   onLoadEnd={()=>this.onCompleteImgLoad()}/>
                            <Image source={{uri:"https://s3.amazonaws.com/brainbuddyhostingapp/Choices/bad-choice-3.jpg"}}
                                   style={{height:100,width:100, opacity:0}}
                                   onLoadEnd={()=>this.onCompleteImgLoad()}/>
                            {this.renderInitComponent()}
                        </View>
                        : null }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(49,165,159)"//Constant.backProgressBarColor,
    },
});

const mapStateToProps = state => {
    return {
        exercise_number_choose: state.metaData.metaData.exercise_number_choose || 1,
        rewiringProgress: state.metaData.rewiringProgress,
        morningRoutine: state.metaData.morningRoutine,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(chooseYourPathActivity);