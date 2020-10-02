const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello from DB it's Working...");
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdyuw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

client.connect(err => {
    const products = client.db("emaJohnStore").collection("products");
    const orders = client.db("emaJohnStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const allProducts = req.body;
        products.insertOne(allProducts)
            .then(result => {
                res.send(result.insertedCount);
            })
    })

    app.get('/products', (req, res) => {
        products.find({})
            .toArray( (err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        products.find({key: req.params.key})
            .toArray( (err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        products.find({ key: { $in: productKeys } })
            .toArray( (err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orders.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

});




app.listen(process.env.PORT || port, () => console.log(`Listening to port http://localhost:${port}`))