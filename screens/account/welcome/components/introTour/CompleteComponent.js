import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Animated,
    Easing
} from 'react-native';
import Constant from '../../../../../helper/constant';
import Button from '../../../../commonComponent/button'

const viewHeight = Constant.screenHeight * 0.615;
const height = (viewHeight > 438) && 438 || viewHeight;

export default class CompleteComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.position1 = new Animated.ValueXY(0,0);
    }

    componentWillMount() {
        Animated.timing(this.position1, {
            toValue: {x:0, y:(Constant.screenHeight*61.5)/100}, duration:0,
            easing: Easing.out(Easing.quad),
        }).start();
    }

    componentDidMount() {
        Animated.timing(this.position1, {
            toValue: {x:0, y:(Constant.screenHeight*61.5)/100}, duration:0,
            easing: Easing.out(Easing.quad),
        }).start();
    }

    componentWillReceiveProps = (props) => {
        if(props.isLast){
            Animated.timing(this.position1, {
                toValue: {x:0, y:0}, duration:800,
                easing: Easing.out(Easing.quad),
            }).start();
        }
    };

    getStartedPress = () => {
        this.props.onGetStartPress();
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.mainView}>
                    <Image style={{flex:1,alignSelf:'center',height:'100%',width:'100%'}}
                           resizeMode={'contain'}
                           source={{uri:'tour_10'}}/>
                    <View style={styles.backView}>
                        <View style={{flex:1, justifyContent:'center', alignItems:'center', position:'absolute'}}>
                            <Animated.Image style={[styles.checkImage,this.position1.getLayout()]}
                                            resizeMode={'contain'}
                                            source={{uri:'checkup_tick'}}/>
                        </View>
                    </View>
                    <View style={styles.bottomLine}/>
                </View>
                <View style={styles.bottomButton}>
                    <Button title="Get Started" color={'#fbb043'} backColor={'white'} onPress={()=>{this.getStartedPress()}}
                            otherTextStyle={{fontFamily: Constant.font700}}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        height: Constant.screenHeight,
        width: Constant.screenWidth,
        flex:1,
        backgroundColor: '#fbb043'
    },
    mainView:{
        width:'75.7%',
        height: height,//'61.5%',
        top:'9%',
        position:'absolute',
        alignSelf:'center',
        overflow: 'hidden',
        zIndex: 50000,
    },
    backView:{
        width: '88%',
        height: '85.8%',
        top: '13.9%',
        alignSelf: 'center',
        position: 'absolute',

        justifyContent:'center',
        alignItems:'center'
    },
    checkImage:{
        width:Constant.screenHeight/5,
        height:Constant.screenHeight/5,
        alignSelf:'center',
    },
    bottomLine:{
        backgroundColor:'#ffd08d',
        height:1,width:'100%',
        alignSelf:'flex-end'
    },
    bottomButton:{
        top:'76%',
        position:'absolute',
        alignSelf:'center',
        width:'75.7%'
    }
});