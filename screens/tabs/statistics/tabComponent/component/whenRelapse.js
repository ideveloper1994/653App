import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constant from '../../../../../helper/constant';
import TitleComponent from '../../../../commonComponent/subTitle';
import RelapseTamperedComponent from '../subcomponents/relapseTampered';
import SubCellComponent from '../../../../commonComponent/progressBarVer';

export default  class WhenRelapseComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentSelectedItem:15
        };
    }

    barClicked = (selectedindex) => {
        this.setState({
            currentSelectedItem:selectedindex
        });
    };

    render() {

        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
        <View style={styles.container}>
            <TitleComponent title="When I Relapse" color={appColor.defaultFont}/>
            <View style={ styles.outerView }>
                {
                    Object.keys(this.props.whenIRelapse).map((obj,index) => {
                        return <SubCellComponent title={obj}
                                                 progressVal = {this.props.whenIRelapse[obj]}
                                                 progressbarTintColor={Constant.verOrangeColor}
                                                 key={index}
                                                 barClicked={this.barClicked}
                                                 selectedindex={this.state.currentSelectedItem}
                                                 currentIndex={index}
                                                 appTheme={this.props.appTheme}
                                                 progressbarBackColor={appColor.verProgressbarOrangeBack}/>
                    })
                }
            </View>
            <RelapseTamperedComponent appTheme={this.props.appTheme}/>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:40,
    },
    outerView:{
        flexDirection:'row',
        justifyContent:'center',
        width:'72%',
        alignSelf:'center'
    }
});