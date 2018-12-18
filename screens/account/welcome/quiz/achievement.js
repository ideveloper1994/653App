import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
} from 'react-native';
import Constant from '../../../../helper/constant';
import AchievementComponent from '../components/achievements/achievementComponent';
import Button from '../../../commonComponent/button';
import * as Animatable from 'react-native-animatable';
import NavigationTitleBar from '../../../commonComponent/navTitleBar';
import {manageMonthlyChallengePopup, manageRewiringPopup} from "../../../../actions/userActions";
import {calculateRewiringProgress} from "../../../../actions/metadataActions";
import {connect} from "react-redux";
import {calculationYellowAchievements} from "../../../../actions/statisticAction";
import {getSexualityTitle} from "../../../../helper/appHelper";
import {cloneDeep} from 'lodash'

const Data = [
    {
        image : {uri: 'improvement_tour_confidence'},
        title:'Improved self-confidence'
    },
    {
        image : {uri: 'improvement_tour_health'},
        title:"Healthier appearance"
    },
    {
        image : {uri: 'improvement_tour_voice'},
        title:"Stronger voice"
    },
    {
        image : {uri: 'improvement_tour_mind'},
        title:"Sharper mind and memory"
    },
    {
        image : {uri: 'improvement_tour_sleep'},
        title:"Improved sleeping habits"
    },
    {
        image : {uri: 'improvement_tour_energy'},
        title:"More energy and motivation"
    },
    {
        image : {uri: 'improvement_tour_alive'},
        title:"Improved libido and sex life"
    },
    {
        image : {uri: 'improvement_tour_attraction'},
        title:"More attention from women"
    }
];

class Achievement extends React.PureComponent {

    constructor(props){
        super(props);
        this.state={
            data: Data
        }
    }

    onAchievementPress = () => {
        //this.props.navigator.replace(Router.getRoute("getStarted"));
        this.props.navigation.navigate("getStarted", {nextPage: "signUp"});
    };

    componentDidMount(){
        let title = getSexualityTitle(this.props.userDetails)
        let data = cloneDeep(this.state.data);
        data[7].title = title;
        this.setState({data:data})

        this.refs.mainView.fadeIn(400);
    }

    render() {


        return (
            <Animatable.View style={styles.container} ref="mainView">
                <NavigationTitleBar
                    title="Achievements"
                    backColor="#fbb043"/>

                <ScrollView style={{flex:1}}  contentContainerStyle={{paddingBottom:50}}>
                    <View style={{backgroundColor:'#22526b',paddingTop:33,paddingBottom:33,alignItems:'center'}}>
                        <View style={{width:'80%',alignItems:'center'}}>
                            <Text style={{color:'#d7e1e8',
                            fontSize:15,textAlign:'center',
                            fontFamily: Constant.font500,}}>
                                From your results, we’ve created 8
                                 achievements for you to unlock during your reboot.
                            </Text>
                        </View>
                    </View>
                    {
                        this.state.data.map((obj)=>{
                            return <AchievementComponent image={obj.image}
                                                         title={obj.title}
                                                         key={obj.title}
                            />
                        })
                    }
                    <Button title="Get Started"
                            onPress={this.onAchievementPress}
                            backColor="#fbb043"
                            color='white'/>

                </ScrollView>
            </Animatable.View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFF'
    },
});


const mapStateToProps = state => {
    return {
        userDetails:state.user.userDetails,
    };
};

export default connect(mapStateToProps, {
})(Achievement);
