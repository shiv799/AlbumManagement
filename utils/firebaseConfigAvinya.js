const admin = require("firebase-admin");
const serviceAccountProjectAvinya = require("./serviceAccountKeyAvinya.json");

const firebaseConfigAvinya = {
  apiKey: process.env.AVINYA_API_KEY,
  authDomain: process.env.AVINYA_AUTH_DOMAIN,
  projectId: process.env.AVINYA_PROJECT_ID,
  storageBucket: process.env.AVINYA_STORAGE_BUCKET,
  messagingSenderId: process.env.AVINYA_MESSAGING_SENDER_ID,
  appId: process.env.AVINYA_APP_ID,
  measurementId: process.env.AVINYA_MEASUREMENTID,
};

const avinyaFirebaseConfigProject = {
  credential: admin.credential.cert(serviceAccountProjectAvinya),
  databaseURL: firebaseConfigAvinya,
};
const avinyaAppProject = admin.initializeApp(avinyaFirebaseConfigProject, "avinya");

module.exports = avinyaAppProject;