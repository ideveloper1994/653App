import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Animated,
    BackHandler
} from 'react-native';
import Constant from '../../../helper/constant';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import AppStatusBar from '../../commonComponent/statusBar';

class HowDidUDo extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            showBottom: false
        };
        this.position = new Animated.ValueXY(0,0);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        Animated.timing(this.position, {
            toValue: {x:0, y:Constant.screenHeight*0.12}, duration:0
        }).start();
    }

    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                showBottom: true,
            },()=>{
                this.refs.img1.fadeIn(800);
                this.refs.img2.fadeIn(800);
            });
            Animated.timing(this.position, {
                toValue: {x:0, y:0}, duration:300
            }).start();
        },2000);
    }

    handleBackPress = () => {
        return true;
    };

    onIconPress = () =>{
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        if(this.props.navigation.state.params.isPassObj){
            this.props.navigation.navigate(this.props.navigation.state.params.nextPage, this.props.navigation.state.params.passObj);
        }else{
            this.props.navigation.navigate(this.props.navigation.state.params.nextPage,{transition: "fadeIn"});
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <AppStatusBar backColor={"#f0b45a"}/>
                <Animatable.View style={{top:0, left:0, right:0, bottom:0,backgroundColor: '#f0b45a',
                position: 'absolute', alignItems: 'center'}} duration={300} delay={10} animation="fadeIn"/>

                <Animated.View style={[{height:Constant.screenHeight,
                backgroundColor: 'transparent',
                alignItems: 'center',width:Constant.screenWidth},this.position.getLayout()]}>
                    <Animatable.Text style={styles.titleText} duration={300} delay={500} animation="fadeIn">
                        Exercise complete
                    </Animatable.Text>

                    <View style={{top:Constant.screenHeight*0.35-5, left:0, right:0, bottom:0,
                position: 'absolute', alignItems: 'center'}}>
                        <Animatable.Text style={styles.largeText} duration={300} delay={500} animation="fadeIn">
                            How did you do?
                        </Animatable.Text>
                    </View>

                    {(this.state.showBottom) &&
                    <View style={{top:Constant.screenHeight*0.46, height:84, width:212,
                 position: 'absolute', flexDirection:'row', justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={()=>this.onIconPress()}>
                            <Animatable.Image source={{uri:'button_sad'}}
                                              style={styles.imageIcon}
                                              ref="img1"
                                              resizeMode={"contain"}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onIconPress()}>
                            <Animatable.Image source={{uri:'button_happy'}}
                                              style={styles.imageIcon} ref="img2"
                                              resizeMode={"contain"}/>
                        </TouchableOpacity>
                    </View>
                    || null }
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: Constant.backProgressBarColor,//'rgb(90,194,189)',
        alignItems: 'center'
    },
    titleText:{
        fontSize: 15,
        color: '#fbead7',
        fontFamily: Constant.font500,
        marginTop: Constant.screenHeight*0.3 - 3,
        backgroundColor: 'transparent'
    },
    largeText:{
        fontSize: 24,
        color: '#FFF',
        fontFamily: Constant.font300,
        backgroundColor: 'transparent'
    },
    imageIcon:{
        height: 84,
        width:84,
    },
});

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, {
})(HowDidUDo);