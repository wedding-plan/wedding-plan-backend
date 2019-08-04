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

const tasks = require("./datas/tasks");
const category = require("./datas/category");

// ================ handle trigger functions ================
exports.createUserAccount = functions.auth.user().onCreate(user => {
  const userID = user.uid;
  const email = user.email;
  const name = user.displayName;

  return admin
    .firestore()
    .collection("users")
    .doc(userID)
    .set({
      username: name,
      password: user.passwordHash,
      email: email,
      married_date: "",
      created_at: new Date(),
      updated_at: new Date()
    })
    .then(docRef => {
      console.log("success create user =>", docRef);
      //tasks
      tasks.forEach(item => {
        admin
          .firestore()
          .collection("tasks")
          .add({
            index: item.index,
            title: item.title,
            user_id: userID,
            created_at: new Date(),
            updated_at: new Date()
          })
          .then(result => {
            item.todo.forEach(items => {
              admin
                .firestore()
                .collection("todos")
                .add({
                  index: items.index,
                  item: items.title,
                  tasks_id: result.id,
                  is_complete: false,
                  created_at: new Date(),
                  updated_at: new Date()
                })
                .then(result => {
                  console.log(result.id);
                })
                .catch(err => {
                  console.log(err);
                });
            });
          })
          .catch(err => {
            console.log(err);
          });
      });

      // category
      category.forEach(item => {
        admin
          .firestore()
          .collection("categories")
          .add({
            index: item.index,
            title: item.title,
            user_id: userID,
            created_at: new Date(),
            updated_at: new Date()
          })
          .then(result => {
            item.check.forEach(items => {
              admin
                .firestore()
                .collection("check")
                .add({
                  index: items.index,
                  item: items.title,
                  tasks_id: result.id,
                  is_complete: false,
                  created_at: new Date(),
                  updated_at: new Date()
                })
                .then(result => {
                  console.log(result.id);
                })
                .catch(err => {
                  console.log(err);
                });
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
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
