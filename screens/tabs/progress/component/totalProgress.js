import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
} from 'react-native';
import Constant from '../../../../helper/constant';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from 'react-redux';
import { getAvatar } from '../../../../helper/appHelper';

class UserProgress extends React.PureComponent {

    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps){
    }


    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

    onSelectImage = () => {
    };

    getAvatarImage = () => {
        return getAvatar(this.props.avatar_id, this.props.gender);
    };

    render() {
        let appColor = Constant[this.props.appTheme];
        const { profileNameStyle, otherText } = styles;
        return (
            <View style={{alignItems:'center', paddingTop: 50,backgroundColor: appColor.appBackground}}>
                <AnimatedCircularProgress style={{transform: [{ rotate: '270deg'}],
                                                    alignItems:'center',alignSelf:'center'}}
                                          size={116}
                                          width={8}
                                          fill={this.props.circularPercentage}
                                          prefill={this.props.circularPercentage}
                                          linecap={"false"}
                                          tintColor="rgb(156,239,147)"
                                          backgroundColor={appColor.circularBarOtherColor}>
                    {
                        (fill) => (
                            <View style={{ justifyContent: 'center', alignItems: 'center',
                             top:0, left:0, right:0, bottom:0,position: 'absolute',}}>
                                <View style={{position: 'absolute',
                             alignSelf:'center'}}>
                                    <TouchableHighlight onPress={()=>this.onSelectImage()}
                                                        underlayColor={Constant.transparent}>
                                        <Image resizeMode="cover"
                                               style={{height:84,
                                                        width:84,
                                                        borderRadius:42,
                                                        alignSelf:'center',
                                                        transform: [{ rotate: '90deg', }]
                                                    }}
                                               source={{uri:this.getAvatarImage()}}
                                        />
                                    </TouchableHighlight>
                                </View>
                            </View>

                        )
                    }
                </AnimatedCircularProgress>
                <Text style={[profileNameStyle, {color: appColor.defaultFont}]}>{this.props.profileName}</Text>
                <Text style={[otherText,{color: appColor.subTitile}]}>
                    Your brain is {this.props.percentage.toString()}% rewired</Text>
            </View>

        );
    }

}

const styles = StyleSheet.create({
    profileNameStyle: {
        fontSize:15,
        marginTop: 15,
        fontFamily: Constant.font500,
    },
    otherText:{
        fontSize:13,
        marginTop: 5,
        fontFamily: Constant.font500,
    }

});

const mapStateToProps = state => {
    return {
        gender:state.user.userDetails.gender,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {

})(UserProgress);