import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../../helper/constant';
import RoutineListItem from '../subComponent/routineListItem';
import RoutineHeader from '../subComponent/routineHeader';

export default  class RoutineComponent extends React.PureComponent {

    render() {
        let appColor = Constant[this.props.appTheme];
        return(
            <View style={[styles.container, {paddingBottom: (this.props.TodayItemList &&
             this.props.TodayItemList.length !== 0) ? 16 : 0, backgroundColor: appColor.cardSubSection},
                Constant.screenWidth>600 && {maxWidth: 600, width:'100%', alignSelf:'center',overflow: 'hidden'}]}>
                <RoutineHeader title={this.props.title}
                               desc={this.props.desc} Icon={this.props.Icon}
                               isIcon={this.props.isIcon}
                               onSelectExercises={this.props.onSelectExercises}
                               isActiveDot={this.isActiveDot(this.props.pageName)}
                               pageName={this.props.pageName}
                               appTheme={this.props.appTheme}
                />
                {
                    (this.props.TodayItemList)?this.props.TodayItemList.map((obj, index)=>{
                            return(
                                <RoutineListItem icon={obj.icon}
                                                 name={obj.name}
                                                 isActiveDot={this.isActiveDot(obj.pageName)}
                                                 onSelectExercises={this.props.onSelectExercises}
                                                 pageName={obj.pageName}
                                                 appTheme={this.props.appTheme}
                                                 key={index}/>
                            )})
                        :<View />
                }
            </View>
        );
    }

    isActiveDot = (pageName) => {
        let today = new Date().toDateString();
        let objIndex = this.props.completedExercises.exercises.indexOf(pageName);
        //return objIndex < 0 && this.props.completedExercises.date == today;
        if(objIndex >= 0 && this.props.completedExercises.date === today) {
            return false;
        }
        return true;
    };
}


const styles = StyleSheet.create({
    container:{
        overflow: 'hidden',
        marginTop: 10,
        marginLeft:20,
        marginRight:20,
        borderRadius:13,
        backgroundColor: '#386980'//Constant.transparentBackColor
    },
});

//<View style={{paddingTop:8,paddingBottom:8,paddingLeft:16,paddingRight:16}}>