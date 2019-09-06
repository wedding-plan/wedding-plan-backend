const admin = require("firebase-admin");
const express = require("express");
const bcrypt = require("bcryptjs");

const { sendResponse } = require("../helpers/index");

const db = admin.firestore();
const userRef = db.collection("users");

const app = express.Router();

app.post("/signup", async (req, res) => {
  const SALT_WORK_FACTOR = 2;
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, salt);

  admin
    .auth()
    .createUser({
      email: email,
      password: password
    })
    .then(result => {
      sendResponse(res, 200, false, null, { id: result.uid });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  await userRef
    .where("email", "==", email)
    .get()
    .then(docQuery => {
      if (docQuery.size == 0) {
        return sendResponse(res, 500, true, "Email is not exist !", {});
      } else {
        docQuery.forEach(async doc => {
          const validPassword = await bcrypt.compare(
            password,
            doc.data().password
          );
          if (!validPassword) {
            return sendResponse(res, 500, true, "Incorrect Password !", {});
          } else {
            return sendResponse(res, 200, false, null, {
              id: doc.id,
              ...doc.data()
            });
          }
        });
      }
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
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
          sendResponse(res, 200, false, null, data);
        }
      });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  userRef
    .doc(userId)
    .get()
    .then(doc => {
      sendResponse(res, 200, false, null, {
        id: doc.id,
        ...doc.data()
      });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const marriedDate = req.body.married_date;
  const name = req.body.name;
  const coupleName = req.body.couple_name;

  userRef
    .doc(userId)
    .update({
      name: name,
      couple_name: coupleName,
      married_date: marriedDate,
      updated_at: new Date()
    })
    .then(result => {
      sendResponse(res, 200, false, null, {
        msg: `Successfully updated => ${result.writeTime}`
      });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  userRef
    .doc(userId)
    .delete()
    .then(result => {
      sendResponse(res, 200, false, null, {
        msg: `Successfully deleted => ${result.writeTime}`
      });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

module.exports = app;
