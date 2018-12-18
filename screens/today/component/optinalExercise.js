import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import Constant from '../../../helper/constant';
import Routine from './routineComponent'

export default  class OptinalExercise extends React.PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <Routine title={this.props.title}
                         desc={this.props.desc}
                         Icon={this.props.Icon}
                         TodayItemList={(this.props.TodayItemList)?this.props.TodayItemList:null}
                         isActiveDot={this.props.isActiveDot}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:Constant.backProgressBarColor,
        marginTop:15
    },
});