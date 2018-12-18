import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import Constant from '../../../../helper/constant';
import Button from '../../../commonComponent/button';
import StoryComponent from '../components/story/storyComponent';
import * as Animatable from 'react-native-animatable';
import NavigationTitleBar from '../../../commonComponent/navTitleBar';

const stories=[
    {name:'Keflex',
        stories:'My confidence seems indestructable, my composure unflappable. ' +
        'My voice seems to have permanently deepened.'},
    {name:'Carhatt',stories:'I saw near immediate changes in my physique. This may have been caused by testosterone, ' +
    'but I was putting on more muscle without trying.'},
    {name:'Anonymous',stories:"After only 11 days, I feel like a different person. I'm much more talkative and aware in " +
    "social settings. At work I'm on top of everything instead of forgetting things and asking people to repeat themselves. " +
    "It's been over a decade since I started looking at / watching porn and this feels like this is how I truly am."},
    {name:'Anonymous',stories:"I've started dating a few women (have been single for years). I am approaching women much " +
    "more easily and seem to be far more engaging. Actually, women are approaching me far more than usual."},
    {name:'DWK4',stories:"I can only think about real girls. How they look, smell, walk. My random make-out session " +
    "(see last entry) shocked me into life. I want real girls / women. My sexual future is looking infinitely more " +
    "promising than it did a mere 3 - 4 weeks ago. This is so much fun."},
    {name:'Scottie25',stories:"Since quitting, those everyday things like talking to a friend, or seeing a girls smile," +
    " have started to take on a new meaning. I want to go out, I want to socialize, I want to workout, I want to live." +
    " I haven't felt these emotions in 4 years. I was coming to grips with the fact that life is dark, boring, depressing " +
    "and then I die. Fuck that. Quitting porn has allowed me to change my mindset on the little things in life, which" +
    " in turn and in time will foster greater rewards."},
    {name:'Samonske',stories:"The clarity and lack of depression for me was extremely noticeable and you will likely " +
    "feel like a different person. It gave me some hope that there is nothing totally wrong with me. Just having that" +
    " experience of clarity and happiness can be a powerful thing."},
    {name:"Anonymous",stories:"I've also started to not give as many fucks as I used to. Cobing cardio workouts," +
    " no porn, and not giving fucks has given me a new level of resilience that I never thought possible. Some " +
    "crazy things have happened to me in the last few months that a lesser version of me would have imploded."},
    {name:"Anonymous",stories:"At work, there are girls that I would consider to be out of my league that are" +
    " now looking at me. I know this because I am looking back at them and not shying away so" +
    " I am actually noticing them for the first time."},
    {name:"Anonymous",stories:"I think most people's favorite superpower when doing no porn is either confidence, " +
    "full erections or less social anxiety. Mine has to be not being drowsy every morning. Before no porn " +
    "I heard people say that having a wank makes sleeping easier, then I would wake up drowsy after 6 -" +
    " 7 hours and driving to uni with a can of red bull was the norm. Now with the same amount of sleep (if not less)" +
    " I am waking up wide awake and being a lot happier during the day."},
    {name:"Anonymous",stories:"Since stopping porn, I have noticed that I have become far more aware of my desire " +
    "for affection and love increasing and the best part is, I also have a girlfriend to do that with. I often felt " +
    "in the past as well like I was missing something that other guys had. It was confidence, but not just " +
    "because they had sex and relationships and I hadn't. I couldn't put my finger on it but I think I now have the answer."},
    {name:"Doodson",stories:"Deeper voice and more muscle mass. That's self explanatory. Testosterone doesn't get wasted" +
    " down the drain so it can be used for something more useful like defining your manhood through physiology."},
    {name:"Anonymous",stories:"Confidence. When I walk down the street I don't feel uncomfortable anymore. I can speak " +
    "to anyone, girls too without feeling shy and stuttering. It's not that I became arrogant, I just regard myself on equal " +
    "footing with others whereas before I always felt inferior. Social anxiety completely flew out the window."},
    {name:"Moonie91",stories:"I'm over a month now and I feel so much better. Sometimes when I go to bed now, " +
    "I remember how tired I was and how much pain I was in after my porn binges. It brings a huge smile to my face " +
    "that I can go to bed pain free. It must seem so pathetic to people who have never experienced this."},
    {name:"Anonymous",stories:"Now I am controlled, stable, focused, super confident and have a very sharp mind." +
    " And this is only 22 days. When you save your energy up, you get that unconquerable will where what would have " +
    "been huge walls in your past become little knee-high fences you can step over."},
];

export default  class Stories extends React.PureComponent {

    onAchievementPress = () => {
        //this.props.navigator.replace(Router.getRoute('achievement'));
        this.props.navigation.navigate('achievement');
    };

    componentDidMount(){
        if(this.refs.mainView){
            this.refs.mainView.fadeIn(400);
        }
    }

    render() {
        return (
            <Animatable.View style={styles.container} ref="mainView">
                <NavigationTitleBar
                    title="Rebooting Benefits"
                    backColor="#fbb043"/>
                <ScrollView contentContainerStyle={{paddingBottom:50}}>
                    {
                        stories.map((story)=> {
                            return  <StoryComponent name={story.name}
                                                    content={story.stories}
                                                    key={story.name}/>
                        })
                    }
                    <Button title="Your Achievements"
                            onPress={this.onAchievementPress}
                            backColor="#fbb043"
                            color='white'
                            otherStyle={{width:'80%'}}
                            otherTextStyle={{
                                    fontSize: 16,
                                    fontFamily: Constant.font700}}/>

                </ScrollView>
            </Animatable.View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFF'
    }
});