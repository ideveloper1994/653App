import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Easing
} from 'react-native';
import Constant from '../../../../helper/constant';
import ImprovementIcon from '../subComponent/improvementIcon';
import ProgressBar from '../../../commonComponent/progressBar';

export default  class CheckupPopUp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isTouchEnable: false
        };
        this.offset = new Animated.Value(Constant.screenHeight)
    }

    componentDidMount () {
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),//(0.39, 0.575, 0.565, 1.2),//(0.175, 0.885, 0.32, 1.275),
            toValue: 0,
            useNativeDriver: true
        }).start(()=>{
            this.setState({
                isTouchEnable: true
            });
        });
    }

    onPopupPress = (obj) => {
        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(()=>{
            this.props.onHideRewiringPopUp();
        });
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return(
            <View style={styles.outerView}>
                <View style={[styles.transparentView,{backgroundColor: appColor.todayPopupBackgroundColor,
                    opacity: appColor.todayPopupBackOpacity}]}/>
                <Animated.View style={[styles.innerPopupView,{transform: [{translateY: this.offset}]}]}>
                    <ImprovementIcon onIconPress={this.onPopupPress}
                                     otherStyle={{height:70, width: "100%"}}
                                     imageStyle={{height:70, width: "100%"}}
                                     appTheme={this.props.appTheme}
                                     objIcon={this.props.selectedData}/>
                    <Text style={styles.topTitle}>
                        {this.props.selectedData.processTitle}
                    </Text>
                    <Text style={styles.subTitle}>
                        {this.props.selectedData.title}
                    </Text>
                    <View style={{width: "76%", marginTop: 42}}>
                        <ProgressBar otherColor='rgba(255,255,255, 0.3)'
                                     progressVal={this.props.selectedData.progressPer || "4%"}
                                     fillBarColor={'rgb(153,235,147)'}/>
                    </View>
                    <Text style={styles.bottomTitle}>
                        {this.props.selectedData.progressBottom}
                    </Text>
                </Animated.View>
                {
                    (this.state.isTouchEnable) &&
                    <TouchableHighlight
                        onPress={() => this.onPopupPress()}
                        style={{top:0, left:0, right:0, bottom:0, position: 'absolute',
                            backgroundColor: Constant.transparent}}
                        underlayColor={Constant.transparent}>
                        <View/>
                    </TouchableHighlight>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        top:0, left:0, right:0, bottom:0, position: 'absolute', backgroundColor:'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transparentView: {
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'#173d51',
        opacity:0.9, alignItems:'center', justifyContent:'center'
    },
    vwPopup: {position:'absolute',
        top:0,bottom:0,left:0,right:0,
        backgroundColor:'rgba(1,108,133, 0.8)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerPopupView:{
        backgroundColor: 'rgb(237,194,115)',
        width: Constant.screenWidth - 40,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 13,
        paddingTop: 41,
        height: 320,
        marginBottom: 10,
        maxWidth:340,
    },
    topTitle:{
        color:"#f7e4c5",
        fontSize:15,
        marginTop: 24,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
    bottomTitle:{
        color:"#f7e4c5",
        fontSize:14,
        marginTop: 20,
        fontFamily: Constant.font500,
        textAlign: 'center'
    },
    subTitle:{
        color:"#fff",
        fontSize: 22,
        marginTop: 10,
        fontFamily: Constant.font300,
        textAlign: 'center',
        width: "92%",
        alignSelf: 'center'
    },
});