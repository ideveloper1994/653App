import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../../../helper/constant';
import TitleComponent from '../../../../commonComponent/subTitle';
import CleanDaySubComponent from '../../../../commonComponent/progressBarVer';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment'

const months=["J","F","M","A","M","J","J","A","S","O","N","D"];

export default  class CleanDaysComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        let allKeys = Object.keys(this.props.clean_days_per_month);
        this.state = {
            arrYears: allKeys,
            objCleanDays: (allKeys.length == 0) ? {} : this.props.clean_days_per_month[allKeys[allKeys.length - 1]],
            selectedIndex: allKeys.length - 1,
            selectedYear: allKeys[allKeys.length - 1],
            currentSelectedItem:15
        };
    }
    componentWillReceiveProps(next){
        let allKeys = Object.keys(next.clean_days_per_month);
        this.setState ({
            arrYears: allKeys,
            objCleanDays: (allKeys.length == 0) ? {} : next.clean_days_per_month[allKeys[allKeys.length - 1]],
            selectedIndex: allKeys.length - 1,
            selectedYear: allKeys[allKeys.length - 1]
        });
    }
    onLeftBtnPress = () => {
        if(this.state.objCleanDays.hasPrev) {
            let selectedIndex = this.state.selectedIndex;
            this.setState({
                objCleanDays: this.props.clean_days_per_month[this.state.arrYears[selectedIndex - 1]],
                selectedIndex: selectedIndex - 1,
                selectedYear: this.state.arrYears[selectedIndex - 1]
            })
        }
    };

    onRightBtnPress = () => {
        if(this.state.objCleanDays.hasNext) {
            let selectedIndex = this.state.selectedIndex;
            this.setState({
                objCleanDays: this.props.clean_days_per_month[this.state.arrYears[selectedIndex + 1]],
                selectedIndex: selectedIndex + 1,
                selectedYear: this.state.arrYears[selectedIndex + 1]
            })
        }
    };

    barClicked = (selectedindex) => {
        this.setState({
            currentSelectedItem:selectedindex
        });
    };

    render() {

        let cleanDays = "Clean Days in " ;
        let daycal = (this.state.selectedYear) ? this.state.selectedYear : moment().format('YYYY');
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];

        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <TouchableHighlight style={[styles.leftRightView, {opacity: (this.state.objCleanDays.hasPrev) ? 1 : 0}]}
                                        underlayColor={Constant.transparent}
                                        onPress={() => this.onLeftBtnPress()}>
                        <Entypo name={'triangle-left'}
                                size={30}
                                color={appColor.arrowColor}/>
                    </TouchableHighlight>
                    <View style={styles.titleView}>
                        <TitleComponent title={cleanDays + daycal} color={appColor.defaultFont}/>
                    </View>
                    <TouchableHighlight style={[styles.leftRightView, {opacity: (this.state.objCleanDays.hasNext) ? 1 : 0}]}
                                        underlayColor={Constant.transparent}
                                        onPress={() => this.onRightBtnPress()}>
                        <Entypo name={'triangle-right'}
                                size={30}
                                color={appColor.arrowColor}/>
                    </TouchableHighlight>
                </View>
                <View style={styles.outerView}>
                    {(this.state.objCleanDays.monthArr)?this.state.objCleanDays.monthArr.map((objVal,index)=>{
                            return <CleanDaySubComponent title={months[index]}
                                                         progressVal={objVal}
                                                         progressbarTintColor={Constant.verColor}
                                                         barClicked={this.barClicked}
                                                         progressbarBackColor={appColor.verProgressbarBack}
                                                         selectedindex={this.state.currentSelectedItem}
                                                         currentIndex={index}
                                                         appTheme={this.props.appTheme}
                                                         key={index}/>}):
                        months.map((objVal,index)=>{
                            return <CleanDaySubComponent title={months[index]}
                                                         progressVal={0}
                                                         progressbarTintColor={Constant.verColor}
                                                         barClicked={this.barClicked}
                                                         progressbarBackColor={appColor.verProgressbarBack}
                                                         selectedindex={this.state.currentSelectedItem}
                                                         currentIndex={index}
                                                         appTheme={this.props.appTheme}
                                                         key={index}/>})
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    outerView:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
        width:'86.7%',
    },
    topView:{
        flexDirection: 'row',
        paddingTop:40,
        paddingBottom:20,
        alignSelf:'center',
        alignItems: 'center',
        justifyContent:'center',

    },
    titleView:{
        flex:1,
        alignSelf:'center',

    },
    leftRightView: {
        paddingLeft: 20,
        paddingRight: 20
    }
});