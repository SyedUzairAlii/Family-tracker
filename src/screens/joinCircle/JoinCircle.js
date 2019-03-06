import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import firebase from '../../config/Firebase';
import { Header, Input } from 'react-native-elements';
import { Constants } from 'expo';
import { enterCircleCode } from '../../Store/actions/authAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { white } from 'ansi-colors';
// import SplashScreen from '../../../assets/SplashScreen.png';

class EnterCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circleCode: '',
            cond: false,
        }
    }


    _addCircle = () => {
        const { circleCode } = this.state;
        const { currentUserUID } = this.props;
        if (circleCode) {
            console.log('Abc', currentUserUID)
            this.setState({ cond: true })

            this.props.actions.enterCircleCode(currentUserUID, circleCode)
                .then(() => {
                    this.setState({ cond: false, circleName: '' })
                    alert('Successfully Join')
                    this.props.navigation.navigate('Home')
                })
                .catch(() => {
                    alert('You are already in this circle')

                })
        }
    }

    static navigationOptions = { header: null }
    render() {
        const { circleCode } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                 containerStyle={{
                    backgroundColor: '#075e54',
                    justifyContent: 'space-around',
                }}
                    placement="center"
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.props.navigation.navigate('Home') }}
                    centerComponent={{ text: 'Join a Circle', style: { color: '#fff', fontSize: 18, fontWeight: 'bold' } }}
                    // rightComponent={{ icon: 'group-add', color: '#fff', onPress: () => console.log('Run Right Header') }}
                />
                <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                    <Text style={styles.text}>
                        Please Enter Invite Code
                    </Text>

                    <Text style={styles.text}>
                        Get the code from your Circle's admin
                    </Text>
                    <View style={styles.input}>
                        <Input
                            value={circleCode}
                            placeholder={'XX-XX-XX'}
                            onChangeText={(e) => this.setState({ circleCode: e })}

                        />
                    </View>
                    <TouchableOpacity
                        style={styles.opacity}
                        onPress={this._addCircle}
                    >
                        <Text>
                            Send
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}



// export default AddCircle;

function mapStateToProps(states) {
    return ({

        currentUser: states.authReducers.USER,
        currentUserUID: states.authReducers.UID
    })
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            enterCircleCode
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterCode);


const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        marginTop: 15,
    },
    input: {
        width: 100,
    },
    opacity: {
        backgroundColor: 'darkcyan',
        marginTop: 25,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 5,
    },
    text: {
        fontSize: 19,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
    }
})