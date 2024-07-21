const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb://0.0.0.0:27017";
const dbName = "ems24";

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });

app.post("/save", (req, res) => {
    const db = client.db(dbName);
    const coll = db.collection("employee");
    const document = {
        "_id": req.body.empid,
        "name": req.body.name,
        "choice": req.body.choice,
        "position": req.body.position,
        "salary": req.body.salary,
        "date": new Date(req.body.date)
    };
    coll.insertOne(document)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err));
});

app.get("/get", (req, res) => {
    const db = client.db(dbName);
    const coll = db.collection("employee");

    coll.find({}).toArray()
        .then(result => {
            // Format the date to dd-mm-yyyy
            const formattedResult = result.map(doc => ({
                ...doc,
                date: new Date(doc.date).toLocaleDateString('en-GB') // 'en-GB' is used for dd/mm/yyyy format
            }));
            res.send(formattedResult);
        })
        .catch(err => res.status(500).send(err));
});

app.delete("/delete", (req, res) => {
    const db = client.db(dbName);
    const coll = db.collection("employee");
    const document = { "_id": req.body.empid };

    coll.deleteOne(document)
        .then(result => res.send(result))
        .catch(err => res.status(500).send(err));
});

app.put("/update", (req,res) => {
    const db = client.db(dbName);
    const coll = db.collection("employee");

	const doc = {"name": req.body.name,
		     "position": req.body.position,
        	     "salary": req.body.salary,
        	     "date": new Date(req.body.date)};
	const filter = {"_id": req.body.empid};
	coll.updateOne(filter, {"$set": doc})
	.then(result => res.send(result) )
	.catch(err => res.send(err));
});

app.listen(6890, () => {
    console.log("Server is listening @ 6890");
});
