import React, { Component } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

export default  class ProgressBar extends React.PureComponent {

    render() {
        return (
            <View style={[{ backgroundColor: this.props.otherColor },styles.mainView]}>
                <View style={[{ width: this.props.progressVal, backgroundColor: this.props.fillBarColor }, styles.fillBar]}/>
                <View style={[{backgroundColor: this.props.otherColor }, styles.otherBar]}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        flexDirection: 'row',
        borderRadius: 5,
        marginTop: 0,
        marginBottom: 0,
        width: '100%',
        overflow:'hidden'
    },
    fillBar:{
        borderRadius: 5,
        padding:5
    },
    otherBar:{
        borderRadius: 5
    }
});