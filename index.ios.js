/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
    AppRegistry,
} from 'react-native';
import App from './navigation/storeConfig';
console.disableYellowBox=true;
AppRegistry.registerComponent('BrainBuddyReact', () => App);