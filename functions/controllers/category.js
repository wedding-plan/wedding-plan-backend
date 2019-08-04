const admin = require("firebase-admin");
const express = require("express");

const db = admin.firestore();
const categoryRef = db.collection("categories");

const app = express.Router();

const sortData = (a, b) => {
  return a.index - b.index;
};

app.post("/categories", (req, res) => {
  const title = req.body.title;
  const userId = req.body.user_id;

  categoryRef
    .where("user_id", "==", userId)
    .get()
    .then(docQuery => {
      const index = docQuery.size + 1;
      categoryRef
        .add({
          title: title,
          user_id: userId,
          index: index,
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
        if (docQuery.size === 0) {
          res.status(200).json({
            error: false,
            errorMessage: null,
            data: []
          });
        }
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
              data: data.sort(sortData)
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
        if (docQuery.size === 0) {
          res.status(200).json({
            error: false,
            errorMessage: null,
            data: []
          });
        }
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
              data: data.sort(sortData)
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

  categoryRef
    .doc(categoriesId)
    .update({
      title: title,
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
