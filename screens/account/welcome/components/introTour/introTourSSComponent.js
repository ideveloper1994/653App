import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Animated,
} from 'react-native';
import Constant from '../../../../../helper/constant';

const viewHeight = Constant.screenHeight * 0.615;
const height = (viewHeight > 438) && 438 || viewHeight;


export default class IntroTourSSComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.position1 = new Animated.ValueXY(0,0);
    }

    componentWillMount() {
        Animated.timing(this.position1, {
            toValue: {x:0, y:(Constant.screenHeight*61.5)/100}, duration:0
        }).start();
    }

    componentDidMount() {
        setTimeout(()=>{
            Animated.timing(this.position1, {
                toValue: {x:0, y:0}, duration:500
            }).start();
        }, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{left:0, right:0, bottom:Constant.screenHeight*0.1,
                    position:'absolute', justifyContent:'center',alignItems:'center',
                    height:Constant.screenHeight, width:Constant.screenWidth}}>
                <View style={styles.mainView}>
                    <Animated.View style={[{flex:1, width: '100%',
                        height: "100%"},this.position1.getLayout()]}
                                   ref="mainView">
                        <View style={styles.phoneImage}>
                            <Image style={{flex:1,alignSelf:'center', width: '100%',
                                height: '100%'}}
                                   resizeMode={'contain'}
                                   source={{uri:this.props.screenShots}}/>
                        </View>
                    </Animated.View>
                    <View style={styles.bottomLine}/>
                </View>
                </View>

                <Text style={styles.bottomText}>
                    {this.props.description}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: Constant.screenWidth,
            height: Constant.screenHeight,
            backgroundColor: '#fbb043',
        },
        mainView: {
            width: '75.7%',
            height: height,
            position: 'absolute',
            alignSelf: 'center',
            overflow: 'hidden',
            zIndex: 50000,
        },
        phoneImage: {
            flex: 1,
            alignSelf: 'center',
            width: '100%',
            height: '100%',
        },
        imageView: {
            width: '88%',
            height: '85.8%',
            top: '13.9%',
            alignSelf: 'center',
            position: 'absolute'
        },
        bottomLine: {
            backgroundColor: '#ffd08d',
            height: 1,
            width: '100%',
            alignSelf: 'flex-end'
        },
        bottomText: {
            top: '76%',
            position: 'absolute',
            textAlign: 'center',
            alignSelf: 'center',
            width: '75.7%',
            fontSize: 15,
            fontFamily: Constant.font500,
            color: 'white',
            lineHeight: 24,
        }
    }
);