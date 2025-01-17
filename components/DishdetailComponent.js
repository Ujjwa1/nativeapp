import React, {Component} from 'react';
import { View, Text,ScrollView, FlatList, Modal, StyleSheet,  Share } from 'react-native';
import { Card, Icon, Rating, Input, Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, addComment, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    addComment:(dishId, rating, comment, author) =>dispatch(addComment(dishId, rating, comment, author)),
    postComment:(dishId, rating, comment, author) => dispatch(postComment(dishId, rating, comment, author))
});


function RenderDish(props) {
    const dish = props.dish;

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }

    if( dish != null){
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={200}>
             <Card 
             featuredTitle={dish.name}
             image={{uri: baseUrl + dish.image}}>
               <Text style={{margin: 10}}>
                   {dish.description}
                   </Text>
                   <View style={styles.formRow}>
                      <Icon raised reverse name={props.favorite?'heart':'heart-o'} type='font-awesome' color='#f50' onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}/>
                      <Icon raised reverse name={'pencil'} type='font-awesome' color='#512DA8' onPress={() => props.onSelect()}/>
                      <Icon raised reverse name={'share'} type='font-awesome' color='#51D2A8' onPress={() => shareDish(dish.name, dish.description, baseUrl+dish.image)}/>
                    </View>
             </Card>
            </Animatable.View>
        );
    }
    else{return(<View></View>)
}
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item,index}) => {
         return (
             <View key={index} style={{margin: 10}}>
                 <Text style={{fontSize: 14}}>{item.comment}</Text>
                 <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                 <Text style={{fontSize: 12}}>{'-- ' + item.author +', ' + item.date}</Text>
             </View>
         );  
    }

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={200}>
        <Card title="Comments">
            <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()} />
        </Card>
        </Animatable.View>
    )
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            author: '',
            comment: '',
            showModal: false
        }
    }


    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    handleComments(dishId) {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(dishId, this.state.rating, this.state.comment, this.state.author);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render(){
        const dishId = this.props.navigation.getParam('dishId','');

        return(
              <ScrollView>
                 <RenderDish dish={this.props.dishes.dishes[+dishId]}
                             favorite={this.props.favorites.some(el => el === dishId)}
                             onPress={() => this.markFavorite(dishId)} 
                             onSelect = {() => this.toggleModal()}/>
                 <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}/>
                 <Modal
                  animationType={'slide'}
                  transparent={false}
                  visible={this.state.showModal}
                  onDismiss={() => {this.toggleModal()}}
                  onRequestClose={() => {this.toggleModal()}}>
                  <View style={styles.modal}>
                     <View>
                        <Rating type="star"
                                fractions = { 0 }
                                startingValue = { 0 }
                                imageSize = { 38 }
                                onFinishRating = { rating => this.setState({ rating: rating })}
                                showRating/>
                      </View>
                      <View style={ styles.modalText }>
                        <Input  placeholder = 'Author'
                                leftIcon={
                                    <Icon name = 'user-o' type = 'font-awesome' size = { 24 }/>
                                }
                                onChangeText = { author => this.setState({ author })}/>
                     </View>
                     <View style={ styles.modalText }>
                        <Input  placeholder = 'Comment'
                                leftIcon={
                                    <Icon name = 'comment-o' type = 'font-awesome' size = { 24 }/>
                                }
                                onChangeText = { comment => this.setState({ comment })}/>
                      </View>
                      <View style={ styles.modalText }>
                        <Button
                          onPress={() => {this.handleComments(dishId)}}
                          color='#512DA8'
                          title='Submit'
                        />
                      </View>
                      <View style={ styles.modalText }>
                        <Button
                          onPress={() => {this.toggleModal();}}
                          color='#984500'
                          title='Close'
                        />
                     </View>
                   </View>
                </Modal>
              </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 28
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 14,
        margin: 10
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);
