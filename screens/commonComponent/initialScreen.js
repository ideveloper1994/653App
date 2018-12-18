import React, { Component } from 'react';
import { ActivityIndicator,
    View, Image, StatusBar }
    from 'react-native';
import Constant from '../../helper/constant'

export default class InitialScreen extends React.PureComponent{

    render(){
        return( (this.props.visible) ?
                <View style={{ position:'absolute', backgroundColor: (this.props.backColor) ? this.props.backColor : '#01536d',
                    height: Constant.screenHeight, width:Constant.screenWidth,
                    alignItems:'center', justifyContent:'center'}}>
                    <StatusBar
                        hidden={false}
                        barStyle="light-content"
                        backgroundColor={Constant.backColor}/>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                        color={"#FFF"}
                    />
                </View>
                : null
        );
    }
}

