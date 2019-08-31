import admin from 'firebase-admin';

let serviceAccount = require('../domain-defender-firebase.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

export default admin.firestore();
