import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    FlatList, BackHandler
} from 'react-native';
import Constant from '../../../../../helper/constant';
import { getSmallAvatar } from '../../../../../helper/appHelper';
import NavigationBar from '../../../../commonComponent/navBar';
import { connect } from 'react-redux';
import AdviceRow from './adviceRow';
import _ from 'lodash';
import {removeSafeArea} from "../../../../../actions/userActions";
import NoAdviceData from './adviceNotFound';

class SavedAdvice extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            savedAdvice: props.adviceList || []
        };
    }
    // user.has_hearted
    componentWillMount() {
        let savedAdvice = _.filter(this.props.adviceList, ({ user }) => user.has_hearted );
        this.setState({
            savedAdvice:savedAdvice
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.onBackButtonPress();
        return true;
    };
    componentWillUnmount(){
        this.props.removeSafeArea(true);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onBackButtonPress = () => {
        this.props.removeSafeArea(true);
        this.props.navigation.goBack();
    };

    getAvatarImage = (avatar_id, isCurrentUser) => {
        if(isCurrentUser){
            return getSmallAvatar(this.props.avatar_id || 0);
        }
        return getSmallAvatar(avatar_id || 0);
    };

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar onBackButtonPress={ this.onBackButtonPress }
                               title="Saved advice"
                               top={this.props.safeAreaInsetsData.top}
                               isRightButton={false}/>

                {
                    (this.state.savedAdvice.length > 0) &&
                    <FlatList showsVerticalScrollIndicator={false}
                              removeClippedSubviews={false}
                              data={this.state.savedAdvice}
                              automaticallyAdjustContentInsets={false}
                              contentInset={{bottom:50,top:0}}
                              renderItem={({item, index}) =>
                      <AdviceRow text = { item.content || "" }
                                 index={index}
                                 avtarImage = {this.getAvatarImage(item.creator.avatar_id, item.creator.is_current_user)}
                                 avtarName = { (item.creator.is_current_user) ? "You" : item.creator.name }
                                 key = { item.id }
                                 id = {item.id}/>
                    }/>
                    ||
                    <NoAdviceData/>
                }

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constant.grayBackground
    },
});

const mapStateToProps = state => {
    return {
        adviceList: state.advice.adviceList,
        safeAreaInsetsData:state.user.safeAreaInsetsData,
        avatar_id:state.user.userDetails.avatar_id,
    };
};

export default connect(mapStateToProps, {
    removeSafeArea
})(SavedAdvice);
