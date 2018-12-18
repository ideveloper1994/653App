import React, { Component } from 'react';
import {
    Text,
    ScrollView,
    TouchableHighlight,
    View,
} from 'react-native';
import Constant from '../../../../helper/constant';
import * as Animatable from 'react-native-animatable';


export default class tabLabelComponent extends React.PureComponent {

    constructor(props){
        super(props);
    }

    clicked = () => {
        this.refs.vwImg.pulse(400);
        setTimeout(()=>{
            this.props.labelClicked(this.props.text);
        },10);
        //this.props.labelClicked(this.props.text);

    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <Animatable.View ref="vwImg">
                <TouchableHighlight onPress={()=>{
                        this.clicked();
                    }} style={{width:Constant.screenWidth/3, paddingTop: 10, paddingBottom:13}} underlayColor={'transparent'}>
                    <View style={{alignItems:'center'}}>
                        <Text style={{ fontSize:14, color: this.props.text == this.props.selectedTab ?
                                appColor.scrollableActiveFont: appColor.customInactiveFont ,paddingTop:15,
                        alignSelf: 'center',fontFamily: Constant.font500}}>
                            {this.props.text}
                        </Text>
                    </View>
                </TouchableHighlight>
            </Animatable.View>

        );
    }
}
