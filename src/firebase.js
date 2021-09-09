// use SCREEN BRUSH to write/annotate on your screen

import firebase from 'firebase';

const firebaseConfig = {}

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = firebase.storage();
const db = firebaseApp.firestore();

export default db