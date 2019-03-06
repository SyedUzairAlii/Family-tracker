import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { ImagePicker, Location, Permissions, } from 'expo'
import { connect } from 'react-redux'
import firebase from 'firebase'
import {addEmail} from '../../Store/actions/authAction'
class Request extends React.Component {
    constructor() {
        super()
        this.state = {
            number: '',
            Name: '',
            image: '',
            currentUID: '',
             email:''

        }
    }

    componentDidMount() {
        const { CurrentUser, UID,navigation,alluser } = this.props
        if(alluser){
            console.log(alluser,'alluser in add user ')
            this.setState({
                allUserEmail:alluser
            })
        }
        const Circledata = navigation.getParam('item')
        if(Circledata){
            this.setState({
                data:Circledata,
                CircleCode:Circledata.joinCode
            })
        }
        if (CurrentUser) {
            this.setState({
                Name: CurrentUser.Name,
                currentUID: UID
            })
        }
    }


    submit() {
        const { data,email } = this.state

       if(data && email){
        console.log(data, email,'22322')

this.props.Add(data, email)
       }

    }
    render() {
        const { number, CircleCode, email } = this.state

        return (
            <ScrollView>
                <KeyboardAvoidingView behavior="position" enabled>
                    <View style={styles.container}>
                        <View style={{ marginBottom: 20 }}>
                            <Image style={styles.icon} source={require("../../../assets/imag.jpg")} />

                        </View>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 20 }}>{'Code# '+CircleCode}</Text>

                        <View >
                            <View style={{ padding: 10 }}>

                                <Text style={{ color: 'black', fontSize: 20 }}>Enter Email Send Code:</Text>
                            </View>
                            <View style={{ padding: 10 }}>

                                <Input
                                    placeholder='     Enter Email'
                                    onChangeText={(e) => this.setState({ email: e })}
                                />
                            </View>

                        </View>
                      
                        <View style={{ marginTop: 42 }}>
                            <Button
                                onPress={() => this.submit()}
                                icon={
                                    <Icon
                                        name="save"
                                        size={25}
                                        color="white"
                                    />
                                }
                                title="  SEND"
                                color='blue'
                            // linearGradientProps={{
                            //     colors: ['#0f0c29', '#302b63', '#24243e'],
                            //     start: { x: 0, y: 0.5 },
                            //     end: { x: 1, y: 0.5 },
                            // }}
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        height: 200,
        width: 200,
        // borderRadius: 100,
        paddingLeft: 20,
        opacity:0.8
    },
});

function mapStateToProps(states) {
    return ({
        UID: states.authReducers.UID,
        CurrentUser: states.authReducers.USER,
        alluser: states.authReducers.ALLUSER,

    })
}

function mapDispatchToProps(dispatch) {
    return ({
        Add: (data, email) => {
            dispatch(addEmail(data, email))
        },
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Request);