const { initializeApp, applicationDefault, getApps } = require("firebase-admin/app");

const { getAyth, getAuth } = require("firebase-admin/auth");

const firebaseApp = getApps().length ? getApps()[0] : initializeApp({
    credential: applicationDefault()
});

const firebaseAdminAuth = getAuth(firebaseApp);

module.exports = {firebaseAdminAuth};