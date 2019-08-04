const admin = require("firebase-admin");
const express = require("express");

const db = admin.firestore();
const checkRef = db.collection("check");

const app = express.Router();

const sortData = (a, b) => {
  return a.index - b.index;
};

app.post("/check/:category_id", (req, res) => {
  const title = req.body.title;
  const category_id = req.params.category_id;

  checkRef
    .where("category_id", "==", category_id)
    .get()
    .then(docQuery => {
      const index = docQuery.size + 1;
      checkRef
        .add({
          title: title,
          category_id: category_id,
          is_complete: false,
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

app.get("/check", (req, res) => {
  const categoryId = req.query.category_id;

  if (categoryId != undefined) {
    checkRef
      .where("category_id", "==", categoryId)
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
    checkRef
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

app.get("/check/:id", (req, res) => {
  const checkId = req.params.id;

  checkRef
    .doc(checkId)
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

app.put("/check/:id", (req, res) => {
  const checkId = req.params.id;
  const title = req.body.title;

  checkRef
    .doc(checkId)
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

app.put("/check/:id/checklist", (req, res) => {
  const checkId = req.params.id;

  checkRef
    .doc(checkId)
    .update({
      is_complete: true
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

app.put("/check/:id/unchecklist", (req, res) => {
  const checkId = req.params.id;

  checkRef
    .doc(checkId)
    .update({
      is_complete: false
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

app.delete("/check/:id", (req, res) => {
  const checkId = req.params.id;

  checkRef
    .doc(checkId)
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
