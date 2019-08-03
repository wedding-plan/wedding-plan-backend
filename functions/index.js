const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

admin.initializeApp();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require("./controllers/users"));
app.use(require("./controllers/tasks"));
app.use(require("./controllers/todo"));
app.use(require("./controllers/category"));
app.use(require("./controllers/check"));

exports.v1 = functions.https.onRequest(app);

// ================ handle trigger functions ================
exports.createUserAccount = functions.auth.user().onCreate(user => {
  const userID = user.uid;
  const email = user.email;
  const photoURL = user.photoURL;
  const name = user.displayName;
  const phone = user.phoneNumber;
  const verified = user.emailVerified;

  return admin
    .firestore()
    .collection("users")
    .doc(`${userID}`)
    .set({
      email: email,
      password: "",
      bod: "",
      firstname: name,
      lastname: "",
      avatar: photoURL,
      phone: phone,
      is_verified: verified,
      is_active: true,
      quotes: "",
      favorites: [],
      created_at: new Date(),
      updated_at: new Date()
    })
    .then(docRef => {
      console.log("success create user =>", docRef);
    })
    .catch(error => {
      console.error("Error while creating => ", error);
    });
});

exports.deleteUserAccount = functions.auth.user().onDelete(event => {
  const userID = event.uid;
  return admin
    .firestore()
    .doc(`users/${userID}`)
    .delete()
    .then(function() {
      console.log("Success Deleted User => ", userID);
    })
    .catch(error => {
      console.error("Error while deleting ", error);
    });
});
