import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Constant from '../../helper/constant'

export default  class ProgressBarVer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isClicked:false
        }
    }

    barClicked = () => {
        if(this.props.selectedindex != this.props.currentIndex) {
            this.setState({isClicked: !this.state.isClicked});
            this.props.barClicked(this.props.currentIndex)
        }else {
            this.setState({isClicked:!this.state.isClicked})
        }
    };

    componentWillReceiveProps(next){
        if(next.selectedindex != next.currentIndex) {
            this.setState({isClicked: false})
        }
    }

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <TouchableHighlight underlayColor={'transparent'}
                                onPress={this.barClicked}
                                style={{flex:1,width:'8.33%',alignItems: 'center'}}>
                <View>
                    <View style={[
                        { backgroundColor:this.props.transparent,height:130  },styles.mainView]}>
                        {(this.state.isClicked)?
                            <Text style={{fontSize:10,fontFamily:Constant.font500, color:appColor.defaultFont,
                                textAlign:'center',marginBottom:3,alignSelf:'center'}}>
                                {this.props.progressVal + "%"}
                            </Text>
                            :<View />
                        }
                        <View style={[
                            { height: this.props.progressVal+"%",
                                backgroundColor: (this.props.progressVal > 0) ?
                                    this.props.progressbarTintColor : this.props.progressbarBackColor },
                            styles.fillBar]}/>
                    </View>
                    <Text style={[styles.bottomText, {color:appColor.verProgressBottomTitle}]}>{this.props.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }

}

const styles = StyleSheet.create({
    mainView:{
        borderRadius: 5,
        margin: 5,
        justifyContent:'flex-end'
        // marginBottom: 15
    },
    fillBar:{
        borderRadius: 5,
        padding:5,
        alignSelf:'center',
        justifyContent:'flex-end'
    },
    otherBar:{
        borderRadius: 5,
        padding:5
    },
    bottomText: {
        color: 'rgb(153,186,196)',
        fontSize: Constant.screenWidth < 350 ? 10 : 12,
        textAlign:'center',
        alignSelf:'center',
        fontFamily: Constant.font700,
    },
});