import React from 'react';
import {BackHandler, StyleSheet, Text, View} from 'react-native';
import Constant from '../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

import QuestionProgressBar from '../components/quiz/questionProgressBar'


export default  class AssessmentComplete extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            isResultShowing:false
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        this.refs.mainView.fadeIn(400);
        setTimeout(()=>{
            this.refs.viewText.fadeOut(500);
            setTimeout(()=>{
                this.setState({isResultShowing:true})
            }, 500)
        }, 1500)
    }

    _handleBackPress = () => {
        return true;
    };

    navigateToResult = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.navigate('result', {resultNumber: this.props.navigation.state.params.resultNumber});
    };

    render() {
        return (
            <View style={{flex:1, backgroundColor: '#01536d'}}>
                <Animatable.View style={styles.container} ref="mainView">
                    <View style={{top:0,left:0,right:0,bottom:0,height:Constant.screenHeight,position:'absolute',
                        justifyContent:'center', alignItems:'center'}}>

                        <View  style={{alignItems:'center'}}>
                            <Animatable.Image style={{height:Constant.screenWidth/2.5,width:Constant.screenWidth/2.5}}
                                              animation="zoomIn"
                                              resizeMode={'contain'}
                                              source={{uri:'complete_large_tick_icon'}}/>

                            {(!this.state.isResultShowing) &&
                                <Animatable.View animation="slideInUp"
                                                 style={{alignItems:'center', marginTop:50}}
                                                 ref="viewText">
                                    <Text style={styles.titleText}>Assessment complete</Text>
                                    <View style={{paddingTop:22, opacity:0}}>
                                            <QuestionProgressBar navigateToResult={this.navigateToResult} {...this.props}/>
                                    </View>
                                </Animatable.View>
                                ||
                                <View style={{marginTop:50,alignItems:'center'}}>
                                    <Text style={styles.titleText}>Preparing results</Text>
                                    <View style={{paddingTop:22}}>
                                        <QuestionProgressBar navigateToResult={this.navigateToResult} {...this.props}/>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#01536d',
    },
    titleText:{
        fontSize: 17,//25
        color: 'white',
        fontFamily: Constant.font500,
    },
});