import React from 'react';
import { View, ScrollView, Image, Text, TextInput, StyleSheet, Button, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import firebase from '../../config/Firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Input, Header, Divider } from 'react-native-elements';
import { Constants, Location, Permissions, Contacts, Notifications } from 'expo';
import { LinearGradient } from 'expo';
import { User_Messages } from '../../Store/actions/authAction'
import Icon from 'react-native-vector-icons/FontAwesome';
import { GetCircles } from '../../Store/actions/authAction'

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

        };
    }


    componentDidMount() {
        const { usersAll, me, Circles, flag } = this.props;
        // if (me) {

        // }
        // console.log('alalalalal', usersAll)
        if (!Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }


        getToken();
        this.listener = Notifications.addListener(this.handleNotification);


    }
    handleNotification = ({ origin, data }) => {
        console.log(
            `Push notification ${origin} with data: ${(data)}`,
        );
    };

    menu = () => {
        this.props.navigation.navigate('EnterCode')

    }
    add = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'AddCircle' }),
            ]
        })
        this.props.navigation.dispatch(resetAction)

    }

    CircleSetting = (item) => {

        this.props.navigation.navigate('CircleDetail', { item })

    }

    CircleIn = (users) => {
        // console.log(user,'item')
        // console.log('kjhkjh', users);
        const { usersAll } = this.props
        var ArrLoaction = []
        if (usersAll && users.length) {
            // console.log('add===', alluser);
            usersAll.map(item => {
                if (!(users.indexOf(item.UID))) {
                    console.log(item, 'yahoooo');
                    ArrLoaction.push(item)
                }
            })
            if (ArrLoaction.length) {
                this.setState({ membrs: ArrLoaction })
                console.log(ArrLoaction,'check')
            }

        }
        this.setState({ circle: false })

    }





    _getLocationAsync = async () => {
        const { me } = this.props;

        console.log(me, "function run ")
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied'

            });
            console.log("permission not granted ")

        }

        let location = await Location.getCurrentPositionAsync({});
        console.log("permission  granted ")

        // this.setState({
        //     location,
        //     where: { lat: location.coords.latitude, lng: location.coords.longitude },
        //     get: true
        // });
        const obj = {
            direction: { lat: location.coords.latitude, lng: location.coords.longitude }
        }
        this.setState({
            currentLocation: { lat: location.coords.latitude, lng: location.coords.longitude },
            get: true,
        })
        console.log("location===>>>>", obj)
        db.collection('UserData').doc(me.UID).update(obj)

    };
    componentWillMount() {
        const { Circles, me, usersAll } = this.props
        // console.log(usersAll, 'all users will mount')

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
    componentWillReceiveProps(props) {
        const { Circles, me, usersAll } = props
        // console.log(usersAll, 'all users will receviced')
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

        // if (!Constants.isDevice) {
        //     this.setState({
        //         errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        //     });
        // } else {
        //     this._getLocationAsync();
        // }

    }

    static navigationOptions = { header: null }

    render() {
        const { membrs, circleNum, circles, currentLocation, get, circle, userLocation, sellerLocation } = this.state
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
                                                    <Icon name='group' size={30} color='#30e836' />
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16, fontWeight: "700", paddingLeft: 15 }} onPress={() => this.CircleIn(users = item.members)}>{item.circleName}</Text>
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
                               membrs && membrs.map((item)=>{
                                   return(
                                    <MapView.Marker
                                    coordinate={{
                                        latitude: item.direction.lat,
                                        longitude: item.direction.lng,
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.photo}}
                                        style={{ width: 50, height: 50, borderRadius: 50 }}
                                    />
                                </MapView.Marker>
                                   )
                               })

                              
                            }
                            <MapView.Marker
                                coordinate={{
                                    latitude: currentLocation.lat,
                                    longitude: currentLocation.lng,
                                }}
                            >
                                <Image
                                    source={{ uri: 'http://www.wan-ifra.org/sites/default/files/imagecache/default_col_4/field_article_image/20141112-181853-0e1d152e.jpg' }}
                                    style={{ width: 50, height: 50, borderRadius: 50 }}
                                />
                            </MapView.Marker>



                            {/* <MapViewDirections
                            origin={coordinates[0]}
                            destination={coordinates[coordinates.length - 1]}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
                        />  */}

                        </MapView >
                        :
                        <View style={styles.container}>
                            <Text style={{ fontSize: 18, fontWeight: '700', }} >Location Not Available!</Text>
                        </View>
                    }
                </View>


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
        // backgroundColor: '#eff1f2',
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

