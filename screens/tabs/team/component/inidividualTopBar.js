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
        this.state = {
            countshow: props.countshow || "Overall"
        }
    }

    componentDidMount(){
        //this.labelClicked(this.state.countshow);
    }

    labelClicked = (selectedLabel) => {
        if(this.refs.labelList){
            this.props.labelClicked(selectedLabel);

            switch (selectedLabel) {
                case "Overall":
                    this.refs.labelList.scrollTo({x:0,y:0,animated:true});
                    break;
                case "This year":
                    this.refs.labelList.scrollTo({x: (Constant.screenWidth / 3), y: 0, animated: true});
                    break;
                case "This month":
                    this.refs.labelList.scrollTo({x: (Constant.screenWidth / 3) * 2, y: 0, animated: true});
                    break;
                case "This week":
                    this.refs.labelList.scrollTo({x: (Constant.screenWidth / 3) * 3, y: 0, animated: true});
                    break;
                case "America":
                    this.refs.labelList.scrollTo({x: (Constant.screenWidth / 3) * 4, y: 0, animated: true});
                    break;
                case "Europe":
                    this.refs.labelList.scrollTo({x: (Constant.screenWidth / 3) * 5, y: 0, animated: true});
                    break;
                case "Asia":
                    this.refs.labelList.scrollTo({x:(Constant.screenWidth/3)*6,y:0,animated:true});
                    break;
                case "Pacific":
                    this.refs.labelList.scrollTo({x:(Constant.screenWidth/3)*7,y:0,animated:true});
                    break;
            }
            this.setState({
                countshow:selectedLabel
            });
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
                        <ScrollView horizontal={true}
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    ref="labelList">
                            <TabLabelComponent text="" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={1}/>
                            <TabLabelComponent text="Overall" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={2}/>
                            <TabLabelComponent text="This year" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={3}/>
                            <TabLabelComponent text="This month" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={4}/>
                            <TabLabelComponent text="This week" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={5}/>
                            <TabLabelComponent text="America" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={6}/>
                            <TabLabelComponent text="Europe" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={7}/>
                            <TabLabelComponent text="Asia" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={8}/>
                            <TabLabelComponent text="Pacific" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={9}/>
                            <TabLabelComponent text="" labelClicked={this.labelClicked} selectedTab={this.props.countshow}
                                               appTheme={this.props.appTheme}
                                               key={10}/>
                        </ScrollView>
                    </View>
                </GestureRecognizer>

                <View style={{backgroundColor:Constant.orangeColor, width:Constant.screenWidth/5,
                    alignSelf:'center',borderRadius:20, height:4, marginBottom:13}}/>
            </View>

        );
    }
};

