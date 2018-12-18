import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

class SymptomsList extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            textColor:"#4e4e4e",
            borderColor: '#c4c4c4',
            timer1:null,
            timer2:null,
            isChecked: false
        };

    }

    componentWillMount() {
    }

    static route = {
        styles: {
            gestures: null
        },
    };
    componentDidMount() {
        this.refs.check.zoomOut(1);
        this.refs.backView.fadeOut(1)
    }

    onSelectSymptoms = () => {
        if(!this.state.isChecked){
            // let count=0;
            // let timer = setInterval(()=> {
            //     count += 0.1;
            //     this.setState({backColor: "rgba(255, 129, 116," + count + ")"});
            //     if(count==1)
            //     {
            //         clearInterval(this.state.timer1);
            //     }
            // }, 10);
            this.setState({textColor:"#FFF", borderColor:'#FFF'});
            this.refs.check.zoomIn(200);
            this.refs.backView.fadeIn(200);
        }else{
            // let count=1;
            // let timer = setInterval(()=> {
            //     count -= 0.1;
            //     this.setState({backColor: "rgba(255, 129, 116," + count + ")"});
            //     if(count==0)
            //     {
            //         clearInterval(this.state.timer2);
            //     }
            // }, 10);
            this.setState({textColor:"#4e4e4e", borderColor: '#c4c4c4'});
            this.refs.check.zoomOut(200);
            this.refs.backView.fadeOut(200);
        }
        this.setState({isChecked: !this.state.isChecked});
    };

    render() {
        return (
            <View>
                <TouchableHighlight onPress={() => this.onSelectSymptoms() }
                                    underlayColor={Constant.transparent}>
                    <Animatable.View style={[styles.container,
                    {backgroundColor:Constant.transparent}]}>
                        <Animatable.View ref="backView" style={styles.backView}/>
                        <Text style={{flex:1,fontSize: 16,
                        fontFamily: Constant.font500,color:this.state.textColor}}>{this.props.description}</Text>
                        <View style={{height:26,width:26,borderWidth:1,
                        borderColor: this.state.borderColor, borderRadius:13}}>
                            <Animatable.Image source={{uri:'tick_symptom'}}
                                              style={{height:'100%',width:'100%',flex:1}}
                                              resizeMode='contain'
                                              ref="check"/>
                        </View>
                    </Animatable.View>
                </TouchableHighlight>
                <View style={{height:1,backgroundColor:'#efefef'}}/>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, {
})(SymptomsList);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems:'center',
        flexDirection: 'row',
        paddingLeft:20,
        paddingRight:20,
        height: 90
    },
    backView: {
        position:'absolute',
        top:0,
        bottom:0,left:0,right:0,
        backgroundColor:'rgb(255,129,116)'
    },
});