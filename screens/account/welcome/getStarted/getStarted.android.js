import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableHighlight,
    Animated,
    AsyncStorage,
    Modal,
    Alert,
    NativeModules,
    TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';
import Constant from '../../../../helper/constant';
import GetStartedRow from '../components/getStarted/getStartedRow';
import * as Animatable from 'react-native-animatable';
import NavigationTitleBar from '../../../commonComponent/navTitleBar';
import TermsAndCondition from './termsAndConditions/termsAndConditions';
import Spinner from '../../../commonComponent/initialScreen';
import {setSubscriptionInProcess} from '../../../../actions/userActions';
import AppStatusBar from '../../../commonComponent/statusBar';
import InAppBilling from 'react-native-billing';
import {NavigationActions, StackActions} from "react-navigation";

const Data = [
    {
        image : {uri: 'unlock_screenshot_1'},
        title:'Conquer Yourself',
        description: 'Know yourself to conquer yourself. Track your progress and see your brain, ' +
        'body and life get better everyday.',
        imgStyle: {height:162,width:238, marginTop: 30}
    },
    {
        image : {uri: 'unlock_screenshot_2'},
        title:'Your Daily Checkup',
        description: 'Your daily checkup helps Brainbuddy learn your moods, habits and' +
        ' temptations so you reboot fast, effectively and permanently.',
        imgStyle: {height:162,width:166, marginTop: 30}
    },
    {
        image : {uri: 'unlock_screenshot_3'},
        title:'A New Mission Every Day',
        description: 'Each day you receive a new activity card. Every activity you complete' +
        ' rewires your brain to seek out healthy sources of dopamine instead of unsatisfying porn.',
        imgStyle: {height:155,width:116, marginTop: 30}
    },
    {
        image : {uri: 'unlock_screenshot_4'},
        title:'Get Better. Forever.',
        description: 'As you recover, Brainbuddy will prescribe tailored exercises ' +
        'to help eliminate addiction pathways, freeing you from porn cravings. Permanently.',
        imgStyle: {height:136,width:192, marginTop: 30}
    },
    {
        image : {uri: 'unlock_screenshot_5'},
        title:'Level Up Your Life',
        description: 'Rebooting has immense pyschological and physical ' +
        'benefits. Brainbuddy unlocks achievements as your brain, body and life get better.',
        imgStyle: {height:162,width:240, marginTop: 30}
    },
];

class GetStarted extends Component {

    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY(0,0);
        Animated.timing(this.position, {
            toValue: {x:0, y: Constant.fullScreenHeight+200}, duration:0
        }).start();
        this.state = {
            opacity: new Animated.Value(0),
            modalVisible: false,
            isBtnClikable: true,
            statusBarColor: "rgb(239,151,23)",
            tmp:"",
            priceText:"",
            isRestore: false
        };
    }

    componentWillMount() {
        if(this.props.navigation.state.params && this.props.navigation.state.params.isRestore){
            this.setState({
                isRestore: true
            });
        }
        InAppBilling.close().then(()=>{
            InAppBilling.open().then(()=>{
                InAppBilling.getSubscriptionDetails('brainbuddy_subscribe_monthly').then(res=>{
                    try{
                        if(res.priceText){
                            let priceText = "(Then "+ res.priceText +"/month)";
                            this.setState({
                                priceText: priceText
                            })
                        }
                    }catch(e) {
                        console.log("Product Not found")
                    }
                }).catch(err=>{
                    console.log("Product Not found - catch");
                });
            }).catch((e)=>{
                // alert("--Catch --open ")
            });
        }).catch((e)=>{
            //  alert("--Catch --close ")
        });
    }

    componentDidMount() {
        AsyncStorage.setItem("isIntroScreenDone",'true');
        if(this.refs.mainView){
            this.refs.mainView.fadeIn(300);
        }
        Animated.timing(this.position, {
            toValue: {x:0, y:Constant.fullScreenHeight-144}, duration:500
        }).start();
        setTimeout(() => {
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 1,
                    duration: 700
                }
            ).start();
        }, 500);
        this.setBtnClickable(true);
    }

    checkSubscribe() {
        let text = "";
        InAppBilling.close().then(()=>{
            // text = text + "-- " + "then close() "
            // this.setState({
            //     tmp: text
            // })
            InAppBilling.open().then(()=>{
                // text = text + "-- " + "then open() "
                // this.setState({
                //     tmp: text
                // })
                InAppBilling.loadOwnedPurchasesFromGoogle().then(()=>{
                    // text = text + "-- " + "then loadOwnedPurchasesFromGoogle() "
                    // this.setState({
                    //     tmp: text
                    // });
                    InAppBilling.listOwnedSubscriptions().then((subDetail)=>{
                        // text = text + "-- " + "then listOwnedSubscriptions() => " + JSON.stringify(subDetail)
                        // this.setState({
                        //     tmp: text
                        // });
                        InAppBilling.isSubscribed('brainbuddy_subscribe_monthly').then((isSubscribed)=>{
                            // text = text + "-- " + "then---isSubscribed" + isSubscribed + "";
                            // this.setState({
                            //     tmp: text
                            // });
                            if(isSubscribed){
                                //  alert("Already subscribed")
                                InAppBilling.getSubscriptionTransactionDetails('brainbuddy_subscribe_monthly')
                                    .then((details) => {
                                        // text = text + "\n\n-- " + "then---getSubscriptionTransactionDetails" + JSON.stringify(details) + "---end====\n" +
                                        //     details.purchaseState;
                                        // this.setState({
                                        //     tmp: text
                                        // })
                                        if(details.purchaseState != undefined && details.purchaseState == "PurchasedSuccessfully") {
                                            this.purchaseSuccessfull();
                                        }else{
                                            //expired
                                            return InAppBilling.subscribe('brainbuddy_subscribe_monthly').then((detail)=>{
                                                // text = text + "-- " + "then---subscribe" + JSON.stringify(detail);
                                                // this.setState({
                                                //     tmp: text
                                                // });

                                                // alert("----expired---" + JSON.stringify(detail));

                                                if(detail.purchaseState != undefined && detail.purchaseState == "PurchasedSuccessfully"){
                                                    this.purchaseSuccessfull();
                                                }
                                                // alert(detail.purchaseState + "new purchase")
                                            }).catch((e)=>{
                                                // alert("--Catch --subscribe ")
                                            })
                                        }
                                    }).catch((e)=>{
                                    // alert("----Catch getSubscriptionTransactionDetails");
                                });
                            }else{
                                return InAppBilling.subscribe('brainbuddy_subscribe_monthly').then((detail)=>{
                                    // text = text + "-- " + "then---subscribe" + JSON.stringify(detail);
                                    // this.setState({
                                    //     tmp: text
                                    // });
                                    // alert("----expired---" + JSON.stringify(detail));

                                    if(detail.purchaseState != undefined && detail.purchaseState == "PurchasedSuccessfully"){
                                        this.purchaseSuccessfull();
                                    }
                                    // alert(detail.purchaseState + "new purchase")
                                }).catch((e)=>{
                                    // alert("--Catch --subscribe ")
                                })
                            }
                        }).catch((e)=>{
                            //alert("--Catch --isSubscribed ")
                        })

                    }).catch((e)=>{
                        // alert("--Catch --listOwnedSubscriptions ")
                    })
                }).catch((e)=>{
                    //alert("--Catch --loadOwnedPurchasesFromGoogle ")
                })
            }).catch((e)=>{
                // alert("--Catch --open ")
            });
        }).catch((e)=>{
            //  alert("--Catch --close ")
        });
    }


    onStartPress = () => {
        this.checkSubscribe();
    };

    purchaseSuccessfull = () => {
        try{
            if(this.props.navigation.state.params.nextPage == "rootTabNavigation") {
                // this.props.navigation.navigate("rootTabNavigation",{transition: "myCustomTransition"});
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: "rootTabNavigation",
                        params: {transition: "myCustomTransition"}})],
                }))
            }else{
                this.props.navigation.navigate(this.props.navigation.state.params.nextPage,{transition: "fadeIn"});
            }
        }catch (e) {
            // this.props.navigation.navigate("rootTabNavigation",{transition: "myCustomTransition"});
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: "rootTabNavigation",
                    params: {transition: "myCustomTransition"}})],
            }))
        }
    };

    setBtnClickable = (flag) => {
        this.setState({
            isBtnClikable: flag
        });
    };

    onCloseBtnPress = () => {
        this.setState({
            modalVisible: false,
            statusBarColor: "rgb(239,151,23)"
        });
    };

    onShowTerm = () => {
        this.setState({
            modalVisible: true,
            statusBarColor: Constant.backProgressBarColor
        });
    };

    render() {
        const {container, imgTop, viewTop, topText,
            imgShield, bottomVWBack, bottomText, bottomText2,
            bottomText3, btnMain} = styles;
        return (
            <Animatable.View style={[container]} ref="mainView">

                <View style={{paddingBottom:0,flex:1}}>
                    <AppStatusBar backColor={this.state.statusBarColor}/>
                    <NavigationTitleBar
                        title="Get started"
                        backColor="rgb(239,151,23)"/>
                    <ScrollView style={{flex:1}}>
                        <View>
                            <View style={{height:110, marginBottom: 15}}>
                                <Image source={{uri:'unlock_image_sky'}}
                                       style={imgTop}
                                       resizeMode={"stretch"}/>
                                <View style={[imgTop, viewTop]}>
                                    <Text style={topText}>
                                        {"Become the best version of \n yourself."}
                                    </Text>
                                </View>
                            </View>
                            <Image source={{uri:'unlock_shield'}}
                                   style={imgShield}
                                   resizeMode={"stretch"}/>
                            {
                                Data.map((obj)=>{
                                    return <GetStartedRow
                                        image={obj.image}
                                        title={obj.title}
                                        description={obj.description}
                                        key={obj.title}
                                        imgStyle={obj.imgStyle}
                                    />
                                })
                            }
                        </View>
                        <View>
                            <View>
                                <Text style={bottomText}>
                                    {"Become Healthier. Stronger. Happier. "}
                                </Text>
                                <Text style={bottomText2} onPress={()=> this.onShowTerm()}>
                                    Subscription terms and conditions
                                </Text>
                            </View>
                            <View style={{height: 150, width: '100%'}}/>
                        </View>
                    </ScrollView>

                    <Animated.View style={[bottomVWBack,this.position.getLayout(),{height: 144}]}>

                        <TouchableOpacity onPress={()=>this.onStartPress()}
                                          style={[styles.btnLogin,{backgroundColor: 'rgb(119,226,108)'}]}>
                            <View>
                                <Text style={[styles.btnFont, {color: "#FFF",fontSize:19, fontFamily: Constant.font700,  alignSelf:'center'}]}>
                                    {"Start 7 day free trial"}
                                </Text>
                                <Text style={[styles.btnFont, {color: "#FFF",fontSize:12, fontFamily: Constant.font500, alignSelf:'center',paddingTop:2}]}>
                                    {this.state.priceText}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {
                            (this.state.isRestore) &&
                            <View style={{alignItems:'center',paddingTop: 8,paddingBottom: 10,}}>
                                <Text style={{color:'white',fontSize: 13,
                                    fontFamily: Constant.font700,backgroundColor: 'transparent', textAlign:'center'}}>
                                    {"Already subscribed?"}
                                </Text>
                                <Text style={{color:'white',fontSize: 13,
                                    fontFamily: Constant.font700,backgroundColor: 'transparent',
                                    textDecorationLine:'underline'}} onPress={()=>this.onStartPress()}>
                                    {"Restore existing subscription."}
                                </Text>
                            </View>
                            ||
                            <View style={{alignItems:'center',paddingTop: 8,paddingBottom: 10,}}>
                                <Text style={{color:'white',fontSize: 12,fontFamily: Constant.font700,backgroundColor: 'transparent',lineHeight:18}}>
                                    {"Your purchase will appear as 'GOOGLE*APPSTUDIO'."}
                                </Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{color:'white',fontSize: 12,fontFamily: Constant.font700,
                                        backgroundColor: 'transparent', lineHeight:18}}>
                                        {"Recurring billing, cancel any time. "}
                                    </Text>
                                    <Text style={{color:'white',fontSize: 12,fontFamily: Constant.font700,
                                        backgroundColor: 'transparent',lineHeight:18,
                                        textDecorationLine:'underline'}} onPress={()=>this.onShowTerm()}>
                                        {"Trial terms "}
                                    </Text>
                                </View>
                            </View>
                        }

                    </Animated.View>
                    <Animated.View style={{position: 'absolute', right:0,left:0, bottom:110,
                        height:40, opacity: this.state.opacity}}>
                        <Image source={{uri:'unlock_special_bubble'}}
                               style={{width:242, height:40, alignSelf:'center'}}
                               resizeMode={"stretch"}/>
                    </Animated.View>

                    <Modal animationType="slide"
                           transparent={false}
                           visible={this.state.modalVisible}
                           onRequestClose={this.onCloseBtnPress}>
                        <TermsAndCondition onClosePress={this.onCloseBtnPress}/>
                    </Modal>
                    {
                        (!this.state.isBtnClikable) &&
                        <Spinner visible={true}
                                 backColor="rgba(0,0,0,0.4)"/> || null
                    }
                </View>
            </Animatable.View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fbb043'
    },
    imgTop: {
        top:0,
        left:0,
        width:Constant.screenWidth,
        height:110,
        position:'absolute'
    },
    viewTop:{
        justifyContent:'center',
        alignItems:'center'
    },
    topText:{
        color:'white',
        textAlign:'center',
        fontSize: 16,
        fontFamily: Constant.font700,
        backgroundColor: 'transparent'
    },
    imgShield: {
        width:25,
        top: 94,
        height:28,
        position:'absolute',
        alignSelf:'center'
    },
    bottomVWBack: {
        backgroundColor: 'rgb(239,151,23)',
        bottom:0,
        left: 0,
        right: 0,
        position: 'absolute',
        paddingTop:10
    },
    bottomText: {
        color:'white',
        textAlign:'center',
        fontSize: 16,
        fontFamily: Constant.font700,
        paddingBottom: 10,
        paddingTop: 24,
        backgroundColor: 'transparent'
    },
    bottomText2: {
        color:'white',
        textAlign:'center',
        fontSize: 11,
        fontFamily: Constant.font500,
        paddingBottom: 10
    },
    bottomText3: {
        color:'white',
        textAlign:'center',
        fontSize: 12,
        fontFamily: Constant.font700,
        paddingTop: 11,
        paddingBottom: 10,
        lineHeight:18,
        backgroundColor: 'transparent'
    },
    btnMain: {
        borderWidth: 1,
        borderColor:'#fff',
        height: 56,
        width: '80%',
        marginTop: 3
    },
    btnLogin:{
        marginLeft: 30,
        marginRight: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        // padding:17,
        borderRadius: 35,
        // paddingTop: 22,
        // paddingBottom: 22,
        borderWidth: 1,
        borderColor:'#fff',
        height: 56,
        width: '80%',
        marginTop: 3
    },
    btnFont:{
        fontSize: 15,
        fontFamily: Constant.font500,
    }
});

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, {
    setSubscriptionInProcess
})(GetStarted);

//https://i.diawi.com/jSMzMS