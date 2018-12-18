import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    StatusBar
} from 'react-native';
import Constant from '../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStatusBar from './statusBar';
import { connect } from 'react-redux';
import {managePopupQueue, removeSafeArea} from "../../actions/userActions";
import {addNewCheckupQuestion, setCheckupData} from "../../actions/metadataActions";

class NavigationBar extends React.PureComponent {

    render() {
        let height = (this.props.height) ? this.props.height+this.props.top:(80+this.props.top);
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            (this.props.type2)?
                <View style={[styles.mainView,{backgroundColor: (this.props.backColor)
                        ? this.props.backColor : appColor.navDefaultColor,
                    height: (Constant.isIOS) && height || 54,
                    paddingTop:(Constant.isIOS) && (18+this.props.top) || 0,
                    borderBottomWidth:1, borderBottomColor: (this.props.borderColor)
                        ? this.props.borderColor : appColor.navBorderColor}]}>

                    <AppStatusBar barStyle={appColor.statusBarStyle}
                                  backColor={this.props.backColor || appColor.navDefaultColor}/>

                    <Text style={[styles.titleText, {color: appColor.navTextColor}]}>{this.props.title}</Text>

                    <TouchableHighlight style={{position: 'absolute', top: (Constant.isIOS) && 30 || 10,right:20}}
                                        onPress={ () => this.props.onBackButtonPress() }
                                        underlayColor={Constant.transparent}>
                        <Text style={[styles.backText,{paddingTop: 10+this.props.top,color: appColor.navTextColor}]}>
                            {this.props.type2}</Text>
                    </TouchableHighlight>
                </View>
                :
                <View style={[styles.mainView,{backgroundColor: (this.props.backColor) ? this.props.backColor : appColor.navDefaultColor,
                    height:(Constant.isIOS) && height || 54,
                    paddingTop:(Constant.isIOS) && (18+this.props.top) || 0,
                    borderBottomWidth:1, borderBottomColor: (this.props.borderColor)
                        ? this.props.borderColor : appColor.navBorderColor
                }]}>
                    <AppStatusBar barStyle={appColor.statusBarStyle}
                                  backColor={this.props.backColor || appColor.navDefaultColor}/>
                    <StatusBar hidden={false} barStyle={appColor.statusBarStyle}/>
                    <TouchableHighlight onPress={ () => this.props.onBackButtonPress() }
                                        underlayColor={Constant.transparent}>
                        <View style={ styles.backIcon }>
                            <Ionicons name={this.props.backIcon && this.props.backIcon.name || 'ios-arrow-back'}
                                      size={this.props.backIcon && this.props.backIcon.size || 35}
                                      color={appColor.navBackArrow}/>
                        </View>
                    </TouchableHighlight>
                    <Text style={[styles.titleText,{color: appColor.navTextColor}]}>{this.props.title}</Text>
                    {
                        (this.props.rightButton) &&
                        <Text style={[styles.textTitle, {color: appColor.navDoneBtn}]}
                              onPress={()=>this.props.onRightBtnClick()}>
                            {this.props.rightButton}
                        </Text>
                        ||
                        <Text style={[styles.textTitle, {color: Constant.transparent}]}>{"Save"}</Text>
                    }
                </View>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        flexDirection:'row',
        alignItems: 'center',
    },
    backIcon:{
        paddingLeft:10,
        paddingRight: 40,
        paddingTop:8,
        paddingBottom:5
    },
    titleText:{
        alignSelf: 'center',
        fontSize: 14,
        color: '#FFF',
        textAlign: 'center',
        flex:1,
        fontFamily: Constant.font700,
    },
    backText:{
        // paddingTop: 10,
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: Constant.font500,
    },
    textTitle:{
        color: 'rgba(255,255,255,0.9)',
        textAlign:'right',
        fontSize: 14,
        fontFamily: Constant.font700,
        paddingLeft:15,
        paddingRight: 15,
        paddingTop:15,
        paddingBottom:15,
    }
});


const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
})(NavigationBar);