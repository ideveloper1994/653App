import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

export default class Separator extends React.PureComponent {
    render() {
        return (
            <View style={[styles.viewSeparator,{backgroundColor: this.props.separatorColor || "#0a4c62"}]} />
        );
    }
}

const styles = StyleSheet.create({
    viewSeparator: {
        width:'100%',
        height: 1,
        backgroundColor:  "#0a4c62"
    },
});