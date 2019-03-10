import React from 'react';
import { View, ScrollView, Image, Text, Linking, StyleSheet, Button, 
TouchableOpacity, ActivityIndicator, Platform, Dimensions,AppState } from 'react-native';
import firebase from '../../config/Firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Input, Header, Divider } from 'react-native-elements';
import { Constants, Location, Permissions,
 Contacts, Notifications, IntentLauncherAndroid } from 'expo';
// import { LinearGradient } from 'expo';
import { User_Messages } from '../../Store/actions/authAction'
import Icon from 'react-native-vector-icons/FontAwesome';
// import { GetCircles } from '../../Store/actions/authAction'
import moment from 'moment'
import Modal from 'react-native-modal'



const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
require("firebase/firestore")
const db = firebase.firestore()

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentLocation: { lat: null, lng: null },
            userLocation: { lat: null, lng: null },
            get: false,
            sellerLocation: false,
            isLocationModalVisible: false,
            appState: AppState.currentState

        };
    }


    componentDidMount() {
        const { usersAll, me, Circles, flag } = this.props;
        if (me) {
            this.setState({
                currentUser: me
            })
        }
        // console.log('alalalalal', usersAll)
        if (!Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
        this.locatioUpdate()
        getToken();
        this.listener = Notifications.addListener(this.handleNotification);
    }



    handleNotification = ({ origin, data }) => {
        console.log(
            `Push notification ${origin} with data: ${(data)}`,
        );
    };
    //menu 

    menu = () => {
        this.props.navigation.navigate('EnterCode')

    }
    // crat circle
    add = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'AddCircle' }),
            ]
        })
        this.props.navigation.dispatch(resetAction)

    }
    //location live 

    locatioUpdate = () => {
        setTimeout(() => {
            console.log('location updated')
            this._getLocationAsync()
        }, 10000)
    }


    //go in circle detail page
    CircleSetting = (item) => {
        this.props.navigation.navigate('CircleDetail', { item })
    }
    // check your frend current location time

    currentUser = (item) => {

        var time = moment(item.date).startOf('hour').fromNow();
        this.setState({
            CheckStatus: true,
            lastsceen: time,
            city: item.city,
            country: item.country,
            address: item.address,
            currentUserPic: item.photo,
            currentUserName: item.name
        })

        console.log(time, 'current user')
    }

    //select the circle to view

    CircleIn = (users) => {
        const { allUser, admin } = this.state
        const { usersAll } = this.props
        var ArrLoaction = []
        var circleAdmin
        var panic = []
        this.setState({
            membrs: false,
            admin: false,
            panicAlarm: false
        })
        if (allUser && allUser.length) {
            // console.log('add===', alluser);
            allUser.map(item => {

                if (!(users.members.indexOf(item.data.UID) === -1)) {
                    console.log(item, 'yahoooo');
                    var obj = item.data
                    ArrLoaction.push(obj)
                    panic.push(obj)
                } else if (users.userUid === item.data.UID) {
                    circleAdmin = item.data
                    panic.push(item.data)


                }
            })
            if (ArrLoaction.length) {
                setTimeout(() => {

                    this.setState({
                        membrs: ArrLoaction,
                        admin: circleAdmin,
                        panicAlarm: panic
                    })
                }, 100)
                console.log(ArrLoaction, 'check')
            }

        }
        this.setState({ circle: false })

    }





    _getLocationAsync = async () => {
        const { me } = this.props;

        console.log(me, "function run ")
        try {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            let location = await Location.getCurrentPositionAsync({});
            let address = Promise.resolve(Expo.Location.reverseGeocodeAsync(location.coords));
            const that = this
            address.then(function (value) {
                // console.log(value)
                // console.log(address)
                let array = value.map(name => {
                    var obj = {
                        country: name.country,
                        city: name.city,
                        address: name.name,
                        region: name.region

                    }
                    db.collection('UserData').doc(me.UID).update(obj)
                })
            });
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied'
                });
                console.log("permission not granted ")
            }
            console.log("permission  granted ")
            const obj = {
                direction: { lat: location.coords.latitude, lng: location.coords.longitude },
                date: Date.now(),
            }
            this.setState({
                currentLocation: { lat: location.coords.latitude, lng: location.coords.longitude },
                get: true,
            })
            console.log("location===>>>>", obj)
            db.collection('UserData').doc(me.UID).update(obj)
        } catch (error) {
            let statuss = Location.getProviderStatusAsync()
            if (!statuss.LocationServicesEnabled) {
                this.setState({ isLocationModalVisible: true })
            }
        }

    };
    openSetting = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:')
        }else{
            IntentLauncherAndroid.startActivityAsync(
                IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
            )
        }
        this.setState({
            openSetting:false
        })
    }
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App has come to the foreground!')
          this._getLocationAsync();
        }
        this.setState({appState: nextAppState});
      }

    componentWillMount() {
        const { Circles, me, usersAll } = this.props
        // console.log(usersAll, 'all users will mount')

        const currentUserUID = me.UID
        AppState.addEventListener('change', this._handleAppStateChange);
        var count = 0
        var arr = [];
        if (Circles && Circles.length) {
            Circles.map(item => {
                if (item.data.userUid === currentUserUID) {
                    count = count + 1;
                    arr.push(item.data)
                    this.setState({ circleNum: count, circles: arr })
                    // console.log(item,'>>>item')
                }
                else {
                    if (item.data.members && item.data.members.length && item.data.members.indexOf(currentUserUID) !== -1) {
                        count = count + 1;
                        arr.push(item.data)
                        this.setState({ circleNum: count, circles: arr })
                    }
                }
            })
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
      }
      
    componentWillReceiveProps(props) {
        const { Circles, me, usersAll } = props
        console.log(usersAll, 'all users will receviced')
        if (usersAll && usersAll.length) {
            this.setState({
                allUser: usersAll
            })
        }
        if (me) {
            this.setState({
                currentUser: me
            })
        }

        const currentUserUID = me.UID
        var count = 0
        var arr = [];
        if (Circles && Circles.length) {
            Circles.map(item => {
                if (item.data.userUid === currentUserUID) {
                    count = count + 1;
                    arr.push(item.data)
                    this.setState({ circleNum: count, circles: arr })
                    // console.log(item,'>>>item')
                }
                else {
                    if (item.data.members && item.data.members.length && item.data.members.indexOf(currentUserUID) !== -1) {
                        count = count + 1;
                        arr.push(item.data)
                        this.setState({ circleNum: count, circles: arr })
                    }
                }
            })
        }



    }

    static navigationOptions = { header: null }

    render() {
        const { membrs, circleNum, circles, currentLocation, CheckStatus, get, circle, userLocation, admin, currentUser, lastsceen,
            city,
            country,
            address,
            currentUserPic, currentUserName, openSetting } = this.state

        const coordinates = [
            {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
            },
            {
                latitude: userLocation.lat,
                longitude: userLocation.lng,
            },
        ]
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    onModalHide={openSetting ? this.openSetting : undefined}
                    isVisible={this.state.isLocationModalVisible}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                        <Button title='Enabel Location Services' onPress={() => this.setState({
                            isLocationModalVisible: false, openSetting: true
                        })}>

                        </Button>
                    </View>
                </Modal>

                <Header
                    containerStyle={{
                        backgroundColor: '#075e54',
                        justifyContent: 'space-around',
                    }}
                    placement="center"
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.menu() }}
                    centerComponent={{ text: circleNum ? `Circles (${circleNum})` : null, style: { color: '#fff', fontSize: 20 }, onPress: () => this.setState({ circle: circle ? false : true }) }}
                    rightComponent={{ icon: 'group-add', color: 'white', onPress: () => this.add() }}
                />

                {circle &&
                    <View style={{ minHeight: 40, maxHeight: 160 }}>
                        <ScrollView>
                            {
                                circles.map((item) => {
                                    return (
                                        <View style={styles.view}>
                                            <View>
                                                <Text>
                                                    <Icon name='users' size={30} color='#30e836' />
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16, fontWeight: "700", paddingLeft: 15 }} onPress={() => this.CircleIn(users = item)}>{item.circleName}</Text>
                                                <Text style={{ paddingRight: 8 }} onPress={() => this.CircleSetting(item)}><Icon name='cog' size={30} color='gray' /></Text>
                                            </View>
                                        </View>)
                                })
                            }

                        </ScrollView>
                    </View>
                }
                <View style={{ flex: 1 }}>

                    {get ?
                        // <View>
                        < MapView
                            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={styles.map}
                            region={{
                                latitude: currentLocation.lat,
                                longitude: currentLocation.lng,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}

                        >
                            {
                                membrs && membrs.map((item) => {
                                    return (
                                        <MapView.Marker
                                            coordinate={{
                                                latitude: item.direction.lat,
                                                longitude: item.direction.lng,
                                            }}
                                            onPress={() => this.currentUser(item)}

                                        >
                                            <Image
                                                source={{ uri: item.photo }}
                                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                            />
                                        </MapView.Marker>
                                    )
                                })


                            }
                            {admin ?
                                <MapView.Marker
                                    coordinate={{
                                        latitude: admin.direction.lat,
                                        longitude: admin.direction.lng,
                                    }}
                                    onPress={() => this.currentUser(admin)}

                                >
                                    <Image
                                        source={{ uri: admin.photo }}
                                        style={{ width: 50, height: 50, borderRadius: 50 }}
                                    />
                                </MapView.Marker>
                                :
                                <MapView.Marker
                                    coordinate={{
                                        latitude: currentLocation.lat,
                                        longitude: currentLocation.lng,
                                    }}
                                >
                                    <Image
                                        source={{ uri: currentUser.photo }}
                                        style={{ width: 50, height: 50, borderRadius: 50 }}
                                    />
                                </MapView.Marker>
                            }
                        </MapView >
                        :
                        <View style={styles.container}>
                            <Text style={{ fontSize: 18, fontWeight: '700', }} >Location Not Available!</Text>
                        </View>
                    }
                </View>
                {
                    CheckStatus &&
                    <View style={{ minHeight: 40, maxHeight: 160 }} >
                        {/* <View style={{alignSelf:'flex-end',paddingRight:20,height:25,backgroundColor:'#F2F2F2'}}>
                    </View> */}
                        <View style={styles.view}>
                            <View>
                                <Image
                                    source={{ uri: currentUserPic }}
                                    style={{ width: 50, height: 60, borderRadius: 50 }}
                                />

                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 16, fontWeight: "700", paddingLeft: 15 }} >{currentUserName}</Text>
                                <Text style={{ fontSize: 16, fontWeight: "700", paddingLeft: 15 }} >{address + ', ' + city + ',' + country}</Text>
                                <Text style={{ paddingLeft: 15 }} >{'Last tracked ' + lastsceen}</Text>
                            </View>
                            <View style={{ paddingRight: 10 }}>
                                <Icon
                                    raised
                                    name='angle-double-down'
                                    type='font-awesome'
                                    color='#f50'
                                    size={26}
                                    onPress={() => this.setState({
                                        CheckStatus: false
                                    })} />
                            </View>
                        </View>
                    </View>
                }

            </View>
        );
    }
}
async function getToken() {
    // Remote notifications do not work in simulators, only on device
    let { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS,
    );
    if (status !== 'granted') {
        return;
    }
    var value = await Notifications.getExpoPushTokenAsync();
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const uid = user.uid;
            // firebase.database().ref('UserData/' + uid).update({ expoToken: value })
            db.collection('UserData').doc(uid).update({ expoToken: value })
        }
    })
}

const styles = StyleSheet.create({
    img: {
        height: 160,
        width: 165,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    statusBar: {
        backgroundColor: "#075e54",
        height: Constants.statusBarHeight,
    },
    cardTitle: {
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#424c59'
    },
    titleName: {
        paddingTop: 6,
        paddingBottom: 3,
        fontSize: 14,
        fontWeight: '600',

    },
    view: {
        paddingLeft: 6,
        paddingTop: 15,
        paddingBottom: 15,
        // marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#F2F2F2',
        borderWidth: 1,
        borderColor: 'white'
    }

});

function mapStateToProp(state) {
    return ({
        me: state.authReducers.USER,
        usersAll: state.authReducers.ALLUSER,
        Circles: state.authReducers.CIRCLES,
        Modify: state.authReducers.MODIFYCIRCLE,
        flag: state.authReducers.FLAG


    })
}
function mapDispatchToProp(dispatch) {
    return ({

        user: (userCurrent) => {
            dispatch(User_Messages(userCurrent))
        },


    })
}

export default connect(mapStateToProp, mapDispatchToProp)(Home);

