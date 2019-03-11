import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: 'AIzaSyCj-Ye5_awr3rYkOpBeHUvyRkPxwMHzORw',
    authDomain: 'react-slack-clone-ef3d2.firebaseapp.com',
    databaseURL: 'https://react-slack-clone-ef3d2.firebaseio.com',
    projectId: 'react-slack-clone-ef3d2',
    storageBucket: 'react-slack-clone-ef3d2.appspot.com',
    messagingSenderId: '1369721305'
};
firebase.initializeApp(config);

export default firebase;