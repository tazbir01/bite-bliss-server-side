const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())

// bitebliss
// gNGL191fGSpxxlsI

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
    const brandCollection = client.db('biteblissDB').collection('brands')
    const cartCollection = client.db('biteblissDB').collection('cart')

    app.post('/products', async (req, res) => {
      const newProduct = req.body
      console.log(newProduct)
      const result = await biteblissCollection.insertOne(newProduct)
      res.send(result)
    })

    app.get('/products', async (req, res) => {
      const cursor = biteblissCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await biteblissCollection.findOne(cursor)
      res.send(result)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          price: updateProduct.price,
          type: updateProduct.type,
          image: updateProduct.image,
          rating: updateProduct.rating,
          description: updateProduct.description
        }
      }
      const result = await biteblissCollection.updateOne(cursor, product, options)
      console.log(result)
      res.send(result)
    })

    // cart api
    app.post('/cart', async (req, res) => {
      const product = req.body
      console.log(product)
      const result = await cartCollection.insertOne(product)
      res.send(result)
    })

    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: id }
      const result = await cartCollection.findOne(quary)
      res.send(result)
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id
      console.log("please delete from database", id)
      const quary = { _id: id }
      const result = await cartCollection.deleteOne(quary)
      res.send(result)
    })


    // brands api
    app.get('/brands', async (req, res) => {
      const cursor = brandCollection.find()
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


app.get('/', (req, res) => {
  res.send('Mongodb server is running')
})

app.listen(port, () => {
  console.log(`server is running on port: ${port}`)
})