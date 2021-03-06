const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

//PORT SETUP
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Mongodb Configuration

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuu82.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// API Endpoints
async function run() {
    try {
        await client.connect();
        const alphabetCollection = client.db("dragDropClcDB").collection("alphabets");

        //Inserting a alphabet
        app.post("/alphabets", async (req, res) => {
            const alphabet = req.body;
            const result = await alphabetCollection.insertOne(alphabet);
            res.send(result);
        });

        //Getting all alphabets
        app.get("/alphabets", async (req, res) => {
            const alphabets = await alphabetCollection.find().toArray();
            res.send(alphabets);
        });

        //Getting a specific alphabet using alphabet Id
        app.get("/alphabets/:id", async (req, res) => {
            const alphabetId = req.params?.id;
            try {
                const query = { _id: ObjectId(alphabetId) };
                const alphabet = await alphabetCollection.findOne(query);
                res.send(alphabet);
            } catch (error) {
                res.status(400).send({
                    success: false,
                    message: "Invalid alphabet Id",
                });
            }
        });
    } finally {
        //
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello from  Equation calc drag drop server");
});

//listen to port
app.listen(port, () => {
    console.log("Listening to port", port);
});
