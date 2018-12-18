import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import Constant from '../../../../../helper/constant';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {getAvatar} from '../../../../../helper/appHelper';

let avatarImagesMale = [0,1,6,11,16,21,26,31,36,41,0];

let avatarImagesFemale = [0,46,51,56,61,66,71,76,81,86,0];

let imageViewHeight = Constant.screenWidth/3;

class ChooseAvatar extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedSkinColor: 0,
            arrImages: [],
            selectedImageId: 1,
            selectedIndex: 1,
            imageArrType: props.gender == "male" && avatarImagesMale || avatarImagesFemale,
            gender: props.gender
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        if(this.props.selectedAvatarId) {
            let avatarId = this.props.selectedAvatarId;
            let selectedColor = (avatarId%5) - 1;
            if(selectedColor < 0){
                selectedColor = 4;
            }
            let key = avatarId - selectedColor;
            let index = avatarImagesMale.indexOf(key);
            if(this.props.gender.includes("female")){
                index = avatarImagesFemale.indexOf(key);
            }
            if(index>=0){
                let offset = imageViewHeight*(index-1);
                this.refs.imgList.scrollTo({x: offset, y: 0, animated: true});
                this.setState({
                    selectedSkinColor: selectedColor,
                    selectedImageId: avatarId,
                    selectedIndex: index,
                });
            }
        }

    }

    componentWillReceiveProps (nextProps){
        if(this.state.gender != nextProps.gender){
            if(nextProps.gender.includes("female")){
                this.setState({
                    imageArrType: avatarImagesFemale
                });
            }else{
                this.setState({
                    imageArrType: avatarImagesMale
                });
            }
        }
    }


    onPressChangeColor = (colorCode) => {
        this.setState({
            selectedSkinColor:colorCode
        });
        let selectedId = this.state.imageArrType[this.state.selectedIndex] + colorCode;
        this.props.setSelectedAvatarImage(selectedId);
    };

    onSwipeLeft = (gestureState) => {
        if(this.state.selectedIndex < 9){
            let index = this.state.selectedIndex + 1;
            let offset = imageViewHeight;
            if(index > 0){
                offset = imageViewHeight*(index-1);
            }
            this.refs.imgList.scrollTo({x: offset, y: 0, animated: true});
            this.setState({
                selectedIndex: index
            });
            let selectedId = this.state.imageArrType[index] + this.state.selectedSkinColor;
            this.props.setSelectedAvatarImage(selectedId);
        }
    };

    onSwipeRight = (gestureState) => {
        if(this.state.selectedIndex !== 1){
            let index = this.state.selectedIndex - 1;
            let offset = imageViewHeight;
            if(index > 0){
                offset = imageViewHeight*(index-1);
            }
            this.refs.imgList.scrollTo({x: offset, y: 0, animated: true});
            this.setState({
                selectedIndex: index
            });
            let selectedId = this.state.imageArrType[index] + this.state.selectedSkinColor;
            this.props.setSelectedAvatarImage(selectedId);
        }
    };

    imageClicked = (imageId,index) => {
        if(imageId !== 0){
            let offset = imageViewHeight;
            if(index > 0){
                offset = imageViewHeight*(index-1);
            }
            this.refs.imgList.scrollTo({x: offset, y: 0, animated: true});
            this.setState({
                selectedImageId:imageId,
                selectedIndex: index
            });
            let selectedId = this.state.imageArrType[index] + this.state.selectedSkinColor;
            this.props.setSelectedAvatarImage(selectedId);

        }
    };

    renderAvatarImage = (id) => {
        let imageId = id+this.state.selectedSkinColor;
        return getAvatar(imageId, this.props.gender);
    };

    render() {
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50
        };
        return (
            <View style={styles.container}>
                <GestureRecognizer
                    onSwipeLeft={(state) => this.onSwipeLeft(state)}
                    onSwipeRight={(state) => this.onSwipeRight(state)}
                    config={config}>
                    <View>
                        <ScrollView horizontal={true}
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    ref="imgList">
                            {
                                this.state.imageArrType.map((id,index) => {
                                    return (
                                        <TouchableHighlight underlayColor={Constant.transparent}
                                                            onPress={() => this.imageClicked(id,index)}
                                                            key={index}
                                                            style={{height:imageViewHeight,
                                                            width: imageViewHeight,
                                                            justifyContent:'center',alignItems:'center'}}>
                                            {
                                                !(id === 0)&&
                                                <Image style={{height:90,width:90,alignSelf:'center', opacity: (this.state.selectedIndex == index) ? 1 : 0.3}}
                                                       source={{uri:this.renderAvatarImage(id)}}
                                                       resizeMode={'contain'}
                                                />
                                                ||
                                                <View/>
                                            }
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </GestureRecognizer>

                <View style={styles.skinOuter}>
                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={()=> this.onPressChangeColor(0)}
                                        style={[styles.skinView,{borderColor: (this.state.selectedSkinColor === 0)?
                                        "rgb(158,243,148)":Constant.transparent}]}>
                        <View style={{borderRadius:19,height:38,width:38,backgroundColor:'#3b3b37'}}/>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={()=> this.onPressChangeColor(1)}
                                        style={[styles.skinView,{borderColor: (this.state.selectedSkinColor === 1)?
                                         "rgb(158,243,148)":Constant.transparent}]}>
                        <View style={{borderRadius:19,height:38,width:38,backgroundColor:'#b47029'}}/>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={()=> this.onPressChangeColor(2)}
                                        style={[styles.skinView,{borderColor: (this.state.selectedSkinColor === 2)?
                                        "rgb(158,243,148)":Constant.transparent}]}>
                        <View style={{borderRadius:19,height:38,width:38,backgroundColor:'#fff1bf'}}/>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={()=> this.onPressChangeColor(3)}
                                        style={[styles.skinView,{borderColor: (this.state.selectedSkinColor === 3)?
                                         "rgb(158,243,148)":Constant.transparent}]}>
                        <View style={[styles.innerSkinView,{backgroundColor:'#5c5c51'}]}/>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor={Constant.transparent}
                                        onPress={()=> this.onPressChangeColor(4)}
                                        style={[styles.skinView,{borderColor: (this.state.selectedSkinColor === 4)?
                                         "rgb(158,243,148)":Constant.transparent}]}>
                        <View style={[styles.innerSkinView,{backgroundColor:'#f9c06d'}]}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'transparent',
    },
    outerView:{
        height: Constant.screenHeight,
        width: Constant.screenWidth
    },
    skinOuter: {
        width:"80%",
        marginTop:Constant.screenHeight*0.05 - 5,
        flexDirection:'row',
        alignSelf:'center',
        justifyContent:'space-between'
    },
    skinView:{
        alignItems:'center',
        justifyContent:'center',
        height:50,
        width: 50,
        borderRadius:25,
        borderWidth:2
    },
    innerSkinView: {
        borderRadius:19,
        height:38,
        width:38}

});

const mapStateToProps = state => {
    return {
        gender:state.user.userDetails.gender,

    };
};

export default connect(mapStateToProps, {

})(ChooseAvatar);

// let SelectedId = avatarImagesMale[index] + this.state.selectedSkinColor
// alert(SelectedId);