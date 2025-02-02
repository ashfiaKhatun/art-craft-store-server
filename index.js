const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:5173', "https://art-craft-store-801c5.web.app"],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})


app.use(express.json());

const uri = "mongodb+srv://art_and_craft_store:H0YNFqU8G3DkrQux@cluster0.begblt8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // await client.connect();

    const itemCollection = client.db("craft_items_db").collection('all_craft_items')


    app.get('/allItems', async (req, res) => {
      const cursor = itemCollection.find()

      const result = await cursor.toArray()

      res.send(result);

    })

    app.get('/allItems/email/:email', async (req, res) => {
      const email = req.params.email;
      const cursor = { email: email };
      const options = { upsert: true };
      const result = await itemCollection.find(cursor, options).toArray();
      res.send(result);
    })


    app.get('/allItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);

    })


    app.post('/allItems', async (req, res) => {
      const newItem = req.body;

      const result = await itemCollection.insertOne(newItem);

      res.send(result);
    })

    app.put('/allItems/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedItems = req.body;


      const craft = {
        $set: {
          item_name: updatedItems.item_name,
          sub_category: updatedItems.sub_category,
          description: updatedItems.description,
          price: updatedItems.price,
          customization: updatedItems.customization,
          time: updatedItems.time,
          stock_status: updatedItems.stock_status,
          rating: updatedItems.rating,
          photo: updatedItems.photo,
          email: updatedItems.email,
          name: updatedItems.name,

        }
      }

      const result = await itemCollection.updateOne(filter, craft, options);
      res.send(result);

    })

    app.delete('/allItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    })

    // sub category section

    const subCategoryCollection = client.db("craft_items_db").collection('category_table')

    app.get('/all-sub-categories', async (req, res) => {
      const cursor = subCategoryCollection.find()

      const result = await cursor.toArray()

      res.send(result);

    })

    app.get('/all-sub-categories/title/:title', async (req, res) => {
      const title = req.params.title;
      const cursor = { sub_category: title };
      const options = { upsert: true };
      const result = await spotCollection.find(cursor, options).toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Art and Craft Server is running")
})


app.listen(port, () => {
  console.log(`Art an Craft Server is running on port: ${port}`);
})
