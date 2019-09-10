const admin = require("firebase-admin");
const express = require("express");

const db = admin.firestore();
const checkRef = db.collection("check");

const app = express.Router();

const sortData = (a, b) => {
  return a.index - b.index;
};

app.post("/check/:category_id", (req, res) => {
  const item = req.body.item;
  const category_id = req.params.category_id;

  checkRef
    .where("category_id", "==", category_id)
    .get()
    .then(docQuery => {
      const index = docQuery.size + 1;
      checkRef
        .add({
          item: item,
          category_id: category_id,
          is_complete: false,
          index: index,
          created_at: new Date(),
          updated_at: new Date()
        })
        .then(result => {
          sendResponse(res, 200, false, null, { id: result.uid });
        })
        .catch(err => {
          sendResponse(res, 500, true, err, {});
        });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
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
          sendResponse(res, 200, false, null, {});
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
    checkRef
      .get()
      .then(docQuery => {
        if (docQuery.size === 0) {
          sendResponse(res, 200, false, null, {});
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

app.get("/check/:id", (req, res) => {
  const checkId = req.params.id;

  checkRef
    .doc(checkId)
    .get()
    .then(doc => {
      sendResponse(res, 200, false, null, { id: doc.id, ...doc.data() });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.put("/check/:id", (req, res) => {
  const checkId = req.params.id;
  const item = req.body.item;

  checkRef
    .doc(checkId)
    .update({
      item: item,
      updated_at: new Date()
    })
    .then(result => {
      sendResponse(res, 200, false, null, { message: result.writeTime });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
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
      sendResponse(res, 200, false, null, { message: result.writeTime });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
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
      sendResponse(res, 200, false, null, { message: result.writeTime });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

app.delete("/check/:id", (req, res) => {
  const checkId = req.params.id;

  checkRef
    .doc(checkId)
    .delete()
    .then(result => {
      sendResponse(res, 200, false, null, { message: result.writeTime });
    })
    .catch(err => {
      sendResponse(res, 500, true, err, {});
    });
});

module.exports = app;
