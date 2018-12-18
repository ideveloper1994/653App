import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../helper/constant';
import TochableView from '../../commonComponent/touchableView';

export default  class LifeTreeCard extends React.PureComponent {

    render() {
        let appColor = Constant[this.props.appTheme];
        return(
            <TochableView onPress={()=>this.props.onPress()}
                          pressInColor={appColor.cardSubSection}
                          backColor={appColor.cardBack}
                          style={[{borderRadius:13,marginLeft: 20,marginRight: 20,marginTop: 10, overflow: 'hidden'},
                              Constant.screenWidth>600 && {maxWidth: 600, width:'100%', alignSelf:'center'}]}>
                <View style={[styles.outerView, {backgroundColor: appColor.cardBack}]}>
                    <View style={ styles.imageView } >
                        <Image source={{uri:'today_card_icon_life_tree'}}
                               style={ styles.iconImage }
                               resizeMode={"contain"}/>
                    </View>
                    <View style={ styles.outerTextView }>
                        <Text style={[styles.titleText, {color: appColor.defaultFont }]}>
                            {this.props.message}
                        </Text>
                    </View>
                </View>
            </TochableView>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        overflow: 'hidden',
        flexDirection:'row',
        borderRadius: 13,
        height:58,
    },
    iconImage:{
        height:58,
        width:60,
    },
    outerTextView:{
        justifyContent:'center',
        flex:1,
        paddingLeft: 15
    },
    titleText:{
        fontSize: 15,
        fontFamily: Constant.font500,
    },

});