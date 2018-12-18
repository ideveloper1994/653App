import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class TitleBar extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={[styles.mainView, {
                height: (Constant.isIOS) && 74 + this.props.top || 54,
                paddingTop: (Constant.isIOS) && 18 + this.props.top || 0,
                backgroundColor: appColor.navDefaultColor,
                borderBottomWidth: 1, borderBottomColor: appColor.navBorderColor
            }]}>

                <TouchableHighlight onPress={() => {
                    if (this.props.isBack) {
                        this.props.onBackButtonPress()
                    }
                }} underlayColor={Constant.transparent}>
                    <View style={styles.backIcon}>
                        <Ionicons name='ios-arrow-back'
                                  size={35}
                                  color={(this.props.isBack) ? appColor.navBackArrow : 'transparent'}/>
                    </View>
                </TouchableHighlight>
                <Text style={[styles.titleText, {color: appColor.navTextColor}]}>{this.props.title}</Text>

                <View style={styles.btnCancel}>
                    <Text style={[styles.textTitle]}>{"Cancel"}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Constant.backColor
    },
    backIcon: {
        paddingLeft: 10,
        paddingRight: 50,
        paddingTop: 8,
        paddingBottom: 5,
    },
    titleText: {
        alignSelf: 'center',
        fontSize: 15,
        color: '#FFF',
        textAlign: 'center',
        flex: 1,
        fontFamily: Constant.font700,
    },
    backText: {
        paddingTop: 10,
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: Constant.font500,
    },
    btnCancel:{
        width: 74,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 22
    },
    textTitle: {
        color:Constant.transparent,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: Constant.font700,
    }
});