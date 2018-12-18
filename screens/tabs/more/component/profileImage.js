import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../helper/constant'

export default class ProfImage extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            userImage:this.props.profileImage
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            userImage: nextProps.profileImage,
        })
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={{alignItems:'center', paddingBottom: 30, backgroundColor: appColor.appBackground}}>
                <Image resizeMode="contain" style={styles.profileImage}
                       source={{uri:this.state.userImage}} />
                <Text style={[styles.profileNameStyle,{color:appColor.defaultFont}]}>
                    {this.props.profileName}</Text>
                <Text style={[styles.otherText,{color:appColor.settingEmail}]}>
                    {this.props.profileEmail}</Text>

                <TouchableOpacity onPress={()=>{this.props.goTo(this.props.viewName)}}>
                    <View style={[styles.borderView,{backgroundColor:appColor.settingBtn}]}>
                        <Text style={[styles.settingText,{color: appColor.settingBtnText}]}>
                            Profile Settings</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    profileNameStyle: {
        color:'#FFF',
        fontSize:15,
        marginTop: 10,
        marginBottom:8,
        fontFamily: Constant.font500,
    },
    profileImage:{
        height:46,
        width:46,
        borderRadius:23
    },
    borderView:{
        borderRadius:16,
        marginTop:20,
        paddingLeft:10,
        paddingRight:10,
        justifyContent:'center',
        alignItems:'center',
        height:32,
        backgroundColor: '#01536d'
    },
    otherText:{
        color:"rgb(184,198,205)",
        fontSize:13,
        fontFamily: Constant.font500,
    },
    settingText:{
        color:'#FFF',
        fontSize:12,
        marginHorizontal: 10,
        fontFamily: Constant.font500,
    },

});