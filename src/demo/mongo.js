const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany(
    [{ a: 1 }, { a: 2 }, { a: 3 }],
    function (err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log('Inserted 3 documents into the collection');
      callback(result);
    },
  );
};

const updateDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne(
    { a: 2 },
    { $set: { b: 1 } },
    function (err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log('Updated the document with the field a equal to 2');
      callback(result);
    },
  );
};

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  insertDocuments(db, (result) => {
    console.log(result);
  });

  updateDocument(db, (result) => {
    console.log(result);
  });

  client.close();
});
