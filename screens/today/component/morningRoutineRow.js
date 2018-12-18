import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Constant from '../../../helper/constant';

export default  class MorningRoutineRow extends React.PureComponent {

    render() {
        return(
            <View style={styles.mainView}>
                <View  style={ styles.outerView }>
                    <Image source={this.props.icon}
                           style={ styles.iconImage }
                           resizeMode={"contain"}/>
                    <View style={ styles.outerTextView }>
                        <Text style={styles.titleText} numberOfLines={1}>
                            {this.props.title}
                        </Text>
                    </View>
                </View>
                <View style={styles.rightView}>
                    <Image source={{uri:'icon_complete_arrow_up'}}
                           style={ styles.rightIcon }
                           resizeMode={"contain"}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView:{
        flexDirection:'row',
        height: 46,
        marginBottom: 7
    },
    outerView:{
        flexDirection:'row',
        borderRadius: 5,
        height: 46,
        width: 236,
        marginRight:10,
        backgroundColor: '#5ac2be'//'rgb(117,210,206)'
    },
    iconImage:{
        height:46,
        width: 46,
    },
    outerTextView:{
        justifyContent:'center',
        flex:1,
    },
    titleText:{
        fontSize: 15,
        color: '#FFF',
        paddingLeft: 17,
        fontFamily: Constant.font700,
    },
    rightView:{
        height: 46,
        width: 46,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(195,238,186)',
        borderRadius: 5,
    },
    rightIcon: {
        height: 14,
        width: 11,
    }

});