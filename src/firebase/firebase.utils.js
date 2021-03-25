import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyB6PPH8H-AfSGM2OvBEaJTjio7r_96NhoY",
    authDomain: "reactdashboard-c3584.firebaseapp.com",
    databaseURL: "reactdashboard-c3584.web.app",
    projectId: "reactdashboard-c3584",
    storageBucket: "reactdashboard-c3584.appspot.com",
    messagingSenderId: "320983437617",
    appId: "1:320983437617:web:5f0f1c5b8023aa8bc3a010"

};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();
    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            // console.log('error creating user', error.message);
        }
    }
    return userRef;
};

export const imageUpload = (image, filePath) => {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(filePath).put(image);

    return uploadTask;
};

// export const sendMessage = (chatroomId, message) => {
//     return firestore.collection(`chatrooms/${chatroomId}/messages`).add(message);
// }

// // export const addCollectionAndDocuments = async (
// //     collectionKey,
// //     objectsToAdd
// // ) => {
// //     const collectionRef = firestore.collection(collectionKey);

// //     const batch = firestore.batch();
// //     objectsToAdd.forEach(obj => {
// //         const newDocRef = collectionRef.doc();
// //         batch.set(newDocRef, obj);
// //     });

// return await batch.commit();
// };

// export const convertCollectionsSnapshotToMap = collections => {
//     const transformedCollection = collections.docs.map(doc => {
//         const { title, items } = doc.data();

//         return {
//             routeName: encodeURI(title.toLowerCase()),
//             id: doc.id,
//             title,
//             items
//         };
//     });
//     return transformedCollection.reduce((accumulator, collection) => {
//         accumulator[collection.title.toLowerCase()] = collection;
//         return accumulator;
//     }, {});
// };

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({
    prompt: 'select_account'
});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
