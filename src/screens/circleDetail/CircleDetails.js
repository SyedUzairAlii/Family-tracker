import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Header, Avatar } from 'react-native-elements';
import { connect } from 'react-redux'

class CircleDetail extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            admin: false
        }
    }

    componentDidMount() {
        const { UID, navigation,alluser } = this.props
        const item = navigation.getParam('item')
        if(alluser){
            console.log(alluser,'circle details');

        }
        if (item) {
            this.setState({ item })
        }
        if(item.members){
        }
        if (item.userUid === UID) {
            this.setState({ admin: true, code: item.joinCode })
        }
        if (item.circleName) {
            this.setState({ circleName: item.circleName })
        }
    }
    Invitation(item) {
        this.props.navigation.navigate('Request', { item })
    }
    render() {
        const { circleName, item, admin, code } = this.state
        return (
            <View style={{ flex: 1 }}>

                <ScrollView>
                    <KeyboardAvoidingView behavior="position" enabled >

                        {
                            <View style={styles.view}>
                                <View>
                                    <Avatar
                                        size='large'
                                        rounded
                                        title="RR"
                                        activeOpacity={0.7}
                                    // source={{
                                    //     uri: item.sender.Photo

                                    // }}
                                    />
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 16, fontWeight: "700", paddingLeft: 8 }}> {circleName}</Text>
                                    {/* <Text style={{ paddingRight: 8 }} onPress={() => this.setting()}><Icon name='cog' size={30} color='gray' /></Text> */}
                                </View>
                            </View>

                        }
                        {
                            admin &&
                            <View style={styles.container}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                    <Text style={styles.btn} onPress={() => this.Invitation(item)}><Icon name='plus' size={20} color='white' />{" Invite New Members"}</Text>
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
        backgroundColor: '#3498db',
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    view: {
        paddingLeft: 6,
        paddingTop: 15,
        paddingBottom: 15,
        // marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#eff1f2',
        borderWidth: 1,
        borderColor: 'white'
    }
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
        // _info: (currentUID) => {
        //     dispatch(info_send(currentUID))
        // },
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(CircleDetail);