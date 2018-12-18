import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Text,
    TouchableOpacity
} from 'react-native';
import Constant from '../../helper/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class BtnSubscription extends React.PureComponent {

    render() {
        return (
            <View>
                <TouchableOpacity onPress={()=>this.props.onStartPress(this.props.productKey)}
                                  style={[styles.btnLogin,{backgroundColor: this.props.backColor}]}>
                    <View>
                        <Text style={{color: "#FFF",fontSize:19, fontFamily: Constant.font700,  alignSelf:'center'}}>
                            {"Start 7 day free trial"}
                        </Text>
                        {
                            (this.props.priceText) &&
                            <Text style={[{color: "#FFF",fontSize:12, fontFamily: Constant.font500,
                                alignSelf:'center',paddingTop:2}]}>
                                {this.props.priceText}
                            </Text>
                        }
                    </View>
                </TouchableOpacity>
                {
                    (this.props.isRestore) &&
                    <View style={styles.bottomView}>
                        <Text style={{color:'white',fontSize: 14,
                            fontFamily: Constant.font700,backgroundColor: 'transparent', textAlign:'center'}}>
                            {"Already subscribed?"}
                        </Text>
                        <Text style={{color:'white',fontSize: 14,
                            fontFamily: Constant.font700,backgroundColor: 'transparent',
                            textDecorationLine:'underline'}} onPress={()=>this.props.onRestorePress()}>
                            {"Restore existing subscription."}
                        </Text>
                    </View>
                    ||
                    <View style={styles.bottomView}>
                        <Text style={{color:'white',fontSize: 11,
                            fontFamily: Constant.font700,backgroundColor: 'transparent', textAlign:'center'}}>
                            {"For your privacy, the purchase will appear as 'ITUNES STORE'."}
                        </Text>
                        <View style={{flexDirection:'row', alignSelf:'center'}}>
                            <Text style={{color:'white',fontSize: 11,
                                fontFamily: Constant.font700,backgroundColor: 'transparent'}}>
                                {"No commitment, cancel any time. "}
                            </Text>
                            <Text style={{color:'white',fontSize: 11,
                                fontFamily: Constant.font700,backgroundColor: 'transparent',
                                textDecorationLine:'underline'}} onPress={()=>this.props.onShowTerm()}>
                                {"Terms of service."}
                            </Text>
                        </View>
                    </View>
                }

            </View>
        );
    }

}

const styles = StyleSheet.create({
    btnLogin:{
        marginLeft: 30,
        marginRight: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        borderWidth: 1,
        borderColor:'#fff',
        height: 56,
        width: '80%',
        marginTop: 3,
        maxWidth: 300
    },
    bottomView:{
        alignItems:'center',
        paddingTop: 8,
        paddingBottom: 10,
        width:"90%",
        alignSelf:'center'
    }
});