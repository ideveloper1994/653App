import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    BackHandler
} from 'react-native';

export default  class SliderDotComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        let arr = [];
        for(let i=0; i<props.noOfPages; i++){
            arr.push(i);
        }
        this.state={
            noOfPages :props.noOfPages,
            arr: arr,
        };

    }
    handleBackPress = () => {
        return true;
    };
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillReceiveProps(nextProps) {
        let arr = [];
        for(let i=0; i<nextProps.noOfPages; i++) {
            arr.push(i);
        }
        this.setState({
            arr:arr
        });

    }

    render() {
        return (
            <View style={styles.container}>
                { this.state.arr.map((i) => {
                    return(
                        <View style={[styles.dotView,
                        {backgroundColor: (i==this.props.selectedIndex) ?
                        this.props.activeDotColor : (this.props.inActiveDotColor) ? this.props.inActiveDotColor :'#fff'}]}
                              key={i}/>
                    );
                }) }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'center',
    },
    dotView:{
        height: 6,
        width: 6,
        borderRadius: 3,
        backgroundColor:'#FFF', //'rgb(236, 59, 41)'
        marginLeft: 3,
        marginRight: 3,
    }
});