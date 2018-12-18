import React, { Component } from 'react';
import {Alert, NativeModules,AsyncStorage} from 'react-native';
// import RNFS from 'react-native-fs';
import Constant from './constant';
import { EventRegister } from 'react-native-event-listeners'
import moment from "moment";

let AndroidNativeModule = NativeModules.AndroidNativeModule;
export function isValidPhoneNo(phoneNo) {
    const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return phoneNumberPattern.test(phoneNo);
}

export function isValidEmail(email) {
    const format = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return format.test(email);
}

export function isEmpty(text) {
    return (text.toString().trim().length > 0 && text.toString().trim() != "0");
}

// export function showNoInternetAlert(isLightTheme=false) {
//     if(Constant.isANDROID){
//         showThemeAlert({title:"No internet connection",
//             message: "Check your connection and try again.",
//             leftBtn: "OK",isLightTheme: isLightTheme});
//     }else{
//         Alert.alert("No internet connection",
//             "Check your connection and try again.",
//             [
//                 {text: 'OK', onPress: () => {}},
//             ],
//             { cancelable: false }
//         )
//     }
// }


let isAlertShown = false;

onLeftPressError = (e) => {
    isAlertShown = false;
}

export function showAPICallError(objAlert) {
    if(!isAlertShown){
        isAlertShown = true;
        if(Constant.isANDROID){
            showThemeAlert({title:objAlert.title,
                message: objAlert.message,
                leftBtn: objAlert.leftBtn,isLightTheme: false, leftPress: onLeftPressError});
        }else{
            Alert.alert(objAlert.title,
                objAlert.message,
                [
                    {text: objAlert.leftBtn, onPress: () => {isAlertShown = false;}},
                ],
                { cancelable: false }
            )
        }
    }
}

export function showNoInternetAlert(isLightTheme=false) {
    if(!isAlertShown){
        isAlertShown = true;
        if(Constant.isANDROID){
            showThemeAlert({title:"No wireless connection",
                message: "Connect to Wi-Fi or cellular to access data.",
                leftBtn: "OK",isLightTheme: isLightTheme});
        }else{
            Alert.alert("No wireless connection",
                "Connect to Wi-Fi or cellular to access data.",
                [
                    {text: 'OK', onPress: () => {isAlertShown = false;}},
                ],
                { cancelable: false }
            )
        }
    }
}

export function showServerNotReachable(isLightTheme=false) {
    if(!isAlertShown){
        isAlertShown = true;
        if(Constant.isANDROID){
            showThemeAlert({title:"Internet unreachable",
                message: "Please check your internet connection and try again.",
                leftBtn: "OK",isLightTheme: isLightTheme});
        }else{
            Alert.alert("Internet unreachable",
                "Please check your internet connection and try again.",
                [
                    {text: 'OK', onPress: () => {isAlertShown = false;}},
                ],
                { cancelable: false }
            )
        }
    }
}


export function backendNotReachable(isLightTheme=false) {
    if(!isAlertShown){
        isAlertShown = true;
        if(Constant.isANDROID){
            showThemeAlert({title:"Uh oh",
                message: "There is an issue contacting the server. Please try again in a little while. (Error request timeout)",
                leftBtn: "OK",isLightTheme: isLightTheme});
        }else{
            Alert.alert("Uh oh",
                "There is an issue contacting the server. Please try again in a little while. (Error request timeout)",
                [
                    {text: 'OK', onPress: () => {isAlertShown = false;}},
                ],
                { cancelable: false }
            )
        }
    }
}

export function showCustomAlert(title, alertText, btnTitle, isLightTheme=false) {
    if(Constant.isANDROID){
        showThemeAlert({title:title,
            message: alertText,
            leftBtn: btnTitle,isLightTheme: isLightTheme});
    }else{
        Alert.alert(title,
            alertText,
            [
                {text: btnTitle, onPress: () => {}},
            ],
            { cancelable: false })
    }
}

export  function callTodayScreenEcentListner(flagIsToday = true) {
    EventRegister.emit('isTodayEventListener', flagIsToday);
}

onLeftBtnPress = (res) => {
    console.log("not Handle");
};

onRightBtnPress = (res) => {
    console.log("not Handle");
};

export function showThemeAlert(objAlert) {
    let defaultAlertObj = {
        title: "",
        message: "",
        leftBtn: "",
        rightBtn: "",
        isLightTheme: false,
        leftPress: onLeftBtnPress,
        rightPress: onRightBtnPress,
        styleLeft: 'default',
        styleRight: 'default',
    };
    Object.assign(defaultAlertObj, objAlert);
    if(Constant.isANDROID){
        AndroidNativeModule.showThemeAlert(defaultAlertObj.title,
            defaultAlertObj.message, defaultAlertObj.leftBtn, defaultAlertObj.rightBtn,
            defaultAlertObj.isLightTheme,
            defaultAlertObj.leftPress,
            defaultAlertObj.rightPress);
    }else{
        Alert.alert(defaultAlertObj.title,
            defaultAlertObj.message,
            [
                {text: defaultAlertObj.leftBtn, onPress: defaultAlertObj.leftPress,
                    style: defaultAlertObj.styleLeft},
                {text: defaultAlertObj.rightBtn, onPress: defaultAlertObj.rightPress,
                    style: defaultAlertObj.styleRight},
            ],
        );
    }
}

// export const downloadImageFromURL = (imageUrl, exNo) => {
//     let dirs = '';
//     if (Constant.isIOS) {
//         dirs = RNFS.DocumentDirectoryPath
//     } else {
//         dirs = RNFS.ExternalDirectoryPath
//     }
//     return RNFS.mkdir(dirs+'/AppData/ThoughtControl').then((res) => {
//         let background = true;
//         const fileName = "thoughtControl-"+ exNo + ".png";
//         const downloadDest = `${dirs}/AppData/ThoughtControl/${fileName}`;
//         const ret = RNFS.downloadFile({ fromUrl: imageUrl, toFile: downloadDest});
//         return ret.promise.then(res => {
//             console.log('download then:::',downloadDest);
//             return Promise.resolve(downloadDest);
//         }).catch(err => {
//             return Promise.reject(downloadDest);
//         });
//     }).catch((err) => {
//         console.log("error creting path for introduction audio");
//         return Promise.reject(downloadDest);
//     })
// };

export function resetAllAsyncStorageData() {
    AsyncStorage.getAllKeys((err,keys)=>{
        keys.forEach(key=>{
            AsyncStorage.getItem(key).then((err,res)=>{
            })
            AsyncStorage.removeItem(key);
        })
        AsyncStorage.setItem('isNewOpen',"true");
    });
}

export function getAvatar(imageId, gender = "male") {
    let avatarId = imageId;
    if(!imageId){
        avatarId = 0;
    }
    switch (avatarId) {
        case 0:
            if(gender.includes("female")){
                return 'avatar_lge_46';
            }
            return 'avatar_lge_1';
            break;
        case 2:
            return 'avatar_lge_2';
            break;
        case 3:
            return 'avatar_lge_3';
            break;
        case 4:
            return 'avatar_lge_4';
            break;
        case 5:
            return 'avatar_lge_5';
            break;
        case 6:
            return 'avatar_lge_6';
            break;
        case 7:
            return 'avatar_lge_7';
            break;
        case 8:
            return 'avatar_lge_8';
            break;
        case 9:
            return 'avatar_lge_9';
            break;
        case 10:
            return 'avatar_lge_10';
            break;
        case 11:
            return 'avatar_lge_11';
            break;
        case 12:
            return 'avatar_lge_12';
            break;
        case 13:
            return 'avatar_lge_13';
            break;
        case 14:
            return 'avatar_lge_14';
            break;
        case 15:
            return 'avatar_lge_15';
            break;
        case 16:
            return 'avatar_lge_16';
            break;
        case 17:
            return 'avatar_lge_17';
            break;
        case 18:
            return 'avatar_lge_18';
            break;
        case 19:
            return 'avatar_lge_19';
            break;
        case 20:
            return 'avatar_lge_20';
            break;
        case 21:
            return 'avatar_lge_21';
            break;
        case 22:
            return 'avatar_lge_22';
            break;
        case 23:
            return 'avatar_lge_23';
            break;
        case 24:
            return 'avatar_lge_24';
            break;
        case 25:
            return 'avatar_lge_25';
            break;
        case 26:
            return 'avatar_lge_26';
            break;
        case 27:
            return 'avatar_lge_27';
            break;
        case 28:
            return 'avatar_lge_28';
            break;
        case 29:
            return 'avatar_lge_29';
            break;
        case 30:
            return 'avatar_lge_30';
            break;
        case 31:
            return 'avatar_lge_31';
            break;
        case 32:
            return 'avatar_lge_32';
            break;
        case 33:
            return 'avatar_lge_33';
            break;
        case 34:
            return 'avatar_lge_34';
            break;
        case 35:
            return 'avatar_lge_35';
            break;
        case 36:
            return 'avatar_lge_36';
            break;
        case 37:
            return 'avatar_lge_37';
            break;
        case 38:
            return 'avatar_lge_38';
            break;
        case 39:
            return 'avatar_lge_39';
            break;
        case 40:
            return 'avatar_lge_40';
            break;
        case 41:
            return 'avatar_lge_41';
            break;
        case 42:
            return 'avatar_lge_42';
            break;
        case 43:
            return 'avatar_lge_43';
            break;
        case 44:
            return 'avatar_lge_44';
            break;
        case 45:
            return 'avatar_lge_45';
            break;
        case 46:
            return 'avatar_lge_46';
            break;
        case 47:
            return 'avatar_lge_47';
            break;
        case 48:
            return 'avatar_lge_48';
            break;
        case 49:
            return 'avatar_lge_49';
            break;
        case 50:
            return 'avatar_lge_50';
            break;
        case 51:
            return 'avatar_lge_51';
            break;
        case 52:
            return 'avatar_lge_52';
            break;
        case 53:
            return 'avatar_lge_53';
            break;
        case 54:
            return 'avatar_lge_54';
            break;
        case 55:
            return 'avatar_lge_55';
            break;
        case 56:
            return 'avatar_lge_56';
            break;
        case 57:
            return 'avatar_lge_57';
            break;
        case 58:
            return 'avatar_lge_58';
            break;
        case 59:
            return 'avatar_lge_59';
            break;
        case 60:
            return 'avatar_lge_60';
            break;
        case 61:
            return 'avatar_lge_61';
            break;
        case 62:
            return 'avatar_lge_62';
            break;
        case 63:
            return 'avatar_lge_63';
            break;
        case 64:
            return 'avatar_lge_64';
            break;
        case 65:
            return 'avatar_lge_65';
            break;
        case 66:
            return 'avatar_lge_66';
            break;
        case 67:
            return 'avatar_lge_67';
            break;
        case 68:
            return 'avatar_lge_68';
            break;
        case 69:
            return 'avatar_lge_69';
            break;
        case 70:
            return 'avatar_lge_70';
            break;
        case 71:
            return 'avatar_lge_71';
            break;
        case 72:
            return 'avatar_lge_72';
            break;
        case 73:
            return 'avatar_lge_73';
            break;
        case 74:
            return 'avatar_lge_74';
            break;
        case 75:
            return 'avatar_lge_75';
            break;
        case 76:
            return 'avatar_lge_76';
            break;
        case 77:
            return 'avatar_lge_77';
            break;
        case 78:
            return 'avatar_lge_78';
            break;
        case 79:
            return 'avatar_lge_79';
            break;
        case 80:
            return 'avatar_lge_80';
            break;
        case 81:
            return 'avatar_lge_81';
            break;
        case 82:
            return 'avatar_lge_82';
            break;
        case 83:
            return 'avatar_lge_83';
            break;
        case 84:
            return 'avatar_lge_84';
            break;
        case 85:
            return 'avatar_lge_85';
            break;
        case 86:
            return 'avatar_lge_86';
            break;
        case 87:
            return 'avatar_lge_87';
            break;
        case 88:
            return 'avatar_lge_88';
            break;
        case 89:
            return 'avatar_lge_89';
            break;
        case 90:
            return 'avatar_lge_90';
            break;
        default:
            if(gender.includes("female")){
                return 'avatar_lge_46';
            }
            return 'avatar_lge_1';
            break;
    }
}

export function getSmallAvatar(imageId, gender = "male") {
    let avatarId = imageId;
    if(!imageId){
        avatarId = 0;
    }
    switch (avatarId) {
        case 0:
            if(gender.includes("female")){
                return 'avatar_sml_46';
            }
            return 'avatar_sml_1';
            break;
        case 1:
            return 'avatar_sml_1';
            break;
        case 2:
            return 'avatar_sml_2';
            break;
        case 3:
            return 'avatar_sml_3';
            break;
        case 4:
            return 'avatar_sml_4';
            break;
        case 5:
            return 'avatar_sml_5';
            break;
        case 6:
            return 'avatar_sml_6';
            break;
        case 7:
            return 'avatar_sml_7';
            break;
        case 8:
            return 'avatar_sml_8';
            break;
        case 9:
            return 'avatar_sml_9';
            break;
        case 10:
            return 'avatar_sml_10';
            break;
        case 11:
            return 'avatar_sml_11';
            break;
        case 12:
            return 'avatar_sml_12';
            break;
        case 13:
            return 'avatar_sml_13';
            break;
        case 14:
            return 'avatar_sml_14';
            break;
        case 15:
            return 'avatar_sml_15';
            break;
        case 16:
            return 'avatar_sml_16';
            break;
        case 17:
            return 'avatar_sml_17';
            break;
        case 18:
            return 'avatar_sml_18';
            break;
        case 19:
            return 'avatar_sml_19';
            break;
        case 20:
            return 'avatar_sml_20';
            break;
        case 21:
            return 'avatar_sml_21';
            break;
        case 22:
            return 'avatar_sml_22';
            break;
        case 23:
            return 'avatar_sml_23';
            break;
        case 24:
            return 'avatar_sml_24';
            break;
        case 25:
            return 'avatar_sml_25';
            break;
        case 26:
            return 'avatar_sml_26';
            break;
        case 27:
            return 'avatar_sml_27';
            break;
        case 28:
            return 'avatar_sml_28';
            break;
        case 29:
            return 'avatar_sml_29';
            break;
        case 30:
            return 'avatar_sml_30';
            break;
        case 31:
            return 'avatar_sml_31';
            break;
        case 32:
            return 'avatar_sml_32';
            break;
        case 33:
            return 'avatar_sml_33';
            break;
        case 34:
            return 'avatar_sml_34';
            break;
        case 35:
            return 'avatar_sml_35';
            break;
        case 36:
            return 'avatar_sml_36';
            break;
        case 37:
            return 'avatar_sml_37';
            break;
        case 38:
            return 'avatar_sml_38';
            break;
        case 39:
            return 'avatar_sml_39';
            break;
        case 40:
            return 'avatar_sml_40';
            break;
        case 41:
            return 'avatar_sml_41';
            break;
        case 42:
            return 'avatar_sml_42';
            break;
        case 43:
            return 'avatar_sml_43';
            break;
        case 44:
            return 'avatar_sml_44';
            break;
        case 45:
            return 'avatar_sml_45';
            break;
        case 46:
            return 'avatar_sml_46';
            break;
        case 47:
            return 'avatar_sml_47';
            break;
        case 48:
            return 'avatar_sml_48';
            break;
        case 49:
            return 'avatar_sml_49';
            break;
        case 50:
            return 'avatar_sml_50';
            break;
        case 51:
            return 'avatar_sml_51';
            break;
        case 52:
            return 'avatar_sml_52';
            break;
        case 53:
            return 'avatar_sml_53';
            break;
        case 54:
            return 'avatar_sml_54';
            break;
        case 55:
            return 'avatar_sml_55';
            break;
        case 56:
            return 'avatar_sml_56';
            break;
        case 57:
            return 'avatar_sml_57';
            break;
        case 58:
            return 'avatar_sml_58';
            break;
        case 59:
            return 'avatar_sml_59';
            break;
        case 60:
            return 'avatar_sml_60';
            break;
        case 61:
            return 'avatar_sml_61';
            break;
        case 62:
            return 'avatar_sml_62';
            break;
        case 63:
            return 'avatar_sml_63';
            break;
        case 64:
            return 'avatar_sml_64';
            break;
        case 65:
            return 'avatar_sml_65';
            break;
        case 66:
            return 'avatar_sml_66';
            break;
        case 67:
            return 'avatar_sml_67';
            break;
        case 68:
            return 'avatar_sml_68';
            break;
        case 69:
            return 'avatar_sml_69';
            break;
        case 70:
            return 'avatar_sml_70';
            break;
        case 71:
            return 'avatar_sml_71';
            break;
        case 72:
            return 'avatar_sml_72';
            break;
        case 73:
            return 'avatar_sml_73';
            break;
        case 74:
            return 'avatar_sml_74';
            break;
        case 75:
            return 'avatar_sml_75';
            break;
        case 76:
            return 'avatar_sml_76';
            break;
        case 77:
            return 'avatar_sml_77';
            break;
        case 78:
            return 'avatar_sml_78';
            break;
        case 79:
            return 'avatar_sml_79';
            break;
        case 80:
            return 'avatar_sml_80';
            break;
        case 81:
            return 'avatar_sml_81';
            break;
        case 82:
            return 'avatar_sml_82';
            break;
        case 83:
            return 'avatar_sml_83';
            break;
        case 84:
            return 'avatar_sml_84';
            break;
        case 85:
            return 'avatar_sml_85';
            break;
        case 86:
            return 'avatar_sml_86';
            break;
        case 87:
            return 'avatar_sml_87';
            break;
        case 88:
            return 'avatar_sml_88';
            break;
        case 89:
            return 'avatar_sml_89';
            break;
        case 90:
            return 'avatar_sml_90';
            break;
        default:
            if(gender.includes("female")){
                return 'avatar_sml_46';
            }
            return 'avatar_sml_1';
            break;
    }
}

export function isReligious(comment) {
    let outputString = Constant.NO_RELIGIOUS;
    const religiousWord = ['corinthians', 'his grace', 'jesuit', 'psalms', 'holy spirit', 'leviticus', 'atonement', 'baptism', 'body of christ',
        'messiah', 'covenant', 'jerusalem', 'new testament', 'old testament', 'salvation', 'commandment', 'lord', 'prophet','zechariah',
        'malachi', 'haggai', 'zephaniah', 'habakkuk', 'nahum', 'micah', 'obadiah', 'hosea', 'ezekiel', 'lamentations', 'ecclesiastes',
        'proverbs', 'nehemiah', 'deuteronomy', 'exodus', 'genesis', 'galatians', 'ephesians', 'philippians', 'colossians', 'thesssaolnians',
        'philemon', 'psalm', 'qur’an', 'your lord', 'sinners', 'resurrection', 'abraham'];
    let isReligious = false;
    for (var i = 0; i < religiousWord.length; i++) {
        //if (comment.toLowerCase().includes(religiousWord[i])) {
        if(RegExp( '\\b' + religiousWord[i] + '\\b', 'i').test(comment)){
            outputString = Constant.RELIGIOUS;
            break;
        }
    }
    if(outputString == Constant.RELIGIOUS){
        return outputString;
    }
    const containTwoOfeach = ['he died', 'god', 'Jesus', 'christ', 'faith', 'heaven', 'bible', 'eternal', 'grace', 'hebrew', 'holy',
        'advent', 'amen', 'apostle', 'ascension', 'atone', 'christian', 'church', 'jehovah', 'judgement',
        'redemption', 'satan', 'sin', 'sins', 'righteous', 'chronicles', 'revelation','luke', 'matthew', 'john'];
    let wordCount = 0;
    for (var i = 0; i < containTwoOfeach.length; i++) {
        if(RegExp( '\\b' + containTwoOfeach[i] + '\\b', 'i').test(comment)){
            //if (comment.toLowerCase().includes(containTwoOfeach[i])) {
            wordCount += 1;
        }
        if(wordCount >= 2){
            outputString = Constant.RELIGIOUS;
            break;
        }
    }
    if(outputString == Constant.RELIGIOUS){
        return outputString;
    }
    if(wordCount == 1){
        outputString = Constant.ASK_RELIGIOUS_ALERT;
    }
    return outputString;
}

export function getTimeFromDate(date){
    let selectedDate = moment(date);
    let time = selectedDate.format('hh:mm');
    time = time + ((selectedDate.hour()) >= 12 ? ' PM' : ' AM');
    return time;
}

export function getTimeString(time){
    if(time == 0){
        return "12:00 PM";
    }
    let val = "";
    let hours = (time > 12) && (time - 12) || time;
    if(hours < 10){
        hours = "0" + hours;
    }
    val  = hours + ":00" + (time > 12 ? ' PM' : ' AM');
    return val
}

export function getCurrentMonth(monthIndex = null) {
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    let currentMonth = d.getMonth();
    if(monthIndex != null){
        currentMonth = monthIndex;
    }
    var n = month[currentMonth];
    return n;
}

export function getTimeFromMS(dateStrin) {
    let duration = moment().diff(moment(dateStrin),'milliseconds');
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24),
        days = parseInt(duration / (1000*60*60*24)),
        years = Math.floor(duration / 31536000000);

    if(days > 999){
        return years + "y";
    }else if(days > 1){
        return days + "d";
    }else if(hours != 0){
        return hours + "h";
    }else if(minutes != 0){
        return minutes + "m";
    }else {
        return seconds + "s";
    }
}

export function getSexualityTitle(userDetails) {

    if(userDetails.orientation == "bisexual"){
        return "More attention from others";
    }else if(userDetails.gender == "female" || userDetails.gender == "transgender_female"){
        if(userDetails.orientation === "heterosexual"){
            return "More attention from men";
        }
        return "More attention from women";
    }else if(userDetails.gender == "male" || userDetails.gender == "transgender_male"){
        if(userDetails.orientation == "homosexual"){
            return "More attention from men";
        }
        return "More attention from women";
    }
    return "More attention from women";

}