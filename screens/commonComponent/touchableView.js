import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import {updateUserDetail} from "../../actions/userActions";

class TochableView extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            backColor: props.backColor,
            appTheme: props.appTheme,
            opacity:1
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.appTheme !== nextProps.appTheme){
            this.setState({
                backColor: nextProps.backColor,
                appTheme: nextProps.appTheme,
                opacity:1
            });
        }
    }

    onRowPress = () => {
        this.setState({
            backColor: this.props.pressInColor,
            opacity:0.5
        },()=>{
            setTimeout(()=>{
                this.props.onPress();
            },0);
            setTimeout(()=>{
                this.setState({
                    backColor: this.props.backColor,
                    opacity:1
                });
            },100);
        });
    }

    render() {
        return (
            <View style={[{backgroundColor: this.state.backColor,opacity:this.state.opacity},
                this.props.style && this.props.style || null]}>
                {
                    this.props.children
                }
                <TouchableOpacity style={{left:0, right:0, top:0, bottom:0,
                    backgroundColor:'transparent',position:'absolute'}}
                                  onPress={()=>{this.onRowPress()}}/>
            </View>
        );
    }
}


const mapStateToProps = state => {
    return {
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
})(TochableView);
