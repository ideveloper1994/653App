import React,{Component} from 'react';
import {View,Text,ScrollView,Image,Alert,StyleSheet,TouchableOpacity} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import Button from './button';
import ProgressBar from './profileProgress';
import {getAvatar} from "../../../../../helper/appHelper";
let mainqiuestion = 0;

class UpdateProfileComponent extends React.PureComponent{

    constructor(props){
        super(props)
        this.state={
            questionNo: props.questionNo,
        }
    }

    onSelecteAnswer = (obj) => {
            this.props.onSelectAnswer(this.props.questionNo, this.props.rowData, obj)
    }

    componentWillReceiveProps (nextProps) {
        if(mainqiuestion !== nextProps.mainQuestionNo){
            mainqiuestion = nextProps.mainQuestionNo;
            let mainQuestionNo = nextProps.mainQuestionNo;
            if(this.refs.questionPopup) {
                // this.refs.questionPopup.fadeIn(400);
            }
        }
    }

    getAvatarImage = () => {
        return getAvatar(this.props.avtarId, this.props.gender);
    };

    render(){
        const {contentView,imgStyle,txtStyle,queTextStyle}= styles;
        return(
                <Animatable.View style={contentView} ref="questionPopup" animation="fadeIn" duration={300}>
                    <Image source={{uri:this.getAvatarImage()}}
                           style={imgStyle}
                    resizeMode={"contain"}/>
                    <Text style={txtStyle}>
                        {"QUESTION " + this.props.questionNo}
                    </Text>
                    <Text style={queTextStyle}>
                        {this.props.rowData.questions}
                    </Text>
                    {
                        this.props.rowData.answer.map((obj,index)=>{
                            return(<Button
                                    key={index}
                                    rowData={obj}
                                    color = "#FFF"
                                    onPress={this.onSelecteAnswer}
                            />)
                        })
                    }
        </Animatable.View>
        )
    }
}

const styles= StyleSheet.create({
    contentView:{
        width:'90%',
        maxWidth:340,
        backgroundColor:'#FFF',
        alignItems:'center',
        borderRadius:10,
        marginTop:(Constant.isIOS) && 0 || 42,
        paddingBottom:18
    },
    imgStyle:{
        marginTop:26,
        marginBottom:22,
        height:56,width:56
    },
    txtStyle: {
        color:'#b8b8b8',
        fontSize:12,
        fontFamily:Constant.font700,
        marginBottom:8
    },
    queTextStyle :{
        color:'#3b3b3b',
        fontSize:15,
        fontFamily:Constant.font700,
        lineHeight:24,
        width:'85%',
        textAlign:'center',
        marginBottom:26,
    },
})

export default UpdateProfileComponent;