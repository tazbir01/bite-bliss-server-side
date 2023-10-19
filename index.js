const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())

// bitebliss
// gNGL191fGSpxxlsI


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujho7bh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const biteblissCollection = client.db('biteblissDB').collection('products')

    app.post('/products', async(req, res)=>{
      const newProduct = req.body
      console.log(newProduct)
      const result = await biteblissCollection.insertOne(newProduct)
      res.send(result)
    })

    app.get('/products', async(req, res)=>{
      const cursor = biteblissCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Mongodb server is running')
})

app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})