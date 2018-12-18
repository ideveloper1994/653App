import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../helper/constant';
import * as Animatable from 'react-native-animatable';
import Button from '../../../commonComponent/button';
import SymptopmsComp from '../components/symptoms/symptomsList';
import NavigationTitleBar from '../../../commonComponent/navTitleBar';

class Symptoms extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            symptoms: [],
            topText: "From your test results, excessive porn use is likely having a negative impact on you psychologically."
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('isIntroQuizSkip').then((isSkipped)=>{
            if(isSkipped) {
                if(isSkipped === "true") {
                    this.setState({
                        topText: "Excessive porn use is likely having a negative impact on you psychologically."
                    })
                }
            }
        });
    }

    componentDidMount() {
        this.refs.mainView.fadeIn(400);
        this.getSymptoms()
    }

    getSymptoms = () => {
        let symptomList = [{description: 'Tiredness and lethargy', isChecked: false},
            {description: 'Feeling unmotivated', isChecked: false},
            {description: 'Less attraction to and from real women', isChecked: false},
            {description: 'Reduced desire to socialize', isChecked: false},
            {description: 'Using porn out of habit instead of horniness', isChecked: false},
            {description: 'Low libido or sex drive', isChecked: false},
            {description: 'General anxiety', isChecked: false},
            {description: 'Difficulty concentrating', isChecked: false},
            {description: 'Poor memory', isChecked: false},
            {description: 'Weak erections without porn', isChecked: false},
            {description: 'Lack of interest and ambition in life', isChecked: false},
            {description: 'Low self-confidence', isChecked: false},
            {description: 'Unsuccessful or unenjoyable sex', isChecked: false},
            {description: 'Feeling isolated from others', isChecked: false},
        ];

        if(this.props.gender == "female"){
            symptomList[2].description = "Less attraction to and from real men";
            symptomList[9].description = "Weak arousal without porn";
        }
        this.setState({
            symptoms: symptomList
        })
    };

    onRebootMyBrains = () => {
        this.props.navigation.navigate("introSlider");
    };

    render() {
        return (
            <Animatable.View style={styles.container} ref="mainView">
                <NavigationTitleBar
                    title="Symptoms"
                    backColor="#EC3B29"/>
                <ScrollView contentContainerStyle={{paddingBottom:50}}>
                    <View style={{width:'100%', backgroundColor:'#22526b', justifyContent:'center', alignItems:'center',
                paddingTop:32,paddingBottom:32,paddingLeft:20,paddingRight:20}}>
                        <Text  style={{color: 'white', fontSize: 14,
                        fontFamily: Constant.font500, textAlign:'center', lineHeight:20}}>
                            {this.state.topText}
                        </Text>
                        <Text  style={{color: 'white', fontSize: 16, fontFamily: Constant.font500, textAlign:'center',
                         marginTop: 15}}>
                            Select any symptoms that you recognise below.
                        </Text>
                    </View>
                    {
                        this.state.symptoms.map((symp, index) => {
                            return (
                                <SymptopmsComp key={index}
                                               description={symp.description}
                                               onSelectSymptoms={() => {}}/>
                            )
                        })
                    }
                    <Button title="Reboot My Brain"
                            backColor="#EC3B29"
                            color="#FFF"
                            onPress={this.onRebootMyBrains}/>

                </ScrollView>
            </Animatable.View>
        );
    }
}
const mapStateToProps = state => {
    return {
        gender :state.user.userDetails.gender,
    };
};

export default connect(mapStateToProps, {
})(Symptoms);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    descriptionText:{
        fontSize:17,
        color:'white',
        fontFamily: Constant.font500,
        textAlign: 'center',
        marginLeft: "10%",
        marginRight: "10%",
        lineHeight: 25
    },
    btnLogin:{
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        alignSelf: 'center',
        backgroundColor: '#FFFF',
        width: Constant.screenWidth - 60,
        alignItems: 'center',
        justifyContent: 'center',
        padding:17,
        borderRadius: 30
    },
    btnFont:{
        color: '#fbb043',
        fontSize: 17,
        fontFamily: Constant.font700,
    },
});