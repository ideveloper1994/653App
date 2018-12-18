import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Modal
} from 'react-native';
import Constant from '../../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import Button from '../../../commonComponent/button';
import SymptomsDetail from '../symptoms/symptomsDetail';
import { connect } from 'react-redux';
import AppStatusBar from '../../../commonComponent/statusBar';

class Result extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            counter:0,
            timer:null,
            timerBack:null,
            r:1,
            g:83,
            b:109,
            isDesShown:false,
            isShowAverageLbl:false,
            isShowYouLbl:false,
            bottomView:false,
            modalVisible: false,
            backColor: '#01536d',
            description:(props.navigation.state.params.resultNumber>70) ?
                "Your brain is highly addicted to internet porn" : (props.navigation.state.params.resultNumber>50) ?
                    "Your brain is addicted to internet porn" : "Your brain is mildly addicted to internet porn"
        };
        this.percentView = new Animated.ValueXY(0,0);
        this.height_Avg = new Animated.Value(0);
        this.height_You = new Animated.Value(0);
    }

    componentWillMount(){
        Animated.timing(this.percentView, {
            toValue: {x:0, y: Constant.screenHeight*0.42-8}, duration:0
        }).start();
    }

    componentDidMount(){
        this.refs.mainView.fadeIn(400);
        setTimeout(() => {
            let timer = setInterval(() => {
                if(this.state.counter < this.props.navigation.state.params.resultNumber) {
                    this.setState({counter: this.state.counter + 1});
                }else {
                    clearInterval(this.state.timer)
                }
            },50);
            this.setState({timer:timer});
        },1000);
        setTimeout(() => {
            this.onStartBackgroundChange();
        }, 2000);
    }

    onStartBackgroundChange = () => {
        let counter=0;
        let timerBack= setInterval(() => {
            if(counter <50)
            {
                this.setState({r:this.state.r+4.7,g:this.state.g-0.48,b:this.state.b-1.36});
                counter++;
            }else{
                clearInterval(this.state.timerBack);
                setTimeout(()=>{
                    this.showDescriptionText()
                },500);
            }
        },50);
        this.setState({timerBack:timerBack});
    };

    showDescriptionText = () => {
        this.setState({isDesShown:true});
        this.refs.description.fadeIn(1000);
        setTimeout(() => {
            this.percentageSlideUp();
        }, 2000);
    };

    percentageSlideUp = () => {
        Animated.timing(this.percentView, {
            toValue: {x:0, y: Constant.screenHeight*17.7/100-8}, duration:600
        }).start();
        setTimeout(() => {
            this.showAverageAnimation();
        },1000);
    };

    showAverageAnimation = () => {
        Animated.timing(this.height_Avg, {
            toValue: 30,
            duration:900
        }).start();
        setTimeout(()=>{
            this.setState({isShowAverageLbl:true});
            this.showYouAnimation();
        },1200)
    };

    showYouAnimation = () => {
        Animated.timing(this.height_You, {
            toValue: this.props.navigation.state.params.resultNumber,
            duration:900
        }).start();
        setTimeout(()=>{
            this.setState({isShowYouLbl:true});
            this.showBottomText();
        },900)
    };

    showBottomText = () => {
        setTimeout(()=>{
            this.setState({bottomView:true});
        },900)
    };

    onSymptomsPress = () => {
        //this.props.navigator.replace(Router.getRoute("symptoms"));
        this.props.navigation.navigate("symptoms");

    };

    onCriteriaPress = (flag) => {
        //this.props.navigator.push(Router.getRoute("symptomsDetail"));
        //this.props.navigation.navigate("symptomsDetail");
        this.setState({modalVisible: flag});
    };


    render() {
        let str = 'rgb('+this.state.r+','+this.state.g+','+this.state.b+")";
        return (
            <View style={{flex:1, backgroundColor: '#01536d'}}>
                <AppStatusBar backColor={str}/>
                <Animatable.View style={[styles.container,
                {top:0, left:0, right:0, bottom:0, position: 'absolute', backgroundColor:str}]} ref="mainView">
                    <View style={{flex:1}}>
                        <Animated.View style={[{left: 0, right: 0,
                         top:Constant.screenHeight*42/100, bottom: 0, position: 'absolute'},
                        this.percentView.getLayout()]}>
                            <Text style={styles.titleText}>
                                {(this.state.counter==0)?"":this.state.counter+'%'}
                            </Text>

                            <Animatable.View style={{paddingTop:16}} ref="description">
                                <View style={{ width: "70%", alignItems: 'center', alignSelf: 'center'}}>
                                    {(this.state.isDesShown)?
                                        <Text style={styles.descriptionText}>{this.state.description}</Text>
                                        : <View/>
                                    }
                                </View>
                            </Animatable.View>
                        </Animated.View>

                        <View style={{width:228,height:120,justifyContent:'flex-end', alignSelf: 'center',
                         top:Constant.screenHeight*0.6-120, bottom: 0, position: 'absolute'}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
                                <View style={{justifyContent:'flex-end'}}>
                                    {(this.state.isShowAverageLbl) ?
                                        <Animatable.View ref="lblAvg" animation="fadeIn" duration={600}>
                                            <Text style={{paddingBottom:10,textAlign:'center',color:'#FFF'}}>Average</Text>
                                        </Animatable.View>
                                        : <View/>
                                    }
                                    <Animated.View style={{backgroundColor:'rgba(256,256,256,0.1)',
                                    height:this.height_Avg,width:100}}/>

                                </View>
                                <View style={{justifyContent:'flex-end'}}>
                                    {(this.state.isShowYouLbl) ?
                                        <Animatable.View ref="lblYou"
                                                         animation="fadeIn"
                                                         duration={600}>
                                            <Text style={{paddingBottom:10,textAlign:'center',color:'#FFF'}}>You</Text>
                                        </Animatable.View>
                                        : <View/>
                                    }
                                    <Animated.View style={{backgroundColor:'rgba(256,256,256,0.4)',height:this.height_You,width:100}}/>
                                </View>
                            </View>
                        </View>


                    </View>

                    {(this.state.bottomView)?
                        <Animatable.View animation="fadeIn"
                                         duration={300}
                                         style={{position:'absolute', bottom:0,left:0,right:0,top: 0, backgroundColor: 'transparent'}}>
                            <Text style={styles.descriptionTextBottom}>
                                Dopamine baseline 68% above standard average
                            </Text>

                            <View style={{bottom:0,left:0,right:0,top: 0, paddingTop:Constant.screenHeight*0.8}}>
                                <Button title="Symptoms"
                                        backColor="#FFF"
                                        color="rgb(236,59,41)"
                                        otherStyle={{marginTop:0, height:60}}
                                        otherTextStyle={{fontSize:16, fontFamily: Constant.font700}}
                                        onPress={this.onSymptomsPress}/>
                            </View>
                            <Text onPress={() => this.onCriteriaPress(true)}
                                  style={{color:'#f59d94',textAlign:'center',fontSize: 13,
                                  fontFamily: Constant.font500,position:'absolute',
                                         bottom:0,left:0,right:0,top: Constant.screenHeight*0.93}}>
                                Assessment Criteria
                            </Text>
                        </Animatable.View>
                        :<View/>
                    }
                </Animatable.View>
                <View style={{position:'absolute',
                top:Constant.screenHeight*0.057-3,left:0,
                right:0,alignItems:'center'}}>
                    <Text style={{color:'white',textAlign:'center',fontSize: 16, backgroundColor: 'transparent',
                        fontFamily: Constant.font500,}}>Test Results</Text>
                </View>

                <Modal animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}>
                    <SymptomsDetail safeAreaInsetsData={this.props.safeAreaInsetsData} onClosePress={this.onCriteriaPress}/>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    titleText:{
        fontSize: 50,
        fontFamily: Constant.font300,
        color:'#FFF',
        textAlign: 'center',
    },
    descriptionText:{
        fontSize: 16,
        fontFamily: Constant.font500,
        color:'#FFF',
        alignSelf:'center',
        textAlign:'center',
    },
    descriptionTextBottom:{
        fontSize: 16,
        fontFamily: Constant.font500,
        color:'#fdebea',
        alignSelf:'center',
        textAlign:'center',
        bottom:0,
        width: "70%",
        top: Constant.screenHeight*0.65-5,
        position: 'absolute',
        lineHeight: 21,
        padding:0
    }

});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {

})(Result);