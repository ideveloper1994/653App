import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
    BackHandler,
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import { updateMetaData } from '../../../../actions/metadataActions';
import DidYouKnowInit from './didYouKnowInit';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import Button from './../../../commonComponent/button';
import {callTodayScreenEcentListner} from "../../../../helper/appHelper";
import AppStatusBar from '../../../commonComponent/statusBar';

let activityImage=[
    'did_you_know_1',
    'did_you_know_1',
    'did_you_know_2',
    'did_you_know_3',
    'did_you_know_4',
    'did_you_know_5',
    'did_you_know_6',
    'did_you_know_7',
    'did_you_know_8',
    'did_you_know_9',
    'did_you_know_10',
    'did_you_know_11',
    'did_you_know_12',
    'did_you_know_13',
    'did_you_know_14',
    'did_you_know_15',
];

class DidYouKnow extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            isInstruction: true,
            isLoaded: false,
            params: props.navigation.state.params,
            exercise_number_learn: props.exercise_number_learn,
        };
        this.offset = new Animated.Value(Constant.screenHeight);
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        let exeNo = this.props.exercise_number_learn;
        if(this.props.navigation.state.params.isReplay){
            if(exeNo > 1){
                exeNo -= 1;
            }
            this.setState({
                exercise_number_learn: exeNo
            });
        }
        callTodayScreenEcentListner(false);
    }

    componentWillUnmount(){
        callTodayScreenEcentListner();
        // this.props.didUKnowExerciseIncrement(this.props.exercise_didUKnow_count, true);
    }

    handleBackPress = () => {
        this.onCloseButtonPress();
        return true;
    };

    onBtnDonePress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        if(this.state.params.isReplay){
            this.state.params.makeFadeInAnimation();
            this.props.navigation.goBack();
        }else{
            this.state.params.onCompleteExercises(this.state.params.pageName);
            let activityNo = this.props.exercise_number_learn;
            // activityNo = (activityNo >= 15) ? 1 : ++activityNo;
            activityNo += 1;
            this.props.updateMetaData({ exercise_number_learn: activityNo }, this.state.params.improve || []);
            if(this.state.params.isOptional){
                this.props.navigation.navigate("completeOptionalActivity",
                    {title: "Knowledge exercise complete", data: ["Wisdom"]});
            }else{
                if(this.state.params.isLast){
                    this.props.navigation.navigate("completeMorningRoutine");
                }else{
                    this.state.params.makeFadeInAnimation();
                    this.props.navigation.goBack();
                }
            }
        }
    };

    //Instruction Page
    onCloseButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.state.params.makeFadeInAnimation();
        this.props.navigation.goBack();
    };

    onActivityButtonPress = () => {
        this.state.params.scrollToTopToday();
        this.setState({ isInstruction: false },()=>{
            // Animated.timing(this.offset, {
            //     duration: 200,
            //     easing: Easing.bezier(0.39, 0.575, 0.565, 1.2),
            //     toValue: 0,
            //     delay: 100,
            //     useNativeDriver: true
            // }).start();
            Animated.timing(this.offset, {
                duration: 400,
                easing: Easing.out(Easing.quad),
                toValue: 0,
                delay: 100,
                useNativeDriver: true
            }).start();
        });
    };

    renderInitComponent = () => {
        let per = "4%";
        let obj = _.find(this.props.rewiringProgress,{key: "Wisdom"});
        if(obj != undefined){
            per = obj.progressPer
        }
        return(
            <DidYouKnowInit
                excerciseNumber = {this.state.exercise_number_learn}
                onCloseButtonPress = {this.onCloseButtonPress}
                onActivityButtonPress = {this.onActivityButtonPress}
                isClickable = {true}
                per={per}
            />
        )
    };


    render() {
        const {container, animatedView,containerView,imgStyle,txtHeader,txtDidKnow,txtDetail,btnStyle,
            absoluteView, textSubTitle, outerPopUp} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(90,194,188)'/>
                <View style={animatedView}>
                    <Animated.View style={[outerPopUp,{transform: [{translateY: this.offset}]}]} >
                        <TouchableOpacity style={absoluteView}
                                          onPress={()=>this.onCloseButtonPress()}>
                            <Text style={textSubTitle}>Cancel</Text>
                        </TouchableOpacity>

                        <View style={containerView}>
                            <Image resizeMode={'contain'}
                                   source={{uri:activityImage[this.state.exercise_number_learn]}}
                                   style={imgStyle}/>

                            <Text style={txtDidKnow}>
                                DID YOU KNOW
                            </Text>
                            <Text style={txtHeader}>
                                {this.getTitleText(this.state.exercise_number_learn)}
                            </Text>
                            <Text style={txtDetail}>
                                {this.getDetailText(this.state.exercise_number_learn)}
                            </Text>
                            <Button title="Activity complete"
                                    backColor="rgb(90,194,188)"
                                    color="#FFF"
                                    otherStyle={btnStyle}
                                    otherTextStyle={{fontFamily: Constant.font700,fontSize:15}}
                                    onPress={this.onBtnDonePress}/>
                        </View>
                    </Animated.View>

                    {(this.state.isInstruction) ?
                        this.renderInitComponent()
                        : null }
                </View>
            </View>
        );
    }

    getTitleText = (number) => {
        switch (number){
            case 1:
                return "Porn is a drug";

            case 2:
                return "Porn changes the brain";

            case 3:
                return "Porn is addictive";

            case 4:
                return "Porn affects your behaviour";

            case 5:
                return "Porn use escalates";

            case 6:
                return "Porn kills love";

            case 7:
                return "Porn is a lie";

            case 8:
                return "Porn ruins your sex life";

            case 9:
                return "Porn hurts your partner";

            case 10:
                return "Porn leaves you lonely";

            case 11:
                return "Porn's dirty little secret";

            case 12:
                return "Porn can lead to violence";

            case 13:
                return "Porn warps sex";

            case 14:
                return "Porn hurts families";

            case 15:
                return "A modern problem";
            default:
                return "Null";
        }
    };

    getDetailText = (number) => {
        switch (number){
            case 1:
                return "On the surface, cocaine and pornography don't seem to have much in common. But studies are showing that " +
                    "regularly using porn tricks the brain intro releasing similar pleasure chemicals that physical drugs do."+
                    "\n\nWhat's more, the brain actively begins to rewire itself to crave this artificial stimulation.";

            case 2:
                return "Neurons that fire together, wire together. Just like other addictive substances, porn floods the brain with dopamine." +
                    "\n\nThis overflow of chemicals rewires the brain’s reward pathway, ultimately changing the makeup of the viewer’s brain." +
                    " This results in an ever-increasing appetite for porn.";

            case 3:
                return "Not long ago, doctors and researchers believed that in order for something to be addictive, it had to involve an " +
                    "outside substance that you physically put into your body, like cigarettes, alcohol or drugs."
                    +"\n\nWith the rise of internet pornography, they now know this may not be the case.";

            case 4:
                return "Many porn users report becoming aroused by things that used to disgust them or that go against what they " +
                    "believe to be morally right."+
                    "\n\nAnd once they start viewing perverse and extreme sex acts, these porn users are being taught that such" +
                    " behaviours are normal or more common that they actually are.";

            case 5:
                return "Because of pornography’s addictive nature, in order to retain a similar level of pleasure," +
                    " users often find themselves requiring an ever-increasing amount of porn." +
                    "\n\nThe material that they seek out also evolves. Over time, their increasing dependency pushes " +
                    "them to require more perverse and hardcore forms of porn to feel pleasure.";

            case 6:
                return "Real love requires a real person. Research has found that after exposure to pornography," +
                    " men rate themselves less in love with their partner than men who didn't view porn." +
                    "\n\nA further study found that after being exposed to pornographic images, subjects were more " +
                    "critical of their partner’s appearance, sexual curiosity, sexual performance, and displays of affection.";

            case 7:
                return "In porn, everything from the way people look, to how and why they have sex is artificial."+
                    "\n\nPorn users become so obsessed with chasing a perfection that isn't attainable that they often miss" +
                    " out on the possibility of real relationships.";

            case 8:
                return "In relationships, frequent porn use by one partner not only leads to less sex, but less satisfying sex."+
                    "\n\nAnd, in some relationships, heavy porn use often leads to no sex at all.";

            case 9:
                return "Several studies have found that partners of porn users often report feeling loss, betrayal, mistrust," +
                    " devastation and anger when they learn that the other half of their committed relationship has been using porn."+
                    "\n\nMany have reported symptoms of anxiety and depression.";

            case 10:
                return "The more pornography a person consumes, the harder it becomes for them to be aroused by a real person."+
                    "\n\nAs a result, many porn users start to feel like something is wrong with them. They don't know how to be " +
                    "turned on by a real person, much less form a deep personal connection with someone.";

            case 11:
                return "For viewers, pornography can appear to be a fantasy world of pleasure and thrills."+
                    "\n\nFor those working in the porn industry however, their experiences are often filled " +
                    "with drugs, disease, slavery, trafficking, rape, and abuse.";

            case 12:
                return "A few years ago, a team of researchers randomly picked 50 porn films and analyzed them."+
                    "\n\nOf the 304 scenes, 88% contained physical violence and 49% contained verbal abuse.";

            case 13:
                return "Today, many teenagers are getting their sexual education from porn."+
                    "\n\nResearchers have found that people who are exposed to a significant amount of pornography" +
                    " are more likely to start having sex earlier and with more partners, and to also engage in riskier sex acts, increasing their" +
                    " risk of receiving sexually transmitted diseases.";

            case 14:
                return "Research shows that marriages in which one person has a porn problem results in less intimacy and sensitivity," +
                    " as well as more anxiety, secrecy, isolation and dysfunction."+
                    "\n\nAnd as porn users are more likely to lose their jobs as a result of their addiction, " +
                    "these relationships may also experience less financial security.";

            case 15:
                return "Sceptics of porn addiction often point out that pornography has been around for hundreds of years."+
                    "\n\nYet the immediate, instant gratification provided by modern high-speed internet porn is resulting in " +
                    "an epidemic that is only just starting to become understood.-";
            default:
                return "Null";
        }
    };

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(49,165,159)"
    },animatedView : {
        flex:1,
        backgroundColor: "rgb(90,194,188)",
        justifyContent:'center',
        alignItems:'center'
    },containerView:{
        backgroundColor: '#FFF',
        width:'90%',
        maxWidth:340,
        borderRadius:10,
        alignItems:'center'
    },txtDidKnow:{
        fontSize:12,
        fontFamily: Constant.font700,
        color:'#b8b8b8',
        marginBottom:16
    },txtHeader: {
        fontSize:15,
        fontFamily:Constant.font700,
        color: '#3b3b3b',
        marginBottom:16
    },txtDetail:{
        fontSize: (Constant.screenWidth < 360) && 12 || 14,
        color:'#585858',
        textAlign: 'center',
        lineHeight: 21,
        backgroundColor:'white',
        fontFamily: Constant.font500,
        textAlign:'center',
        width:'90%',
        marginBottom:28,
    },imgStyle:{
        height:112,
        width:112,
        marginTop:28,
        marginBottom:25
    },btnStyle:{
        marginBottom:28,
        height:60,
        width:250,
        marginTop:0,
        marginLeft: 0,
        marginRight: 0
    },
    absoluteView:{
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        top: Constant.screenHeight*0.94
    },
    textSubTitle: {
        fontSize:13,
        color:'rgba(255,255,255,0.7)',
        fontFamily: Constant.font500,
    },
    outerPopUp:{
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'transparent', alignItems:'center', justifyContent:'center'
    },
});
const mapStateToProps = state => {
    return {
        exercise_number_learn: state.metaData.metaData.exercise_number_learn || 1,
        rewiringProgress: state.metaData.rewiringProgress,
    };
};

export default connect(mapStateToProps, {
    updateMetaData
})(DidYouKnow);