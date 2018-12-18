import React, { Component } from 'react';
import {
    Alert,
    NativeModules
} from 'react-native';
const { InAppUtils } = NativeModules;
import moment from 'moment';
import iapReceiptValidator from 'iap-receipt-validator';
const password = 'f83c13a862c6492e8e89fde8471642cc'; // Shared Secret from iTunes connect
const production = true; // use sandbox or production url for validation
const validateReceipt = iapReceiptValidator(password, production);
import _ from 'lodash';

export const loadMonthlyAllProduct = () => {
    let products = [
        'brainbuddy_monthly2'
    ];
    //console.log("--loadAllProducts-----");
    return new Promise((resolve,reject)=>{
        return InAppUtils.loadProducts(products, (error, products) => {
            //console.log("***||Productss",products);
            if(error){
                console.log("loadMonthlyAllProduct-> Error");
                return reject("Fail to load products, try again");
            }else{
                console.log("loadMonthlyAllProduct-> response");
                return resolve(products);
            }
        });
    })
};
export const loadYearlyAllProduct = () => {
    let products = [
        'brainbuddy_yearly3'
    ];
    //console.log("--loadAllProducts-----");
    return new Promise((resolve,reject)=>{
        return InAppUtils.loadProducts(products, (error, products) => {
            //console.log("***||Productss",products);
            if(error){
                console.log("loadMonthlyAllProduct-> Error");
                return reject("Fail to load products, try again");
            }else{
                console.log("loadMonthlyAllProduct-> response");
                return resolve(products);
            }
        });
    })
};

export const loadAllProducts = () => {
    let products = [
        'brainbuddy_weekly',
        'brainbuddy_monthly2',
        'brainbuddy_quarterly',
        'brainbuddy_half_yearly',
        'brainbuddy_yearly3'
    ];
    //console.log("--loadAllProducts-----");
    return new Promise((resolve,reject)=>{
        return InAppUtils.loadProducts(products, (error, products) => {
            console.log("***||Productss",products);
            if(error){
                console.log("loadAllProducts-> Error");
                return reject("Fail to load products, try again");
            }else{
                console.log("loadAllProducts-> response");
                return resolve(products);
            }
        });
    })
};

export const canMakePayment = () => {
    //console.log("--can make payment-----");
    return new Promise((resolve,reject)=>{
        return InAppUtils.canMakePayments((enabled) => {
            if(enabled) {
                console.log("canMakePayment-> enable");
                return resolve(true);
                // return restoreAllData();
            } else {
                //          console.log("canMakePayment-> disable");

                console.log('--------------canMakePayment---------');

                return reject("not able to make payment");


            }
        });
    })
};

export const purchaseApp = (productKey="brainbuddy_monthly2") => {
    //console.log("------purchaseApp-----");
    // let productIdentifier = 'brainbuddy_monthly2';
    // let productIdentifier = 'brainbuddy_yearly3';
    let productIdentifier = productKey;
    return new Promise((resolve,reject)=> {
        return InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
            if (response && response.productIdentifier) {
                console.log("------purchaseApp-----> success");
                // //Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
                // //unlock store here.
                return resolve(true);
            }
            if (error) {
                //Cancel subscription
                console.log('--------------Catch Purchase---------' + error);
                return reject(false);
                // Alert.alert("Subscription fail, Please try again");
                console.log("------purchaseApp-----> Error");
                // Alert.alert("error" + error);
                // console.log("***||error", error)
            }
        });
    })
};

export const restoreAllData = () => {
    return new Promise((resolve,reject)=>{
        return InAppUtils.restorePurchases((error, response) => {
            if(error) {
                console.log('--------------restoreAllData---------err' + error);
                return reject("Faild")
            } else {
                if (response.length === 0) {
                    console.log('--------------restoreAllData 0 ---------');
                    return reject("receipt_not_found")
                }else {
                    console.log('--------------in else block  restoreAllData---------');
                    return resolve(true)
                }
            }

        });
    })
};

export const checkForValidation = () => {
    return new Promise((resolve,reject)=>{
        return InAppUtils.receiptData((error, receiptDatas)=> {
            if(error){
                // Alert.alert("failed to get")
                console.log('-------------then-checkForValidation error ---------');
                console.log('------------Failed to get receipt Data, please try again---------');
                return reject("Failed");
            }
            // console.log("***||reciptData",receiptDatas);
            // if(receiptDatas || receiptDatas != undefined){
            return validate(receiptDatas).then(res=>{
                console.log('-------------then-checkForValidation ---------');
                return resolve(true);
            }).catch(err=>{
                console.log('-------------catch-checkForValidation ---------' + err);
                return reject(err);  //Expired or receipt_not_found
            });
            // }else{
            //     console.log('--------------in else block  checkForValidation---------');
            //     return reject(false);
            // }
        });
    });
};

const validate = async (receiptData) => {
    try {
        const validationData = await validateReceipt(receiptData);
        // check if Auto-Renewable Subscription is still valid
        // return Promise.resolve(true);

        if(validationData['latest_receipt_info'].length > 0){
            let allData = validationData['latest_receipt_info'];
            console.log("==========allData===========")
            console.log(allData);

            let obj =_.maxBy(allData, function(o) { return parseFloat(o.expires_date_ms); });
            console.log("=====================")
            console.log(obj);
            if(obj.expires_date_ms){
                console.log(obj.expires_date_ms);
                let parseDate = parseInt(obj.expires_date_ms);
                let today = parseInt(Date.now());
                if (parseDate > today) {
                    console.log("resolve============");
                    return Promise.resolve(true);
                }
            }
            console.log("resolve===catch=========");
            return Promise.reject("Expired");

            //
            // console.log("=+++++++++++++=")
            // console.log(allData);
            //
            // let todayDateStr = moment().format('YYYY-MM-DD HH:mm:ss').toString();
            // let todayDateGetTime = moment(todayDateStr);
            // let todayDate = new Date(todayDateGetTime);
            //
            // allData.map(inAPPData=>{
            //     if(inAPPData.expires_date_ms){
            //         let dateExpMS = parseInt(inAPPData.expires_date_ms);
            //         let expiryDate = new Date(dateExpMS);
            //         console.log("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
            //         if (todayDate < expiryDate) {
            //             console.log("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
            //             return Promise.resolve(true);
            //         }
            //     }
            // });
            //
            //
            // console.log("=+++++++++++++=")
            // console.log(allData);
            // return Promise.reject(false);
            // let lastObj = validationData['latest_receipt_info'].length - 1;
            // if(validationData['latest_receipt_info'][lastObj].expires_date_ms) {
            //
            //     // let todayDateStr = moment().format('YYYY-MM-DD HH:mm:ss').toString();
            //     //let todayDateGetTime = moment(todayDateStr);
            //
            //     //let todayDate = new Date(todayDateGetTime);
            //
            //     //let dateExpMS = parseInt(validationData['latest_receipt_info'][lastObj].expires_date_ms);
            //
            //     //let expiryDate = new Date(dateExpMS);
            //
            //     //console.log("--------new todayDate-------" + todayDate);
            //     //console.log("--------new expiryDate-------" + expiryDate);
            //
            //     let parseDate = parseInt(validationData['latest_receipt_info'][lastObj].expires_date_ms);
            //     let today = parseInt(Date.now());
            //     if (parseDate > Date.now()) {
            //         //alert("valid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
            //         return Promise.resolve(true);
            //     } else {
            //         //need to renew
            //         // console.log('--------------validate ---------');
            //         // alert("invalid--------todayDate-------" + todayDate + "\n" + "--------expiryDate-------" + expiryDate);
            //
            //         return Promise.reject(false)
            //     }
            // }
        }else{
            console.log('--------------validate ---------');
            console.log("----not getting date---latest_receipt_info_not_found----");
            return Promise.reject("latest_receipt_info_not_found")
        }

    } catch(err) {
        console.log('--------------validate ---------' + err);
        console.log("***||error",err);
        // console.log(err.valid, err.error, err.message);
        return Promise.reject("Faild")
    }
};

// --------------restoreAllData---------erruser_cancelled