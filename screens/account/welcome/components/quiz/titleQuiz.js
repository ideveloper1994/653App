import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated
} from 'react-native';
import Constant from '../../../../../helper/constant';
import { connect } from 'react-redux';

let question = 0;

class TitleBar extends React.PureComponent {

    constructor(props) {
        super(props);
        this._width = new Animated.Value(0);
    }

    componentWillMount() {
        if(question < 18 && question>0) {
            Animated.timing(this._width, {
                toValue: (Constant.screenWidth/18) * ++question,
                duration:400
            }).start();
        }
    }

    componentWillReceiveProps(props) {
        if(props.questionNo <= 18) {
            Animated.timing(this._width, {
                toValue: (Constant.screenWidth/18) * props.questionNo,
                duration:400
            }).start();
        }
    }

    render() {
        const barStyles = {
            backgroundColor: "#fbb043",
            height: 4,
            width: this._width,
        };
        return (
            <View style={{backgroundColor: "#01536d",height: (Constant.isIOS) && 74+this.props.safeAreaInsetsData.top || 58}} >
                <View style={[styles.mainView,{marginTop:this.props.safeAreaInsetsData.top}]}>
                    <Text style={styles.titleText}>{this.props.title}</Text>
                </View>
                <Animated.View style={barStyles}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        backgroundColor: '#01536d',
        flexDirection:'row',
        alignItems: 'center',
        paddingTop: (Constant.isIOS) && 25 || 0,
        height:  (Constant.isIOS) && 70 || 54,
    },
    titleText:{
        alignSelf: 'center',
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        flex:1,
        fontFamily: Constant.font500,
    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {

})(TitleBar);