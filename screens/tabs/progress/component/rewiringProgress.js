import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
} from 'react-native';
import Constant from '../../../../helper/constant';
import ProgressBar from '../subComponent/progressBar';

export default class userProgress extends React.PureComponent {

    render() {
        let appColor = Constant[this.props.appTheme];
        const { container, titleStyle } = styles;
        return (
            <View style={[container,{backgroundColor:appColor.scrollableViewBack}]}>
                <Text style={[titleStyle,{color:appColor.defaultFont}]}>Rewiring Progress</Text>
                {
                    this.props.rewiringProgress.map((obj, index) =>{
                        return <ProgressBar
                            appTheme={this.props.appTheme}
                            progressName={obj.progressName}
                            fillColor={obj.fillColor}
                            progressPer={obj.progressPer}
                            actualPer={obj.actualPer}
                            key={index} />
                    })
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Constant.backProgressBarColor,
        alignItems:'center'
        //paddingTop: 50
    },
    titleStyle:{
        marginTop: 38,
        marginBottom:30,
        color:'#FFF',
        fontSize:15,
        fontFamily: Constant.font500,

    }
});