import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Constant from '../../../../../helper/constant';
import * as Animatable from 'react-native-animatable';

export default  class BeforeBeginComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            days: [],
            backColor: 'rgb(22,93,120)',
            selectedDay: -1,
            isShow: false,
            timeArr: [ '7pm', '8pm', '9pm', '10pm', '11pm'],
            selectedTime: ''
        };
    }

    componentDidMount() {
        setTimeout(()=>{
            let arr = [];
            for(let i = 1; i <= 365; i++) {
                arr.push(i);
            }
            setTimeout(()=>{
                this.setState({isShow: true, days: arr});
                this.refs.text1.fadeIn(1000);
                this.refs.text2.fadeIn(1000);
                this.refs.view1.bounceInRight(2000);
                setTimeout(()=>{
                    this.setState({
                        backColor: '#026485'
                    });
                }, 500);
            }, 300)
        },100)
    }

    componentWillReceiveProps(props) {
        if(props.selectionPart !== 3) {
            let arr = [];
            for(let i = 1; i <= 365; i++) {
                arr.push(i);
            }
            this.setState({
                days: arr,
            });
        }else{
        }
        setTimeout(()=> {
            this.refs.text2.fadeIn(800);
            this.refs.view1.bounceInRight(2000);
            this.refs.labelList.scrollTo({x:0, y:0, animate: true});
            setTimeout(() => {
                this.setState({
                    backColor: '#026485'
                });
            }, 500);
        }, 100)

    }

    onDaySelect = (day) => {
        if(this.props.selectionPart == 3){
            this.setState({
                selectedTime: this.state.selectedTime == day ? "" : day, backColor: 'rgb(22,93,120)',
            });
            this.refs.text1.fadeOut(500);
        }else {
            this.setState({
                selectedDay: this.state.selectedDay == day ? -1 : day, backColor: 'rgb(22,93,120)',
            });
        }
        this.refs.text2.fadeOut(500);
        this.refs.view1.fadeOut(500).then(()=>{
            if(this.props.selectionPart <= 2) {
                this.setState({
                    selectedDay: -1,
                });
            }
            // this.refs.labelList.scrollTo({x:0, y:0, animate: true});
            this.props.onDaySelect(day, this.props.selectionPart);
        });
    };

    renderDays = (days) => {
        return(
            <View style={styles.innerView} key={days}>
                <Text style={[styles.dayText, {color: (this.state.selectedDay) == days ?  'rgb(156,236,150)' : '#fff'}]}
                      suppressHighlighting={true}
                      onPress={() => this.onDaySelect(days)}>
                    {(days > 1) ? days + " days" : "Yesterday"}
                </Text>
            </View>
        )
    };

    renderTimes = (strTime) => {
        return(
            <View style={styles.innerView} key={strTime}>
                <Text style={[styles.dayText, {color: (this.state.selectedTime) == strTime ? 'rgb(156,236,150)' : '#fff'}]}
                      suppressHighlighting={true}
                      onPress={() => this.onDaySelect(strTime)}>
                    {strTime}
                </Text>
            </View>
        )
    };

    render() {
        const {topText, top2Text, container, dayText, animatableView, viewToday} = styles;
        return (
            (this.state.isShow) ?
                <Animatable.View style={container}
                                 ref="mainView">
                    <Animatable.Text style={topText}
                                     ref="text1">
                        {"Before we begin"}
                    </Animatable.Text>
                    <Animatable.Text style={top2Text} ref="text2">
                        {this.props.title2}
                    </Animatable.Text>
                    <View style={{ top: (Constant.screenHeight*67)/100,
                               position:'absolute', backgroundColor:this.state.backColor,
                            height: 60, right: 0, width: 20}}/>
                    <Animatable.View ref="view1"
                                     style={animatableView}>
                        <ScrollView horizontal={true}
                                    ref="labelList"
                                    showsHorizontalScrollIndicator={false}
                                    style={{backgroundColor:'rgb(22,93,120)'}}>
                            <View style={{width: Constant.screenWidth/3,
                             backgroundColor:'rgb(22,93,120)'}}/>

                            {(this.props.selectionPart == 3) ?
                                <View style={viewToday}>
                                    <Text suppressHighlighting={true}
                                          style={[dayText, {color: (this.state.selectedTime) == '6pm' ? 'rgb(156,236,150)' : '#fff'}]}
                                          onPress={() => this.onDaySelect("6pm")}>
                                        6pm
                                    </Text>
                                </View>
                                :
                                <View style={viewToday}>
                                    <TouchableOpacity onPress={()=>console.log("hh")}
                                                      style={{backgroundColor: 'red'}}>
                                        <Text suppressHighlighting={true}
                                              style={[dayText, {color: (this.state.selectedDay) == 0 ? 'rgb(156,236,150)' : '#fff'}]}
                                              onPress={() => this.onDaySelect(0)}>
                                            Today
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                (this.props.selectionPart == 3) ?
                                    this.state.timeArr.map(obj => {
                                        return this.renderTimes(obj)
                                    })
                                    :
                                    this.state.days.map(obj => {
                                        return this.renderDays(obj)
                                    })
                            }
                        </ScrollView>


                    </Animatable.View>
                </Animatable.View>
                :
                null
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgb(22,93,120)'
    },
    topText:{
        top: (Constant.screenHeight*36)/100,
        width:'80%',
        fontSize:24,
        fontFamily: Constant.font500,
        color:'#bad4dc',
        alignSelf: 'center',
        textAlign: 'center',
        position:'absolute'
    },
    top2Text:{
        top: (Constant.screenHeight*43)/100,
        width:'80%',
        fontSize:18,
        fontFamily: Constant.font700,
        color:'#FFF',
        alignSelf: 'center',
        textAlign: 'center',
        position:'absolute'
    },
    dayText:{
        color: '#FFF',
        fontSize:16,
        fontFamily: Constant.font500,
        textAlign: 'center',
        backgroundColor:'#026485'
    },
    innerView: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#026485'
    },
    animatableView: {
        top: (Constant.screenHeight*67)/100,
        position:'absolute',
        height: 60,
        right: 0,
        left: 0,
        justifyContent: 'center'
    },
    viewToday: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor:'#026485'
    }

});