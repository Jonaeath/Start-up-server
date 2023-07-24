const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()


app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWD}@cluster0.pg0dj0q.mongodb.net/?retryWrites=true&w=majority`

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
   const startUpCollection = client.db('myStartUp').collection('newStartUp');
   const OrderCollection = client.db('myStartUp').collection('orders');

    
   app.get('/newStartUp', async(req, res) =>{
    const query = {}
    const cursor = startUpCollection.find(query);
    const newStartUp = await cursor.toArray();
    res.send(newStartUp);
   });

   app.get('/newStartUp/:id', async(req, res) =>{
     const id = req.params.id;
     const query = { _id: new ObjectId(id) };
     const service = await startUpCollection.findOne(query);
     res.send(service);
   });

   // orders api
   app.get('/orders', async(req,res)=>{
    let query = {};
    if(req.query.email){
      query= {
        email: req.query.email
      }
    }
    const cursor = OrderCollection.find(query);
    const orders = await cursor.toArray();
    res.send(orders)
   })

   app.post('/orders', async(req,res) =>{
    const order = req.body;
    const result = await OrderCollection.insertOne(order);
    res.send(result); 
   });

   
   app.delete('/orders/:id', async(req, res)=> {
     const id = req.params.id;
     const query = {_id: new ObjectId(id)};
     const result = await OrderCollection.deleteOne(query);
     res.send(result);
   })

  } 
  finally {
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Start up server is running')
}) 

app.listen(port, ()=>{
    console.log(`Start Up server running on ${port}`)
})