import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TextInput,
    Animated,
    Easing,
    TouchableHighlight,
    BackHandler
} from 'react-native';
import Constant from '../../../helper/constant';
import { connect } from 'react-redux';
import MorningRoutineRow from './morningRoutineRow';
import * as Animatable from 'react-native-animatable';
import {NavigationActions} from 'react-navigation';
import {callTodayScreenEcentListner} from "../../../helper/appHelper";
import AppStatusBar from '../../commonComponent/statusBar';

const ImprovementDetails = {
    Dopamine: {
        icon: {uri: 'icon_complete_dopamine_rewiring'},
        title: "Dopamine rewiring",
    },
    Hypofrontality: {
        icon: {uri: 'icon_complete_hypofrontality'},
        title: "Hypofrontality",
    },
    Stress: {
        icon: {uri: 'icon_complete_stress_control'},
        title: "Stress Control",
    },
    Wisdom: {
        icon: {uri: 'icon_complete_wisdom'},
        title: "Wisdom",
    },
    Faith: {
        icon: {uri: 'icon_complete_faith'},
        title: "Faith and spirituality",
    },
    Kegal: {
        icon: {uri: 'icon_complete_kegals'},
        title: "Erection quality",
    }
};

class CompleteOptionalActivity extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            showList: false,
            opacity:0
        };
        this.position = new Animated.ValueXY(0,0);
    }

    onCompleteRoute = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        // this.props.navigation.push("today",{isFadeToday: true});
        callTodayScreenEcentListner();
        this.props.navigation.popToTop();
        // this.props.navigation.dispatch(NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: "today", isFadeToday: true })
        //     ]
        // }));
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        Animated.timing(this.position, {
            toValue: {x:0, y:Constant.screenHeight*0.5-44}, duration:0
        }).start();
    }

    componentDidMount() {
        setTimeout(()=>{
            Animated.timing(this.position, {
                toValue: {x:0, y:Constant.screenHeight*0.157}, duration:400
            }).start(()=>{
                this.setState({
                    showList:true
                },()=>{
                    if(this.refs.listView){
                        this.refs.listView.fadeIn(800);
                    }
                });
            });
        },1500);
    }

    handleBackPress = () => {
        return true;
    };

    render() {
        return (
            <View style={styles.container}>
                <AppStatusBar backColor="#37a4a0"/>
                <Animatable.View style={{top:0, left:0, right:0, bottom:0,backgroundColor: '#37a4a0',
                    position: 'absolute', alignItems: 'center'}} duration={400} delay={100}
                                 animation="fadeIn"/>

                <Animated.View style={[{height:Constant.screenHeight, width:Constant.screenWidth, alignItems: 'center'},this.position.getLayout()]}>

                    <Animatable.View style={{top:0, left:0, right:0, bottom:0,backgroundColor: Constant.transparent,
                        position: 'absolute', alignItems: 'center'}} duration={400} delay={100}
                                     animation="fadeIn">

                    <Animatable.Image source={{uri:'complete_large_tick_icon'}}
                                          style={styles.mainIcon}
                                          easing="ease-out-back"
                                          useNativeDriver={true}
                                          animation="zoomIn" duration={400} delay={500}
                                          resizeMode={"contain"}/>
                        <Animatable.Text style={styles.titleText}
                                         useNativeDriver={true}
                                         animation="fadeIn" duration={300} delay={(Constant.isIOS) && 100 || 200}>
                            {this.props.navigation.state.params.title}
                        </Animatable.Text>
                    </Animatable.View>
                </Animated.View>

                <Animatable.View style={{top:0, left:0, right:0, bottom:0, position: 'absolute', alignItems: 'center'}}
                                 animation="fadeIn" duration={300} delay={1500}>
                    {
                        (this.state.showList) &&
                        <Animatable.View style={{top:Constant.screenHeight*0.46-5, left:0, right:0, bottom:0,
                            position: 'absolute', alignItems: 'center'}}
                                         useNativeDriver={true}
                                         ref="listView">
                            <Text style={styles.improveText}>
                                IMPROVEMENTS
                            </Text>
                            {
                                this.props.navigation.state.params.data.map((newObj, i) => {
                                    return (
                                        <MorningRoutineRow icon={ImprovementDetails[newObj].icon}
                                                           key={i}
                                                           title={ImprovementDetails[newObj].title}/>
                                    )
                                })
                            }
                        </Animatable.View>
                        ||null
                    }


                    <TouchableHighlight onPress={()=> this.onCompleteRoute()}
                                        underlayColor={Constant.transparent}>
                        <View style={{flex:1, width:Constant.screenWidth, paddingTop:Constant.screenHeight*0.92-10}}>
                            <Text style={styles.txtBottom}>
                                TAP TO CONTINUE
                            </Text>
                        </View>
                    </TouchableHighlight>

                </Animatable.View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#37a4a0',//'rgb(90,194,189)',
        alignItems: 'center'
    },
    mainIcon: {
        height: 88,
        width: 88,
        // marginTop: Constant.screenHeight*0.157
    },
    titleText:{
        fontSize: 20,
        color: '#FFF',
        fontFamily: Constant.font300,
        marginTop:25,
        backgroundColor: 'transparent',
    },
    improveText:{
        fontSize: 12,
        color: '#b9e2e0',
        fontFamily: Constant.font700,
        marginBottom:25,
        backgroundColor: 'transparent',
    },
    textTotal:{
        fontSize: 36,
        color: '#FFF',
        fontFamily: Constant.font700,
    },
    textTotalPorn:{
        fontSize: 36,
        color: '#FFF',
        fontFamily: Constant.font700,
    },
    txtBottom:{
        fontSize: 12,
        color: '#b9e2e0',
        textAlign: 'center',
        fontFamily: Constant.font700,
        padding: 10
    },
});


const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, {
})(CompleteOptionalActivity);