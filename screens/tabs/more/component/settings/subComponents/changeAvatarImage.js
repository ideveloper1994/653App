import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View, Keyboard, BackHandler
} from 'react-native';
import Constant from '../../../../../../helper/constant';
import { connect } from 'react-redux';
import ChooseAvatar from '../../../../../account/welcome/components/getDetail/chooseAvatarComponent';
import Button from '../../../../../commonComponent/button';
import { updateUserDetail } from '../../../../../../actions/userActions';
import AppStatusBar from '../../../../../commonComponent/statusBar';

class ChangeAvatarImage extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            avatar_id: props.userDetails.avatar_id
        };
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };

    onBackButtonPress = () => {
        this.props.navigation.goBack();
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onFinish = () => {
        let obj = this.props.userDetails;
        if(obj.avatar_id !== this.state.avatar_id){
            obj.avatar_id = this.state.avatar_id;
            this.props.updateUserDetail(obj);
        }
        this.props.navigation.goBack();
    };

    setSelectedAvatarImage = (avatarId) => {
        this.setState({
            avatar_id: avatarId
        });
    };

    render() {
        let appColor = this.props.appTheme && Constant[this.props.appTheme] || Constant[Constant.darkTheme];
        return (
            <View style={styles.container}>
                <AppStatusBar barStyle={appColor.statusBarStyle}
                              backColor={'rgb(22,93,120)'}/>
                <View style={styles.titleView}>
                    <Text style={styles.topTitleText}>
                        {"Customize"}
                    </Text>
                    <Text style={styles.subTitle}>
                        {"Finally, choose your avatar."}
                    </Text>
                </View>
                <View style={{position: 'absolute', top:Constant.screenHeight*0.36 - 10,
                bottom: 0, width: "100%", alignSelf: 'center'}}>
                    <ChooseAvatar setSelectedAvatarImage={this.setSelectedAvatarImage}
                                  selectedAvatarId={this.state.avatar_id}
                    />
                </View>

                <View style={{top: Constant.screenHeight*0.83-3,
                            left:0, right:0,
                            alignSelf: 'center',
                            position:'absolute',
                            justifyContent:'center',
                            alignItems: 'center'}}>
                    <Button title={"Confirm"}
                            backColor="#FFF"
                            color="rgb(22,93,120)"
                            otherStyle={{margin:0,marginTop:0, height:60, width:"80%"}}
                            otherTextStyle={{fontFamily: Constant.font700}}
                            onPress={this.onFinish}/>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgb(22,93,120)',
    },
    titleView:{
        top: Constant.screenHeight*0.117-5,
        width:'80%',
        alignSelf: 'center',
        position:'absolute'
    },
    topTitleText:{
        fontSize:24,
        fontFamily: Constant.font300,
        color:'#b7bac3',
        textAlign: 'center',
    },
    subTitle:{
        fontSize:17,
        color:'#FFF',
        fontFamily: Constant.font500,
        marginTop:20,
        textAlign: 'center',
    },
});

const mapStateToProps = state => {
    return {
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        userDetails:state.user.userDetails,
        appTheme: state.user.appTheme
    };
};

export default connect(mapStateToProps, {
    updateUserDetail
})(ChangeAvatarImage);
