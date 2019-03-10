import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import firebase from '../../config/Firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import * as Expo from 'expo';
import { Header } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements'
import { Constants } from 'expo';
import { current_User } from '../../Store/actions/authAction'
import { connect } from 'react-redux';
import { login } from '../../Store/actions/authAction'
require("firebase/firestore")
const db = firebase.firestore()
class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {

                const currentUser = user
                this.props.user(currentUser)
            }
        })
    }
    static navigationOptions = {
        title: 'Home Solution ',

        headerStyle: {
            backgroundColor: '#075e54',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };
    componentWillReceiveProps(props) {
        const { currentUser, allUser } = props;

        if (currentUser) {
            console.log(allUser, 'allusers')
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                ]
            })
            this.props.navigation.dispatch(resetAction)

        }
    }


    async   Goolge() {

        googleAuthenticate = (idToken, accessToken) => {
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
            return firebase.auth().signInWithCredential(credential);
        };
    }
    _loginWithGoogle = async function () {
        try {
            const result = await Expo.Google.logInAsync({
                androidClientId: '800717940162-8m46snkbgvl8jsjo7rh86sito4ev3hq5.apps.googleusercontent.com',
                iosClientId: '800717940162-fircet6e8m85gshc25jb12e1qhlc6ani.apps.googleusercontent.com',
                scopes: ["profile", "email"]
            });
            if (result.type === 'success') {
                // this.props.navigation.navigate('Home', result)
                // console.log('Result-->', result);

                this.props.profilePic = result.photoUrl
                this.props.profileName = result.givenName
                const { idToken, accessToken } = result;
                const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
                firebase
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential)
                    .then(success => {
                        // user res, create your user, do whatever you want
                        // console.log('success==>', success);
                        var currentUID = success.user.uid
                        var obj = {
                            name: success.user.displayName,
                            UID: success.user.uid,
                            photo: success.user.photoURL,
                            // Token: accessToken,
                            email: success.user.email,
                            status: 'unblock'
                        }
                        console.log(obj, 'sucess obj ')
                        const userData = obj
                        this.props.login(userData)
                    })
                    .catch(error => {
                        console.log("firebase cred err:", error);
                    });
                return result.accessToken;

            } else {
                // console.log('/////');
                return { cancelled: true };
            }


        } catch (err) {
            console.log("err:", err);
        }
    };
 
    static navigationOptions = { header: null }
    render() {
        const { Email, Password } = this.state


        return (

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Header

                    containerStyle={{
                        backgroundColor: '#075e54',
                        justifyContent: 'space-around',

                    }}
                    centerComponent={{ text: "Family Tracker", style: { color: '#fff', fontSize: 20 } }}

                />
                {/* <View style={styles.statusBar} /> */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    {/* <ScrollView style={styles.body} keyboardDismissMode="interactive"> */}



                    {/* <TouchableOpacity onPress={() => this.logInFB()}> */}
                        {/* <View style={{ width: 300, margin: 20 }}>

                            <SocialIcon
                                title='Sign In With Facebook'
                                button
                                type='facebook'
                            />
                        </View> */}
                        {/* <Text style={styles.ButtonText} >Facebook LogIn</Text> */}
                    {/* </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => this._loginWithGoogle()}>
                        <View style={{ width: 300, margin: 20 }}>

                            <SocialIcon
                                title='Sign In With Google'
                                button
                                type='google-plus-official'
                            />
                        </View>
                    </TouchableOpacity>


                    {/* </ScrollView> */}

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 20
    },

    Heading: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 60,
        marginBottom: 85,
        fontSize: 50,
        // fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: '#ffff',
        textAlign: 'center'
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginBottom: 20,
        color: '#fff',
        height: 40,
        width: 300,
        paddingHorizontal: 10,
        fontSize: 18
    },
    buton: {
        alignItems: 'center',
        backgroundColor: '#0055ff',
        paddingVertical: 10,
        marginBottom: 20,
        width: 220,
        // justifyContent: 'space-between',


    },
    google: {
        alignItems: 'center',
        backgroundColor: '#00b3b3',
        paddingVertical: 10,
        marginBottom: 20,
        width: 220,
        // justifyContent: 'space-between',


    },
    ButtonText: {
        fontWeight: 'bold',
        color: "#ffff",
        // alignItems:'center'
        fontSize: 20
    },
    statusBar: {
        backgroundColor: "#C2185B",
        height: Constants.statusBarHeight,
    },

});
function mapStateToProps(states) {
    return ({
        profilePic: states.authReducers.PROFILEPIC,
        profileName: states.authReducers.PROFILENAME,
        currentUser: states.authReducers.USER,
        allUser: states.authReducers.ALLUSER
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        user: (currentUser) => {
            dispatch(current_User(currentUser))
        },
        login: (userData) => {
            dispatch(login(userData))
        }
        // fb_User: (type, token) => {
        //     dispatch(fb_Action(type, token))
        // },
        // Google_auth: (currentUID, obj) => {
        //     dispatch(Google_Action(currentUID, obj))
        // },
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);