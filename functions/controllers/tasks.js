const admin = require("firebase-admin");
const express = require("express");

const db = admin.firestore();
const taskRef = db.collection("tasks");

const app = express.Router();

app.post("/tasks", (req, res) => {
  const name = req.body.name;
  const content = req.body.content;
  const userId = req.body.user_id;

  taskRef
    .add({
      name: name,
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

app.get("/tasks", (req, res) => {
  const userId = req.query.user_id;

  if (userId != undefined) {
    taskRef
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
    taskRef
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

app.get("/tasks/:id", (req, res) => {
  const taksId = req.params.id;

  taskRef
    .doc(taksId)
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

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const name = req.body.name;
  const content = req.body.content;

  taskRef
    .doc(taskId)
    .update({
      name: name,
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

app.delete("/tasks/:id", (req, res) => {
  const tasksId = req.params.id;

  taskRef
    .doc(tasksId)
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
