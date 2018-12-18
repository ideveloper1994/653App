import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
} from 'react-native';
import Constant from '../../../../helper/constant';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import TabLabelComponent from './tabLabelComponent';

export default class TopBar extends React.PureComponent {

    constructor(props){
        super(props);
    }

    labelClicked = (selectedLabel) => {
        if(this.refs.labelList){
            this.props.labelClicked(selectedLabel);
            switch (selectedLabel)
            {
                case "Overall":
                    this.refs.labelList.scrollTo({x:0,y:0,animated:true});
                    break;
                case "This year":
                    this.refs.labelList.scrollTo({x:(Constant.screenWidth/3),y:0,animated:true});
                    break;
                case "This month":
                    this.refs.labelList.scrollTo({x:(Constant.screenWidth/3)*2,y:0,animated:true});
                    break;
                case "This week":
                    this.refs.labelList.scrollTo({x:(Constant.screenWidth/3)*3,y:0,animated:true});
                    break;
            }
        }
    };

    render() {
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50
        };
        return (
            <View>
                <GestureRecognizer
                    onSwipeLeft={(state) => this.props.onSwipeLeft(state)}
                    onSwipeRight={(state) => this.props.onSwipeRight(state)}
                    config={config}>
                    <View>
                        <ScrollView horizontal={true} scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    ref="labelList">
                            <TabLabelComponent text="" labelClicked={this.labelClicked} selectedTab={this.props.countshow} key={1}
                                               appTheme={this.props.appTheme}/>
                            <TabLabelComponent text="Overall" labelClicked={this.labelClicked} selectedTab={this.props.countshow} key={2}
                                               appTheme={this.props.appTheme}/>
                            <TabLabelComponent text="This year" labelClicked={this.labelClicked} selectedTab={this.props.countshow} key={3}
                                               appTheme={this.props.appTheme}/>
                            <TabLabelComponent text="This month" labelClicked={this.labelClicked} selectedTab={this.props.countshow} key={4}
                                               appTheme={this.props.appTheme}/>
                            <TabLabelComponent text="This week" labelClicked={this.labelClicked} selectedTab={this.props.countshow} key={5}
                                               appTheme={this.props.appTheme}/>
                            <TabLabelComponent text="" labelClicked={this.labelClicked} selectedTab={this.props.countshow} key={6}
                                               appTheme={this.props.appTheme}/>
                        </ScrollView>
                    </View>
                </GestureRecognizer>

                <View style={{backgroundColor:Constant.orangeColor, width:Constant.screenWidth/5,
                    alignSelf:'center',borderRadius:20, height:4, marginBottom:13}}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({


});

