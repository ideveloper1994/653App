import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../helper/constant';
import { connect } from 'react-redux';
import AppStatusBar from '../commonComponent/statusBar';


 class NavigationTitleBar extends React.PureComponent {

    render() {
        const {mainView, titleText} = styles;
        return (
            <View style={[mainView, {backgroundColor: this.props.backColor,height: (Constant.isIOS) && 74+this.props.safeAreaInsetsData.top || 54}]}>
                <AppStatusBar backColor={this.props.backColor}/>
                <Text style={[titleText, {color: this.props.textColor || '#FFF',marginTop: (Constant.isIOS) && 15+this.props.safeAreaInsetsData.top || 0}]}>
                    {this.props.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        width:'100%',
        backgroundColor:'#EC3B29',
        justifyContent:'center',
        alignItems:'center'
    },
    titleText:{
        fontSize: 16,
        fontFamily: Constant.font500,

    }
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData: state.user.safeAreaInsetsData,
    };
};

export default connect(mapStateToProps, {

})(NavigationTitleBar);