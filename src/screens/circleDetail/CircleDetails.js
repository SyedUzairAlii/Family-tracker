import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button, KeyboardAvoidingView, Image ,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Header, Avatar } from 'react-native-elements';
import { connect } from 'react-redux'
import { leaveCircle } from '../../Store/actions/authAction'
import { bindActionCreators } from 'redux';

class CircleDetail extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            admin: false
        }
    }

    componentDidMount() {
        const { UID, navigation, alluser } = this.props
        const users = navigation.getParam('item')
        if (alluser) {
            // console.log(alluser, 'circle details');
            this.setState({ allUser: alluser })

        }
        if (users) {
            this.setState({ users })
            setTimeout(() => {

                this.CircleIn()
            }, 900)
        }

        if (users.userUid === UID) {
            var codes = users.joinCode
            this.setState({ admin: true, code: codes, CircleDetails: users })
            console.log(codes, 'perams')
        }
        if (users.circleName) {
            var name = users.circleName
            this.setState({ circleName: name })
        }
    }
    CircleIn = () => {
        const { allUser, users } = this.state
        // const { allUser } = this.props
        // console.log(alluser,  'run')
        var ArrLoaction = []
        var circleAdmin
        var panic = []

        if (allUser && allUser.length) {
            // console.log('add===', alluser);
            allUser.map(item => {

                if (!(users.members.indexOf(item.data.UID) === -1)) {
                    // console.log(item, 'yahoooo');
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
                        circleOwner: circleAdmin,
                        panicAlarm: panic
                    })
                }, 100)
                // console.log(circleAdmin, 'check')
            }

        }
        this.setState({ circle: false })

    }
    //invite a friend
    Invitation(item) {
        this.props.navigation.navigate('Request', { item })
    }

    // panic alarm 
    Panic() {
        const { panicAlarm } = this.state
        const {UID,CurrentUser} = this.props 
        Alert.alert(
            'Call For Hepl!!!',
            'SOS! All member Will be Notified',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                panicAlarm.map((item)=>{
                    if(item.UID !== UID ){
                        fetch('https://exp.host/--/api/v2/push/send', {
                            mode: 'no-cors',
                            method: 'POST',
                            headers: {
                                "Accept": 'application/json',
                                "Content-Type": 'application/json'
                            },
                            body: JSON.stringify({
                                to: item.expoToken,
                                title:`(${CurrentUser.name}) Need Help` ,
                                body: `last Location (${CurrentUser.address +"/"+ CurrentUser.city+"/"+CurrentUser.country})`,
                                
                            })
                        });
                    }
                })

              }},
            ],
            {cancelable: false},
          );
        
    }

    //leave the circle
    Leave() {
        const { UID } = this.props

        const { users } = this.state
        var uid = UID
        var code = users.joinCode
        if (UID) {
            this.props.actions.leaveCircle(uid, code)
                .then(() => {
                    alert('Successfully leave')
                    this.props.navigation.navigate('Home')
                })
                .catch(() => {
                    alert('something wrong')

                })
        }
        // console.log(users.joinCode,UID)
    }
    static navigationOptions = { header: null }
    render() {
        const { circleName, CircleDetails, admin, circleOwner, membrs } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    containerStyle={{
                        backgroundColor: '#075e54',
                        justifyContent: 'space-around',
                    }}
                    placement="center"
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.props.navigation.navigate('Home') }}
                    centerComponent={{ text: circleName ? circleName : null, style: { color: '#fff', fontSize: 18, fontWeight: 'bold' } }}
                    rightComponent={{ icon: 'cloud-circle', color: '#f50', onPress: () => this.Panic() }}
                />
                <ScrollView>
                    <KeyboardAvoidingView behavior="position" enabled >

                        {
                            circleOwner &&
                            <View style={{ minHeight: 40, maxHeight: 160 }} >

                                <View style={styles.view}>
                                    <View>
                                        <Image
                                            source={{ uri: circleOwner.photo }}
                                            style={{ width: 50, height: 50, borderRadius: 50 }}
                                        />

                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', }}>
                                        <Text style={{ fontSize: 16, fontWeight: "700", paddingLeft: 15 }} >{circleOwner.name}</Text>
                                        <Text style={{ paddingLeft: 15, paddingTop: 5 }} ><Icon name='star' size={20} color='#FC78BA' />{'  Circle Owner '}</Text>
                                    </View>

                                </View>
                            </View>

                        }
                        {membrs && membrs.map((item) => {
                            return (
                                <View style={{ minHeight: 40, maxHeight: 160 }} >

                                    <View style={styles.view}>
                                        <View>
                                            <Image
                                                source={{ uri: item.photo }}
                                                style={{ width: 50, height: 50, borderRadius: 50 }}
                                            />

                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column', }}>
                                            <Text style={{ fontSize: 16, fontWeight: "700", paddingLeft: 15 }} >{item.name}</Text>
                                            <Text style={{ paddingLeft: 15 }} >{'Member '}</Text>
                                        </View>

                                    </View>
                                </View>
                            )
                        })

                        }
                        {
                            admin ?
                                <View style={styles.vieww}>
                                    <View >
                                        <Icon name='plus-circle' size={70} color='#FC78BA' />
                                    </View>
                                    <View><Text style={styles.btn} onPress={() => this.Invitation(CircleDetails)}>{" Invite New Members"}</Text></View>
                                </View>
                                :
                                <View style={styles.vieww}>
                                    <View >
                                        <Button
                                            icon={
                                                <Icon
                                                    name="arrow-right"
                                                    size={15}
                                                    color="white"
                                                />
                                            }
                                            onPress={() => this.Leave()}
                                            iconRight
                                            title=" Leave Circle"
                                        />
                                    </View>
                                </View>
                        }
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
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
    btn: {
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
        // backgroundColor: '#3498db',
        fontSize: 17,
        fontWeight: '200',
        // color: '#ffffff',
    },
    view: {
        paddingLeft: 6,
        paddingTop: 15,
        paddingBottom: 15,
        // marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // backgroundColor: '#eff1f2',
        borderBottomWidth: 1,
        // borderColor: 'white',
        borderBottomColor: '#eff1f2'
    },
    vieww: {
        paddingLeft: 6,
        paddingTop: 15,
        paddingBottom: 15,
        // marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        // backgroundColor: '#eff1f2',
        borderBottomWidth: 1,
        // borderColor: 'white',
        borderBottomColor: '#eff1f2'
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

        actions: bindActionCreators({
            leaveCircle
        }, dispatch)
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(CircleDetail);