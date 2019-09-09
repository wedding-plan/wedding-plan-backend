const admin = require("firebase-admin");
const express = require("express");

const { sendResponse } = require("../helpers/index");

const db = admin.firestore();
const taskRef = db.collection("tasks");

const app = express.Router();

const sortData = (a, b) => {
  return a.index - b.index;
};

app.post("/tasks", (req, res) => {
  const title = req.body.title;
  const userId = req.body.user_id;

  taskRef
    .where("user_id", "==", userId)
    .get()
    .then(docQuery => {
      const index = docQuery.size + 1;
      taskRef
        .add({
          title: title,
          user_id: userId,
          index: index,
          created_at: new Date(),
          updated_at: new Date()
        })
        .then(result => {
          sendResponse(res, 200, false, null, result.id);
        })
        .catch(err => {
          sendResponse(res, 500, true, err, {});
        });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.get("/tasks", (req, res) => {
  const userId = req.query.user_id;

  if (userId != undefined) {
    taskRef
      .where("user_id", "==", userId)
      .get()
      .then(docQuery => {
        if (docQuery.size === 0) {
          sendResponse(res, 200, false, null, []);
        }
        let data = [];
        docQuery.forEach(doc => {
          data.push({
            id: doc.id,
            ...doc.data()
          });
          if (data.length === docQuery.size) {
            sendResponse(res, 200, false, null, data.sort(sortData));
          }
        });
      })
      .catch(err => {
        sendResponse(res, 500, true, err, {});
      });
  } else {
    taskRef
      .get()
      .then(docQuery => {
        if (docQuery.size === 0) {
          sendResponse(res, 200, false, null, []);
        }
        let data = [];
        docQuery.forEach(doc => {
          data.push({
            id: doc.id,
            ...doc.data()
          });
          if (data.length === docQuery.size) {
            sendResponse(res, 200, false, null, data.sort(sortData));
          }
        });
      })
      .catch(err => {
        sendResponse(res, 500, true, err, {});
      });
  }
});

app.get("/tasks/:id", (req, res) => {
  const taksId = req.params.id;

  taskRef
    .doc(taksId)
    .get()
    .then(doc => {
      sendResponse(res, 200, false, null, { id: doc.id, ...doc.data() });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const title = req.body.title;

  taskRef
    .doc(taskId)
    .update({
      title: title,
      updated_at: new Date()
    })
    .then(result => {
      sendResponse(res, 200, false, null, { message: result.writeTime });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.delete("/tasks/:id", (req, res) => {
  const tasksId = req.params.id;

  taskRef
    .doc(tasksId)
    .delete()
    .then(result => {
      sendResponse(res, 200, false, null, { message: result.writeTime });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

module.exports = app;
