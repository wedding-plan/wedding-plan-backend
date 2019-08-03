const admin = require("firebase-admin");
const express = require("express");

const db = admin.firestore();
const todoRef = db.collection("todos");

const app = express.Router();

app.post("/todo/:task_id", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const taskId = req.params.task_id;

  todoRef
    .add({
      title: title,
      content: content,
      task_id: taskId,
      is_complete: false,
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

app.get("/todo", (req, res) => {
  const taskId = req.query.task_id;

  if (taskId != undefined) {
    todoRef
      .where("task_id", "==", taskId)
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
    todoRef
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

app.get("/todo/:id", (req, res) => {
  const todoId = req.params.id;

  todoRef
    .doc(todoId)
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

app.put("/todo/:id", (req, res) => {
  const todoId = req.params.id;
  const title = req.body.title;
  const content = req.body.content;

  todoRef
    .doc(todoId)
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

app.put("/todo/:id/checklist", (req, res) => {
  const todoId = req.params.id;

  todoRef
    .doc(todoId)
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

app.put("/todo/:id/unchecklist", (req, res) => {
  const todoId = req.params.id;

  todoRef
    .doc(todoId)
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

app.delete("/todo/:id", (req, res) => {
  const todoId = req.params.id;

  todoRef
    .doc(todoId)
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
