import React, { Component } from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';
import moment from 'moment'

class CalendarHeader extends Component {
    static propTypes = {
        theme: PropTypes.object,
        hideArrows: PropTypes.bool,
        month: PropTypes.instanceOf(XDate),
        addMonth: PropTypes.func,
        showIndicator: PropTypes.bool,
        firstDay: PropTypes.number,
        renderArrow: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.style = styleConstructor(props.theme);
        this.addMonth = this.addMonth.bind(this);
        this.substractMonth = this.substractMonth.bind(this);
    }

    addMonth() {
        this.props.addMonth(1);
    }

    substractMonth() {
        this.props.addMonth(-1);
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.month.toString('yyyy MM') !==
            this.props.month.toString('yyyy MM')
        ) {
            return true;
        }
        if (nextProps.showIndicator !== this.props.showIndicator) {
            return true;
        }
        return false;
    }

    render() {
        let leftArrow = <View />;
        let rightArrow = <View />;
        let weekDaysNames = weekDayNames(this.props.firstDay);
        let currentDate = (moment().month()+"-"+moment().year());
        let compareDate = new Date(this.props.month).getMonth()+"-"+new Date(this.props.month).getFullYear()
        if (!this.props.hideArrows) {
            leftArrow = (
                <TouchableOpacity
                    onPress={this.substractMonth}>
                    {this.props.renderArrow
                        ? this.props.renderArrow('left')
                        : <Image
                            source={require('../img/previous.png')}
                            style={this.style.arrowImage}
                        />}
                </TouchableOpacity>
            );
            rightArrow = (
                <TouchableOpacity onPress={this.addMonth}>
                    {this.props.renderArrow
                        ? this.props.renderArrow('right')
                        : <Image
                            source={require('../img/next.png')}
                            style={this.style.arrowImage}
                        />}
                </TouchableOpacity>
            );
        }
        let indicator;
        if (this.props.showIndicator) {
            indicator = <ActivityIndicator />;
        }
        return (
            <View>
                <View style={this.style.header}>
                    {leftArrow}
                    <View style={{ flexDirection: 'row'}}>
                        <View>
                            <Text style={[{textAlign:'center',fontSize:16,marginTop:20},this.style.yearText]}>
                                {this.props.month.toString(this.props.monthFormat ? 'yyyy' : 'yyyy')}
                            </Text>
                            <Text style={[this.style.monthText,{textAlign:'center',marginTop:10,
                                marginBottom:44,}]}>
                                {this.props.month.toString(this.props.monthFormat ? 'MMMM' : 'MMMM yyyy')}
                            </Text>
                        </View>
                        {indicator}
                    </View>
                    {
                        (currentDate==compareDate)?
                            (this.props.isShowEdit) &&
                            <TouchableOpacity style={{width:40, height:40,
                                justifyContent:'center',opacity:1,alignItems:'flex-end'}}
                                              onPress={()=>this.props.onPressEdit()}>
                                <Text style={this.style.editButton}>EDIT</Text>
                            </TouchableOpacity>
                            ||
                            <View style={{width:40, height:40, justifyContent:'center',opacity:0}}>
                                <Text style={this.style.editButton}>EDIT</Text>
                            </View>
                            :rightArrow
                    }
                </View>

                <View style={this.style.week}>
                    {weekDaysNames.map((day, idx) =>
                        {
                            let a = day.charAt(0);
                            return(
                                <View style={{flex:1, alignItems:'center'}} key={idx}>
                                    <Text style={this.style.dayHeader}>{a}</Text>
                                </View>
                            )}
                    )}
                </View>
            </View>
        );
    }
}

export default CalendarHeader;