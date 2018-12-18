import React,{Component} from 'react';
import {View, Text, StyleSheet, Image, Animated, Easing, TouchableHighlight} from 'react-native';
import Constant from '../../../../helper/constant';
import ProgressBar from './../../../commonComponent/progressBar';
import {getAvatar} from "../../../../helper/appHelper";

let type=[
    'Psychology',
    'Anxiety',
    'Self-Esteem',
    'Stress',
    'Relationships',
    'Behavioural',
    'Activity',
    'Dietary',
]

class profilePopup extends React.PureComponent{

    constructor(props) {
        super(props);
        this.offset = new Animated.Value(Constant.screenHeight)
    }

    componentWillMount() {
        Animated.timing(this.offset, {
            duration: 0,
            toValue: Constant.screenHeight,
            useNativeDriver: true
        }).start();
    }

    componentDidMount() {
        Animated.timing(this.offset, {
            duration: 400,
            easing: Easing.out(Easing.quad),
            toValue: 0,
            useNativeDriver: true
        }).start();
    }

    onPopupPress = () => {
        Animated.timing(this.offset, {
            duration: 300,
            toValue: Constant.screenHeight,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
        }).start(()=>{
            this.props.onClosePopup();
        });
    };

    getAvatarImage = () => {
        return getAvatar(this.props.avtarId, this.props.gender);
    };

    render(){
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        var {outerView,transparentView,contentView,imgStyle,profileStyle,detailContainer,subContentContainer,txtStyle,progressContainer} = styles
        return(
            <View style={outerView}>
                <View style={[transparentView,{backgroundColor: appColor.aboutYouPopupBack}]}/>

                <Animated.View style={[outerView,{transform: [{translateY: this.offset}]}]} >
                <View style={contentView}>
                    <Image source={{uri:this.getAvatarImage()}}
                           style={imgStyle}
                           resizeMode={"contain"}/>
                    <Text style={profileStyle}>
                        Your Profile
                    </Text>
                    <View style={detailContainer}>
                        {
                            type.map((data,key)=>{
                                return(
                                    <View style={subContentContainer} key={key}>
                                        <Text style={txtStyle}>
                                            {data}
                                        </Text>
                                            <View style={progressContainer}>
                                            <ProgressBar otherColor={'rgba(255,255,255,0.3)'}
                                                         progressVal={(key < (this.props.activityNo - 1)) ? "100%" : 10}
                                                         fillBarColor={'rgb(139,232,145)'}/>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
                </Animated.View>
                <TouchableHighlight
                    onPress={() => this.onPopupPress()}
                    style={{top:0, left:0, right:0, bottom:0, position: 'absolute',
                        backgroundColor: Constant.transparent}}
                    underlayColor={Constant.transparent}>
                    <View/>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    outerView:{
        top:0, left:0, right:0, bottom:0, position: 'absolute', backgroundColor:'transparent',
        alignItems:'center',justifyContent:'center'
    },
    transparentView: {
        top:0, left:0, right:0, bottom:0, position: 'absolute',
        backgroundColor:'rgba(0,0,0,0.55)',
    },
    contentView:{
        backgroundColor: 'rgb(128,199,197)',
        alignItems:'center',
        width:'90%',
        height:418,
        borderRadius:10,
        maxWidth:335,
        marginBottom:20
    },
    detailContainer:{
        top: 143,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        marginRight:25,
        marginLeft:25
    },
    imgStyle:{
        height:56,
        width:56,
        marginTop:26
    },profileStyle:{
        color:'#FFF',
        fontSize:15,
        fontFamily: Constant.font500,
        marginTop:12
    },txtStyle:{
        flex:1,
        color:'#FFF',
        fontSize:14,
        fontFamily:Constant.font500
    },progressContainer:{
        height:10,flex:1.5
    },
    subContentContainer:{
        flexDirection:'row',
        marginBottom:12
    }
})

export default profilePopup;