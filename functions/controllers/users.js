const admin = require("firebase-admin");
const express = require("express");
const bcrypt = require("bcryptjs");

const db = admin.firestore();
const userRef = db.collection("users");

const app = express.Router();

app.post("/signup", async (req, res) => {
  const SALT_WORK_FACTOR = 2;
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, salt);

  await userRef
    .add({
      username: username,
      password: password,
      email: email,
      married_date: "",
      created_at: new Date(),
      updated_at: new Date()
    })
    .then(result => {
      res.status(200).json({
        error: false,
        errorMessage: null,
        data: { id: result.id }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        errorMessage: err,
        data: {}
      });
    });
});

app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  await userRef
    .where("username", "==", username)
    .get()
    .then(docQuery => {
      if (docQuery.size == 0) {
        return res.status(500).json({
          error: true,
          errorMessage: "Incorrect Password !",
          data: []
        });
      } else {
        docQuery.forEach(async doc => {
          const validPassword = await bcrypt.compare(
            password,
            doc.data().password
          );
          if (!validPassword) {
            return res.status(500).json({
              error: true,
              errorMessage: "Incorrect Password !",
              data: []
            });
          } else {
            return res.status(200).json({
              error: false,
              errorMessage: null,
              data: { id: doc.id, ...doc.data() }
            });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        errorMessage: err,
        data: []
      });
    });
});

app.get("/users", (req, res) => {
  userRef
    .get()
    .then(docQuery => {
      let data = [];
      docQuery.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
        if (data.length === docQuery.size) {
          res.status(200).json({
            error: false,
            errorMessage: null,
            data: data
          });
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        errorMessage: err,
        data: {}
      });
    });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  userRef
    .doc(userId)
    .get()
    .then(doc => {
      res.status(200).json({
        error: false,
        errorMessage: null,
        data: { id: doc.id, ...doc.data() }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        errorMessage: err,
        data: {}
      });
    });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const marriedDate = req.body.married_date;

  userRef
    .doc(userId)
    .update({
      married_date: marriedDate,
      updated_at: new Date()
    })
    .then(result => {
      res.status(200).json({
        error: false,
        errorMessage: null,
        data: { message: result.writeTime }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        errorMessage: err,
        data: {}
      });
    });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  userRef
    .doc(userId)
    .delete()
    .then(result => {
      res.status(200).json({
        error: false,
        errorMessage: null,
        data: { message: result.writeTime }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: true,
        errorMessage: err,
        data: {}
      });
    });
});

module.exports = app;
