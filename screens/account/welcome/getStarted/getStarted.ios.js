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
    TouchableOpacity,
    Linking
} from 'react-native';
import {connect} from 'react-redux';
import Constant from '../../../../helper/constant';
import GetStartedRow from '../components/getStarted/getStartedRow';
import * as Animatable from 'react-native-animatable';
import NavigationTitleBar from '../../../commonComponent/navTitleBar';
import TermsAndCondition from './termsAndConditions/termsAndConditions';
import { loadMonthlyAllProduct,loadAllProducts,loadYearlyAllProduct,canMakePayment,restoreAllData,
    checkForValidation,purchaseApp } from '../../../../helper/inAppPurchase';
import Spinner from '../../../commonComponent/initialScreen';
import {setSubscriptionInProcess} from '../../../../actions/userActions';
import {NavigationActions, StackActions} from "react-navigation";
import SpecialSubscription from '../../../commonComponent/specialSubscription';
import BtnSubscribe from '../../../commonComponent/btnSubscribe';

const rowData = [
    {
        image : {uri: 'unlock_screenshot_1'},
        title:'Conquer Yourself',
        description: 'Know yourself to conquer yourself. Track your progress and see your brain, ' +
        'body and life get better everyday. ',
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

    constructor(props){
        super(props);
        this.position = new Animated.ValueXY(0,0);
        Animated.timing(this.position, {
            toValue: {x:0, y: Constant.screenHeight+200}, duration:0
        }).start();
        this.state = {
            opacity: new Animated.Value(0),
            modalVisible: false,
            isBtnClikable: true,
            priceText: "",
            priceString: "",
            showSubscription: true,
            modelSpecialPrice: false,
            monthlyPriceText: "",
            isRestore: false
        };
    }

    componentDidMount() {
        AsyncStorage.setItem("isIntroScreenDone",'true');
        this.refs.mainView.fadeIn(400);
        Animated.timing(this.position, {
            toValue: {x:0, y:Constant.screenHeight-(124+this.props.safeAreaInsetsData.bottom)}, duration:500
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
        /*
         let allData = [ { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367152079',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 08:07:32 Etc/GMT',
         purchase_date_ms: '1516176452000',
         purchase_date_pst: '2018-01-17 00:07:32 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 08:10:32 Etc/GMT',
         expires_date_ms: '1516176632000',
         expires_date_pst: '2018-01-17 00:10:32 America/Los_Angeles',
         web_order_line_item_id: '1000000037501637',
         is_trial_period: 'true',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367152991',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 08:10:32 Etc/GMT',
         purchase_date_ms: '1516176632000',
         purchase_date_pst: '2018-01-17 00:10:32 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 08:15:32 Etc/GMT',
         expires_date_ms: '1516176932000',
         expires_date_pst: '2018-01-17 00:15:32 America/Los_Angeles',
         web_order_line_item_id: '1000000037501638',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367154398',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 08:15:32 Etc/GMT',
         purchase_date_ms: '1516176932000',
         purchase_date_pst: '2018-01-17 00:15:32 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 08:20:32 Etc/GMT',
         expires_date_ms: '1516177232000',
         expires_date_pst: '2018-01-17 00:20:32 America/Los_Angeles',
         web_order_line_item_id: '1000000037501669',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367155902',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 08:20:32 Etc/GMT',
         purchase_date_ms: '1516177232000',
         purchase_date_pst: '2018-01-17 00:20:32 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 08:25:32 Etc/GMT',
         expires_date_ms: '1516177532000',
         expires_date_pst: '2018-01-17 00:25:32 America/Los_Angeles',
         web_order_line_item_id: '1000000037501719',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367157509',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 08:25:32 Etc/GMT',
         purchase_date_ms: '1516177532000',
         purchase_date_pst: '2018-01-17 00:25:32 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 08:30:32 Etc/GMT',
         expires_date_ms: '1516177832000',
         expires_date_pst: '2018-01-17 00:30:32 America/Los_Angeles',
         web_order_line_item_id: '1000000037501772',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367160113',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 08:30:32 Etc/GMT',
         purchase_date_ms: '1516177832000',
         purchase_date_pst: '2018-01-17 00:30:32 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 08:35:32 Etc/GMT',
         expires_date_ms: '1516178132000',
         expires_date_pst: '2018-01-17 00:35:32 America/Los_Angeles',
         web_order_line_item_id: '1000000037501843',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367252221',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 10:55:58 Etc/GMT',
         purchase_date_ms: '1516186558000',
         purchase_date_pst: '2018-01-17 02:55:58 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 11:00:58 Etc/GMT',
         expires_date_ms: '1516186858000',
         expires_date_pst: '2018-01-17 03:00:58 America/Los_Angeles',
         web_order_line_item_id: '1000000037501900',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367254505',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 11:00:58 Etc/GMT',
         purchase_date_ms: '1516186858000',
         purchase_date_pst: '2018-01-17 03:00:58 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 11:05:58 Etc/GMT',
         expires_date_ms: '1516187158000',
         expires_date_pst: '2018-01-17 03:05:58 America/Los_Angeles',
         web_order_line_item_id: '1000000037504697',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367255970',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 11:05:58 Etc/GMT',
         purchase_date_ms: '1516187158000',
         purchase_date_pst: '2018-01-17 03:05:58 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 11:10:58 Etc/GMT',
         expires_date_ms: '1516187458000',
         expires_date_pst: '2018-01-17 03:10:58 America/Los_Angeles',
         web_order_line_item_id: '1000000037504765',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367257258',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 11:10:58 Etc/GMT',
         purchase_date_ms: '1516187458000',
         purchase_date_pst: '2018-01-17 03:10:58 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 11:15:58 Etc/GMT',
         expires_date_ms: '1516187758000',
         expires_date_pst: '2018-01-17 03:15:58 America/Los_Angeles',
         web_order_line_item_id: '1000000037504876',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' },
         { quantity: '1',
         product_id: 'brainbuddy_monthly2',
         transaction_id: '1000000367258079',
         original_transaction_id: '1000000367152079',
         purchase_date: '2018-01-17 11:15:58 Etc/GMT',
         purchase_date_ms: '1516187758000',
         purchase_date_pst: '2018-01-17 03:15:58 America/Los_Angeles',
         original_purchase_date: '2018-01-17 08:07:35 Etc/GMT',
         original_purchase_date_ms: '1516176455000',
         original_purchase_date_pst: '2018-01-17 00:07:35 America/Los_Angeles',
         expires_date: '2018-01-17 11:20:58 Etc/GMT',
         expires_date_ms: '1516188058000',
         expires_date_pst: '2018-01-17 03:20:58 America/Los_Angeles',
         web_order_line_item_id: '1000000037504957',
         is_trial_period: 'false',
         is_in_intro_offer_period: 'false' } ];

         var obj =_.maxBy(allData, function(o) { return parseFloat(o.expires_date_ms); });
         debugger

         let todayDateStr = moment().format('YYYY-MM-DD HH:mm:ss').toString();
         let todayDateGetTime = moment(todayDateStr);
         let todayDate = new Date(todayDateGetTime);
         debugger
         // allData.map(inAPPData=>{
         //     debugger
         //     if(inAPPData.expires_date_ms){
         //         let dateExpMS = parseInt(inAPPData.expires_date_ms);
         //         let expiryDate = new Date(dateExpMS);
         //         console.log("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
         //         if (todayDate < expiryDate) {
         //             console.log("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
         //            // return Promise.resolve(true);
         //         }
         //     }
         // });
         */
//         let expDate = "2017-12-18 04:56:21";
//
//         let todayDate1 = "2017-12-21 04:22:21"
//
//         // if(expDate.length > 19) expDate = expDate.substring(0,19);
//
//         let expiryDate = moment(expDate).format('YYYY-MM-DD HH:mm:ss');
//
//         let todayDate = moment(todayDate1).format('YYYY-MM-DD HH:mm:ss');
//
//         // a.diff(b,'minutes')
//
//         // let d = expiryDate.diff(todayDate, 'minutes');
//         debugger
//         console.log('----db date---'+ expDate);
//         console.log('----today---'+ todayDate);
//         console.log('----exp---'+ expiryDate);
// debugger
//
//
//         // let momentTodayDate = moment(todayDate);
//         // let momentExpDate = moment(expiryDate);
//
// debugger
//         let momentTodayDate1 = new Date(todayDate);
//         let momentExpDate1 = new Date(expiryDate);
//
// debugger
//
//         if(momentTodayDate1 < momentExpDate1){
//             debugger
//         }else{
//             debugger
//         }
    }

    componentWillMount() {
        if(this.props.navigation.state.params && this.props.navigation.state.params.isRestore){
            this.setState({
                isRestore: true
            });
        }
        /*
       // Yearly subscription
        loadYearlyAllProduct().then(res=>{
            try{
                let price = res[0].price;
                //Need to show price in .99 format
                let displayPrice = Math.ceil(price/12);
                displayPrice = displayPrice-1;
                displayPrice = displayPrice + 0.99;
                if(res.length > 0){
                    // let priceText = "(Then "+ res[0].priceString +"/month)";
                    let priceText = "(Then "+ res[0].currencySymbol + displayPrice +"/month, billed yearly)";
                    this.setState({
                        priceText: priceText,
                        priceString: res[0].priceString
                    })
                }
            }catch(e) {
                console.log("Product Not found")
            }
        }).catch(err=>{
            console.log("Product Not found - catch")
        });
        */

        //mothly Price for special screen
        loadMonthlyAllProduct().then(res=>{
            try{
                if(res.length > 0){
                    let priceTextMonth = "(Then "+ res[0].priceString +"/month)";
                    this.setState({
                        monthlyPriceText: priceTextMonth,
                    })
                }
            }catch(e) {
                console.log("Product Not found")
            }
        }).catch(err=>{
            console.log("Product Not found - catch")
        });

    }

    onStartPress = (productKey = "brainbuddy_monthly2") => {
        if(this.state.isBtnClikable){
            console.log('--------------this state is btnclicked in ---------');
            this.setBtnClickable(false);
            loadAllProducts().then(res=>{
                console.log('--------------load all products ---------');
                canMakePayment().then(res=>{
                    console.log('--------------can make payment ---------');
                    restoreAllData()
                        .then(res => {
                            console.log('--------------restore All Data ---------');
                            checkForValidation()
                                .then(res=>{
                                    // alert("valid")
                                    console.log('--------------Check For Validation---------');
                                    // alert("still subscribe")
                                    this.setBtnClickable(true);
                                    this.purchaseSuccessfull();

                                    // alert("success - full")

                                    //continue to next page
                                }).catch(err=>{
                                if(err === "Expired" || err === "latest_receipt_info_not_found"){
                                    purchaseApp(productKey)
                                        .then(res => {
                                            //navigate to next page
                                            // alert("purchase success")
                                            this.purchaseSuccessfull();
                                        })
                                        .catch(err => {
                                            //Cancel By User
                                            this.onSpecialSubscription();
                                            this.setBtnClickable(true);
                                            // Alert.alert("Subscription failed, please try again");
                                        })
                                }else{
                                    this.setBtnClickable(true);
                                    Alert.alert("Failed to get receipt details, please try again.")
                                }
                                // alert("expired")
                                //expired
                            })
                        })
                        .catch(err => {
                            // alert("purchase ------")
                            if(err === "receipt_not_found"){
                                purchaseApp(productKey)
                                    .then(res => {
                                        // alert("purchase success-----")
                                        this.purchaseSuccessfull();
                                    })
                                    .catch(err => {
                                        //Cancel By User
                                        this.onSpecialSubscription();
                                        // alert("purchase failed------")
                                        this.setBtnClickable(true);
                                        // Alert.alert("Subscription failed, please try again");
                                    })
                            }else{
                                this.setBtnClickable(true);
                            }
                        })
                }).catch(err=>{
                    this.setBtnClickable(true);
                    Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
                })
            }).catch(err=>{
                this.setBtnClickable(true);
                // Alert.alert("Failed to get subscription details, please check your internet connection.");
                // Alert.alert("Subscription failed, please try again");
            })
        }
    };

    purchaseSuccessfull = () => {
        try{
            if(this.props.navigation.state.params.nextPage === "rootTabNavigation"){
                // this.props.navigation.navigate("rootTabNavigation",{transition: "myCustomTransition"});
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: "rootTabNavigation",
                        params: {transition: "myCustomTransition"}})],
                }))
            }else{
                this.props.navigation.navigate(this.props.navigation.state.params.nextPage,{transition: "fadeIn"});
            }
        }catch (e){
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: "rootTabNavigation",
                    params: {transition: "myCustomTransition"}})],
            }))
            // this.props.navigation.navigate("rootTabNavigation",{transition: "myCustomTransition"});
        }
    };

    setBtnClickable = (flag) => {
        this.setState({
            isBtnClikable: flag
        });
    };

    onCloseBtnPress = () => {
        this.setState({
            modelSpecialPrice:false,
            modalVisible: false
        });
        this.setBtnClickable(true);
    };

    onShowTerm = () => {
        this.setState({
            modalVisible: true
        });
    };

    onSpecialSubscription = () => {
        this.setState({
            modelSpecialPrice: true
        });
        this.setBtnClickable(true);
    };

    onSubscription = () => {
        let flag = !this.state.showSubscription;
        this.setState({
            showSubscription: flag
        },()=>{
            setTimeout(()=>{
                if(this.refs.mainScrollView){
                    this.refs.mainScrollView.scrollToEnd({animated: flag});
                }
            },100)
        });
    };

    render() {
        const {container, imgTop, viewTop, topText,
            imgShield, bottomVWBack, bottomText, bottomText2,
            bottomText3, btnMain} = styles;
        return (
            <Animatable.View style={[container]} ref="mainView">
                <View style={{paddingBottom:this.props.safeAreaInsetsData.bottom,flex:1}}>
                    <NavigationTitleBar
                        title="Get started"
                        backColor="rgb(239,151,23)"/>

                    <ScrollView style={{flex:1, height:Constant.screenHeight}} ref="mainScrollView">
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
                               style={imgShield}/>
                        {
                            rowData.map((obj,i)=>{
                                return <GetStartedRow
                                    index={i}
                                    image={obj.image}
                                    title={obj.title}
                                    description={obj.description}
                                    key={i+""}
                                    imgStyle={obj.imgStyle}
                                />
                            })
                        }
                        <Text style={bottomText}>
                            {"Become Healthier. Stronger. Happier. "}
                        </Text>
                        <View style={{alignSelf: 'center',alignItems: 'center',justifyContent: 'center',borderRadius: 14,
                            backgroundColor: 'rgb(239,151,23)', paddingLeft:15, paddingRight:15, height: 28, marginTop:5}}>
                            <Text style={{fontSize: 12,fontFamily: Constant.font700, color: '#FFF', backgroundColor: "transparent"}}>
                                {"Subscription terms & conditions"}
                            </Text>
                        </View>
                        {
                            (this.state.showSubscription) &&
                            <View style={{marginBottom:20, marginTop: 14}}>
                                <Text style={{ color:'white',
                                    textAlign:'center',
                                    fontSize: 9,
                                    fontFamily: Constant.font500,
                                    backgroundColor: 'transparent',
                                    marginRight: 20,
                                    marginLeft: 20,
                                    lineHeight: 12}}>
                                    {
                                        "This subscription includes a 7 day free trial. The subscription will automatically " +
                                        "renew unless auto-renew is turned off at least 24 hours before the end of the " +
                                        "current period. You can go to your iTunes Account settings to manage your " +
                                        "subscription and turn off auto- renew. Your iTunes Account will be charged " +
                                        "when the purchase is confirmed."
                                    }
                                </Text>

                                <View style={{flexDirection:'row', alignSelf:'center', marginTop: 14}}>
                                    <Text style={{color:'#21526a',fontSize: 10,fontFamily: Constant.font500,backgroundColor: 'transparent'}}
                                          onPress={()=>{
                                              Linking.openURL("http://brainbuddyapp.com/terms")
                                                  .catch(err => {});}}>
                                        {"Terms & Conditions"}
                                    </Text>
                                    <Text style={{marginLeft: 12,color:'#21526a',fontSize: 10,fontFamily: Constant.font500,
                                        backgroundColor: 'transparent'}} onPress={()=>{
                                        Linking.openURL("http://brainbuddyapp.com/privacy-policy")
                                            .catch(err => {});}}>
                                        {"Privacy Policy"}
                                    </Text>
                                </View>

                            </View>
                            || null
                        }
                        <View style={{height: 170, width: '100%'}}/>
                    </ScrollView>

                    <Animated.View style={[bottomVWBack,this.position.getLayout(),
                        {height: 124+this.props.safeAreaInsetsData.bottom}]}>
                        <BtnSubscribe onShowTerm={this.onShowTerm}
                                      priceText={this.state.monthlyPriceText} //this.state.priceText - for yearly
                                      onStartPress={this.onStartPress}
                                      productKey={"brainbuddy_monthly2"}  //brainbuddy_yearly3
                                      backColor={'rgb(119,226,108)'}
                                      isRestore={this.state.isRestore}
                                      onRestorePress={this.onStartPress}
                        />

                    </Animated.View>
                    <Animated.View style={{position: 'absolute', right:0,left:0,
                        bottom:114+this.props.safeAreaInsetsData.bottom,
                        height:40, opacity: this.state.opacity}}>
                        <Image source={{uri:'unlock_special_bubble'}}
                               style={{width:242, height:40, alignSelf:'center'}}
                               resizeMode={"stretch"}/>
                    </Animated.View>

                    <Modal animationType="slide"
                           transparent={false}
                           visible={this.state.modalVisible}>
                        <TermsAndCondition onClosePress={this.onCloseBtnPress}
                                           safeAreaInsetsData={this.props.safeAreaInsetsData}/>
                    </Modal>

                    <Modal animationType="slide"
                           transparent={false}
                           visible={this.state.modelSpecialPrice}>
                        <SpecialSubscription onClosePress={this.onCloseBtnPress}
                                             onStartPress={this.onStartPress}
                                             isBtnClikable={this.state.isBtnClikable}
                                             priceText={this.state.monthlyPriceText}
                                             safeAreaInsetsData={this.props.safeAreaInsetsData}/>
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
        borderRadius: 35,
        borderWidth: 1,
        borderColor:'#fff',
        height: 56,
        width: '80%',
        marginTop: 3,
        maxWidth: 300
    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsDefault,
    };
};

export default connect(mapStateToProps, {
    setSubscriptionInProcess
})(GetStarted);