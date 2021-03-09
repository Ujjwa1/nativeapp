import React, { Component }from 'react';
import { View, FlatList, Text, TouchableOpacity, Animated } from 'react-native';
import  { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import { deleteFavorite } from '../redux/ActionCreator';
import Swipeable from 'react-native-gesture-handler/Swipeable';


const mapStateToProps = state => {
    return{
        dishes: state.dishes,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
})

class Favorites extends Component{

    render(){
        const { navigate } = this.props.navigation;
        const renderMenuItem = ({item, index}) => {
            const rightButton = (progress, dragX) => {
                const scale = dragX.interpolate({
                    inputRange: [-100, 0],
                    outputRange: [0.7, 0]
                })
                return(
                    <>
                        <TouchableOpacity onPress={() => this.props.deleteFavorite(item.id)}>
                            <View style={{flex:1, backgroundColor: 'red', justifyContent: 'center'}}>
                                <Animated.Text style={{color: 'white', paddingHorizontal: 10,
                                        fontWeight:'600', transform: [{scale}]}}>
                                            Delete
                                </Animated.Text>
                            </View>
                        </TouchableOpacity>
                    </>
                );
            }
            return(
                <Swipeable renderRightActions={rightButton}>
                <ListItem key={index} title={item.name} subtitle={item.description}
                    hideChevron={true} onPress={() => navigate('DishDetail', {dishId: item.id})}
                    leftAvatar={{source: {uri: baseUrl + item.image}}}>

                </ListItem>
                </Swipeable>
            );
        }
        
        if(this.props.dishes.isLoading){
            return(
                <Loading/>
            );
        }else if(this.props.dishes.errMess){
            return(
                <View>
                    <Text>{this.props.dishes.errMess}</Text>
                </View>
            );
        }else{
            return(
                <FlatList data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))}
                 renderItem={renderMenuItem} keyExtractor={item => item.id.toString()}></FlatList>
                );
        }
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);