import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image
} from 'react-native';
import Constant from '../../../../helper/constant';
import { connect } from 'react-redux';
import Button from '../../../commonComponent/button';
import NotificationBox from '../../../commonComponent/notificationBox';

class ShowNotificationList extends React.PureComponent {

    constructor(props){
        super(props);
    }

    onButtonPress = () => {
        this.props.navigation.navigate("introTour");
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={{color:'#FFF',  marginTop: Constant.screenHeight*0.11, fontSize: 18, fontFamily: Constant.font300}}>
                    Other notifications
                </Text>

                <View style={{flexDirection:'row', top: Constant.screenHeight*0.18-5, position: 'absolute',
                alignItems: 'center'}}>
                    <Text style={{color:'#a3b0b6', fontSize: 15, fontFamily: Constant.font500, textAlign:'center',lineHeight:22}}>
                        {"You can modify these at any time in the\nsettings menu."}
                    </Text>
                </View>

                <View style={{ top: Constant.screenHeight*0.32, position: 'absolute',
                alignItems: 'center', width:"90%", maxWidth: 334}}>
                    <NotificationBox title="Streak notifications"
                                     description={"Streak goal achieved. Congratulations on 7 days clean."}/>
                </View>

                <View style={{ top: Constant.screenHeight*0.55, position: 'absolute',
                alignItems: 'center', width:"90%", maxWidth: 334}}>
                    <NotificationBox title="Morning motivation"
                                     description={"Good morning "+ this.props.userName +"! 'Tough times don't last. Tough people do'."}/>
                </View>

                <View style={{top:Constant.screenHeight*0.85-5, left:0, right:0, bottom:0,
                     position: 'absolute'}}>
                    <Button title="Continue"
                            backColor="rgb(118,192,187)"
                            color="#FFF"
                            onPress={this.onButtonPress}
                            otherStyle={{marginTop:0, width:"80%", height:60}}
                            otherTextStyle={{
                                    fontSize: 16,
                                    fontFamily: Constant.font700}}/>


                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.backColor,
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        userName: state.user.userDetails.name || ""
    };
};

export default connect(mapStateToProps, {
})(ShowNotificationList);