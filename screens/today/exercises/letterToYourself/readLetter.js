import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    ScrollView,
    BackHandler
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import AppStatusBar from '../../../commonComponent/statusBar';
import {setReadLatterDone, managePopupQueue, manageStreakAchievedPopup} from '../../../../actions/userActions';

let viewHeight = Constant.screenHeight*0.86-20;

class ReadLetter extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state={
            showBottom: false,
        }
    }

    componentDidMount() {
        if(this.refs.mainScroll) {
            this.refs.mainScroll.scrollTo({x: 0, y: 10, animated: true});
        }
        if(this.refs.view1){
            this.refs.view1.fadeInDown(0);
            this.refs.view1.fadeInUp(600);
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    }
    handleBackPress = () => {
        return true;
    };
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onBtnDonePress = () => {
        this.props.setReadLatterDone(this.props.navigation.state.params.previousAchieved).then(res=>{
                this.props.navigation.state.params.makeFadeInAnimation();
                this.props.navigation.goBack();
        });
    };

    render() {
        const {container, textTitle, bottomButton, textDetail, bottomAbsoluteButton} = styles;
        return (
            <View style={container}>
                <AppStatusBar backColor='rgb(30,146,138)'/>
                <ScrollView style={[container,{paddingLeft:20, paddingRight:20}]} ref="mainScroll"
                            automaticallyAdjustContentInsets={false}
                            removeClippedSubviews={false}
                            onContentSizeChange={(contentWidth, contentHeight)=>{
                                if(contentHeight <= viewHeight){
                                    if(!this.state.showBottom){
                                        this.setState({
                                            showBottom: true
                                        });
                                    }
                                }
                            }}>
                    <Animatable.View ref="view1">

                        <Image source={{uri:'intro_icon_letter'}}
                               resizeMode={"contain"}
                               style={{height: 75, width: 75, alignSelf:'center', marginTop: Constant.screenHeight*0.10}}/>

                        <Text style={textTitle}>
                            {this.props.navigation.state.params.title}
                        </Text>
                        <Text style={textDetail}>
                            {this.props.navigation.state.params.letterContent}
                        </Text>
                        {
                            (!this.state.showBottom) &&
                            <TouchableHighlight onPress={() => this.onBtnDonePress() }
                                                underlayColor={Constant.transparent}>
                                <Image source={{uri:'button_tick_circle'}}
                                       style={bottomButton}
                                       resizeMode={"contain"}/>
                            </TouchableHighlight>
                            || null
                        }
                    </Animatable.View>
                </ScrollView>
                {
                    (this.state.showBottom) &&
                    <View style={{top:Constant.screenHeight*0.86-20, left:0, right:0,
                        position:'absolute', bottom:0,alignItems:'center'}}>
                        <TouchableHighlight onPress={() => this.onBtnDonePress()}
                                            underlayColor={Constant.transparent}>
                            <Image source={{uri:'button_tick_circle'}}
                                   style={bottomAbsoluteButton}
                                   resizeMode={"contain"}/>
                        </TouchableHighlight>
                    </View>
                    || null
                }
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(30,146,138)',
    },
    textDetail: {
        fontSize: 15.5,
        color:'#FFF',
        // textAlign: 'center',
        lineHeight: 22,
        fontFamily: Constant.font500,
    },
    textTitle: {
        fontSize:24,
        textAlign: 'center',
        color:'#FFF',
        marginTop:20,
        marginBottom: Constant.screenHeight*0.06,
        fontFamily: Constant.font300,
    },
    bottomButton:{
        width: 56,
        height: 56,
        borderRadius: 28,
        alignSelf:"center",
        marginTop:20,
        marginBottom: 50
    },
    bottomAbsoluteButton:{
        width: 56,
        height: 56,
        borderRadius: 28,
        marginTop:20,
    }
});

const mapStateToProps = state => {
    return {
        popupQueue: state.user.popupQueue,
        showStreakGoalPopUp: state.user.showStreakGoalPopUp,
    };
};

export default connect(mapStateToProps, {
    setReadLatterDone,
    managePopupQueue,
    manageStreakAchievedPopup
})(ReadLetter);