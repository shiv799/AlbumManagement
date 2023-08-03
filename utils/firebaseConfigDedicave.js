const admin = require("firebase-admin");
const serviceAccountProjectDedicave = require("./serviceAccountKeyDedicave.json");

const firebaseConfigDedicave = {
  apiKey: process.env.DEDICAVE_API_KEY,
  authDomain: process.env.DEDICAVE_AUTH_DOMAIN,
  projectId: process.env.DEDICAVE_PROJECT_ID,
  storageBucket: process.env.DEDICAVE_STORAGE_BUCKET,
  messagingSenderId: process.env.DEDICAVE_MESSAGING_SENDER_ID,
  appId: process.env.DEDICAVE_APP_ID,
  measurementId: process.env.DEDICAVE_MEASUREMENTID,
};

const dedicaveFirebaseConfigProject = {
  credential: admin.credential.cert(serviceAccountProjectDedicave),
  databaseURL: firebaseConfigDedicave,
};
const dedicaveAppProject = admin.initializeApp(dedicaveFirebaseConfigProject, "dedicave");

module.exports = dedicaveAppProject;
