import React from 'react';
import { View, KeyboardAvoidingView, Image, ScrollView, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Header, Divider } from 'react-native-elements';
import { Constants, Location, Permissions, Contacts } from 'expo';
import { CreatCircle } from '../../Store/actions/authAction'
class AddCircle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: "",
        };
    }
    componentDidMount() {
        const { user } = this.props
        console.log(user, 'current')
    }
  
    back = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' }),
            ]
        })
        this.props.navigation.dispatch(resetAction)

    }
    ID() {
        return (Math.random().toString(36).substr(2, 6)).toUpperCase();
    };
    Send = () => {
        const { circle } = this.state
        const { user } = this.props
        const userUid = user.UID
        const text = circle

        var obj = {
            circleName: text,
            joinCode: this.ID(),
            members: [],
            userUid,
        }
        if (text) {
            const circle = obj
            this.props.Circle(circle)
            // alert('please Enter a Name')

            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                ]
            })
            this.props.navigation.dispatch(resetAction)
        } else {
            alert('please Enter a Name')

        }

    }




    static navigationOptions = { header: null }
    render() {
        const { circle } = this.state;

        return (
            <ScrollView>
                <KeyboardAvoidingView behavior="position" enabled>
                    <View style={styles.statusBar} />
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <Header
                            containerStyle={{
                                backgroundColor: '#ffff',
                                justifyContent: 'space-around',

                            }}
                            leftComponent={{ icon: 'arrow-back', onPress: () => this.back() }}
                            centerComponent={{ text: 'Creat a Circle', style: { color: 'black', fontSize: 20 } }}
                        />

                        <View >
                            <View style={{ padding: 20 }}>

                                <Text style={{ color: 'black', fontSize: 20 }}>Enter Your Circle Name:</Text>
                            </View>
                            <View style={{ padding: 20 }}>

                                <Input
                                    placeholder='     Enter Circle Name'
                                    onChangeText={(e) => this.setState({ circle: e })}
                                />
                            </View>

                        </View>
                        <View style={{ marginTop: 30, width: 200, borderRadius: 30 }}  >

                            <Button
                                onPress={this.Send}
                                title="Creat"
                                type="outline"
                                color="pink"
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#7FB3D5',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 20,
        // opacity:0.9
    },
    statusBar: {
        backgroundColor: "#075e54",
        height: Constants.statusBarHeight,
    },

});

function mapStateToProp(state) {
    return ({
        user: state.authReducers.USER
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        Circle: (circle) => {
            dispatch(CreatCircle(circle))
        },
    })
}

export default connect(mapStateToProp, mapDispatchToProp)(AddCircle);
