const admin = require("firebase-admin");
const serviceAccountProjectAJMultiMedia = require("./serviceAccountKeyAJMultiMedia.json");

const firebaseConfigAJ = {
  apiKey: process.env.AJMULTIMEDIA_API_KEY,
  authDomain: process.env.AJMULTIMEDIA_AUTH_DOMAIN,
  projectId: process.env.AJMULTIMEDIA_PROJECT_ID,
  storageBucket: process.env.AJMULTIMEDIA_STORAGE_BUCKET,
  messagingSenderId: process.env.AJMULTIMEDIA_MESSAGING_SENDER_ID,
  appId: process.env.AJMULTIMEDIA_APP_ID,
  measurementId: process.env.AJMULTIMEDIA_MEASUREMENTID,
};

const ajFirebaseConfigProject = {
  credential: admin.credential.cert(serviceAccountProjectAJMultiMedia),
  databaseURL: firebaseConfigAJ,
};
const ajAppProject = admin.initializeApp(ajFirebaseConfigProject, "aj");

module.exports = ajAppProject;