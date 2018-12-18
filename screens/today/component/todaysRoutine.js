import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../helper/constant';
import Routine from './routineComponent'

export default  class TodaysRoutine extends React.PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <Routine title={this.props.title}
                         desc={this.props.desc}
                         Icon={this.props.Icon}
                         TodayItemList={(this.props.TodayItemList)?this.props.TodayItemList:null}
                         isActiveDot={this.props.isActiveDot}
                         isIcon={this.props.isIcon}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:Constant.backProgressBarColor,

    },
});