import actionTypes from '../Constant/Constant'
import firebase from '../../config/Firebase'
import { StackActions, NavigationActions } from 'react-navigation';

require("firebase/firestore")
const db = firebase.firestore()





// current User
export function current_User(currentUser) {
    return dispatch => {
        const UID = currentUser.uid
        var arr = [];
        dispatch(
            { type: actionTypes.UID, payload: UID }
        )
        db.collection('UserData').where('UID', '==', currentUser.uid).onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((docs) => {
                if (docs.type === 'added') {
                    dispatch({ type: actionTypes.USER, payload: docs.doc.data() })
                }
            })
        })

        db.collection('UserData').onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((docs) => {
                if(docs.type === 'added') {
                    // if(docs.doc.data().UID !== UID){
                        arr.push(docs.doc.data())
                        dispatch({ type: actionTypes.ALLUSER, payload: arr })
                    // }
                }
            })
            // console.log(arr,'alluser')
        })
        var flag = null
        // db.collection('circles').where('userUid', '==', UID ).onSnapshot((querySnapshot) => {
        //     querySnapshot.docChanges().forEach((docs) => {
        //         if (docs.type === 'added') {
        //             arr2.push(docs.doc.data())
        //             dispatch({ type: actionTypes.CIRCLES, payload: arr2 })
        //             dispatch({ type: actionTypes.FLAG, payload: flag })

        //         }
        //         if(docs.type === 'modified') {
        //             dispatch({ type: actionTypes.MODIFYCIRCLE, payload: docs.doc.data() })
        //         }
        //     })
        // })


        var circlesArr = []
            db.collection("circles")
                .onSnapshot(function (querySnapshot) {
                    querySnapshot.docChanges().forEach(function (doc) {
                        if (doc.type === 'added') {
                            flag = flag ? null : 'flag'
                            var obj = {
                                key: doc.doc.id,
                                data: doc.doc.data()
                            }
                            // console.log('object*****', obj)
                            circlesArr.push(obj)
                            dispatch({ type: actionTypes.CIRCLES, payload: circlesArr })
                            dispatch({ type: actionTypes.FLAG, payload: flag })
                            // console.log('circlesArr************', circlesArr)
                        }
                        if (doc.type === 'modified') {
                            flag = flag ? null : 'flag'
                            var obj = {
                                key: doc.doc.id,
                                data: doc.doc.data()
                            }
                            circlesArr.map((item, index) => {
                                if (item.key === doc.doc.id) {
                                    circlesArr.splice(index, 1, obj)
                                }
                            })
                            dispatch({ type: actionTypes.CIRCLES, payload: circlesArr })
                            dispatch({ type: actionTypes.FLAG, payload: flag })
                            // console.log('Addedreciever', arr)
                        }
                    })
                })
            
        }
               
            
    
        
        
    }

    export function login(userData) {
        return dispatch => {
           
            console.log(userData,'userdata')
           
            db.collection('UserData').doc(userData.UID).set(userData)
            
        }}

        export function CreatCircle(circle) {
            return dispatch => {
                db.collection('circles').add(circle)
            }}
    
    

// export function Log_Out() {
//     return dispatch => {
//         firebase.auth().signOut().then(() => {

//             dispatch(
//                 { type: actionTypes.USER, payload: null }
//             )
//             dispatch(
//                 { type: actionTypes.ALLUSER, payload: null }
//             )
//             dispatch(
//                 { type: actionTypes.SENDREQUEST, payload: null }
//             )
//             dispatch(
//                 { type: actionTypes.RECEIVEREQUEST, payload: null }
//             )
//             dispatch(
//                 { type: actionTypes.CHAT, payload: null }
//             )
//             dispatch(
//                 { type: actionTypes.FLAG, payload: null }
//             )
//             dispatch(
//                 { type: actionTypes.NEWCHAT, payload: null }
//             )
//         })
//     }
// }
export function enterCircleCode(uid, code) {
    return function (dispatch) {
        return new Promise(function (resolve, reject) {
            console.log('Object***', uid, code)
            db.collection("circles").where('joinCode', '==', code).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            console.log(`${doc.id} => ${doc.data().circleName}`);
                            if (doc.data().members.indexOf(uid) === -1) {
                                db.collection('circles').doc(doc.id).update({ members: [...doc.data().members, uid] })
                                    .then(() => {
                                        resolve()
                                    })
                            }
                            else {
                                reject()
                            }
                        });
                    }
                })
                .catch(() => {
                    // resolve('Empty')
                })
        })
    }
}
        
// export function Updte(uid) {
//     return dispatch => {
//         const UID =uid
//         var arr = [];
//         firebase.database().ref('/UserData/').on('child_added', snapShot => {
//             const UserData = snapShot.val();
//             if (snapShot.key === UID) {
//                 // console.log("user", snapShot.val())

//                 dispatch(
//                     { type: actionTypes.USER, payload: snapShot.val() }
//                 )
//             }
//             else {
//                 arr.push(snapShot.val())
//                 dispatch(
//                     { type: actionTypes.ALLUSER, payload: arr }
//                     )
//                 }
//                 console.log("alluser dashboar", arr)
//         })
      
        
//         }
    
// }             

export function addEmail(obj, email) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            console.log(obj, email,'jjjkj')
            db.collection('UserData').where('email', '==', email).get().then((querySnapshot) => {
                querySnapshot.forEach((docs) => {

                    if (docs.data().email === email) {
                        fetch('https://exp.host/--/api/v2/push/send', {
                            mode: 'no-cors',
                            method: 'POST',
                            headers: {
                                "Accept": 'application/json',
                                "Content-Type": 'application/json'
                            },
                            body: JSON.stringify({
                                to: docs.data().expoToken,
                                title: obj.circleName,
                                body: obj.joinCode,
                            })
                        });
                        console.log(docs.data().expoToken,'lll')
                    }
                    db.collection('UserData').doc(docs.id).update({})
                })
            })
        })
    }
}