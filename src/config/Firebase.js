import * as firebase from 'firebase'

var config = {
  apiKey: "AIzaSyBarurMFYVh2BL94E0WD7xMkOrvp1jj_Wk",
    authDomain: "hackatonfinal-7fa1f.firebaseapp.com",
    databaseURL: "https://hackatonfinal-7fa1f.firebaseio.com",
    projectId: "hackatonfinal-7fa1f",
    storageBucket: "hackatonfinal-7fa1f.appspot.com",
    messagingSenderId: "800717940162"
};
  firebase.initializeApp(config);
  export default firebase