// Firebase Admin SDK initialization
// To use: npm install firebase-admin in /server
// Then set FIREBASE_SERVICE_ACCOUNT env var to the path of your service account JSON

let admin;
try {
  admin = require("firebase-admin");
  if (!admin.apps.length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? require(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;
    if (serviceAccount) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      // For local dev without Firebase, use a stub
      admin = {
        auth: () => ({
          verifyIdToken: async (token) => ({ uid: token, email: "demo@lifedrop.app" }),
        }),
      };
    }
  }
} catch {
  // Stub for environments without firebase-admin installed
  admin = {
    auth: () => ({
      verifyIdToken: async (token) => ({ uid: token, email: "demo@lifedrop.app" }),
    }),
  };
}

module.exports = admin;

