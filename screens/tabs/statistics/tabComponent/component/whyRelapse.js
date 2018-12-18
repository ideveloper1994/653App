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

export default  class WhyRelapseComponent extends React.PureComponent {

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
                <TitleComponent title="Why I Relapse" color={appColor.defaultFont}/>
                <View style={ styles.outerView }>
                    {
                        this.props.whyIRelapse.map((obj,index) => {
                            if(index<7)
                            return <SubCellComponent title={obj.key}
                                                     progressVal = {obj.total}
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
                <RelapseTamperedComponent isRemoveTempted={this.props.isRemoveTempted}
                                          appTheme={this.props.appTheme}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:40,
        // backgroundColor:'black'
    },
    outerView:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',

        width:'85%',
        // backgroundColor:'pink'
    }
});