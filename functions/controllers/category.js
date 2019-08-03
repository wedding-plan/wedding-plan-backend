const admin = require("firebase-admin");
const express = require("express");

const db = admin.firestore();
const categoryRef = db.collection("categories");

const app = express.Router();

app.post("/categories", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const userId = req.body.user_id;

  categoryRef
    .add({
      title: title,
      content: content,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    })
    .then(result => {
      res.status(200).json({
        error: false,
        errorMessage: null,
        data: result.id
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

app.get("/categories", (req, res) => {
  const userId = req.query.user_id;

  if (userId != undefined) {
    categoryRef
      .where("user_id", "==", userId)
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
  } else {
    categoryRef
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
  }
});

app.get("/categories/:id", (req, res) => {
  const categoriesId = req.params.id;

  categoryRef
    .doc(categoriesId)
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

app.put("/categories/:id", (req, res) => {
  const categoriesId = req.params.id;
  const title = req.body.title;
  const content = req.body.content;

  categoryRef
    .doc(categoriesId)
    .update({
      title: title,
      content: content,
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

app.delete("/categories/:id", (req, res) => {
  const categoriesId = req.params.id;

  categoryRef
    .doc(categoriesId)
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
