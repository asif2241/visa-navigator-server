const express = require('express')
const cors = require('cors')
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

//  testing 





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.teftn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const visaCollection = client.db('visaDB').collection('visa')

    app.get('/latest-visas', async(req, res)=>{
      const cursor = visaCollection.find().sort({_id: -1}).limit(6);
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/all-visa', async(req, res)=>{
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // for details
    app.get(`/all-visa/:id`, async(req, res)=>{
       const id = req.params.id
       const query = {_id : new ObjectId(id)};
       const result = await visaCollection.findOne(query)
       res.send(result)
    })

    // for update👇 

    app.put('/all-visa/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedVisa = req.body;
      const visa = {
        $set: {
          countryImg: updatedVisa.countryImg,
          countryName: updatedVisa.countryName,
          visaType: updatedVisa.visaType,
          processingTime: updatedVisa.processingTime,
          ageRestriction: updatedVisa.ageRestriction,
          fee: updatedVisa.fee,
          validity: updatedVisa.validity,
          applicationMethod: updatedVisa.applicationMethod,
          description: updatedVisa.description,
          required_docs: updatedVisa.required_docs,
         
        }
      }
      const result = await visaCollection.updateOne(filter, visa, options)
      res.send(result)
    })

    // delete

    app.delete('/all-visa/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.deleteOne(query)
      res.send(result)
    })
    app.get(`/all-visa/user/:name`, async(req, res)=>{
      const name = req.params.name;
      const query = {name: name};
      const result = await visaCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/visa', async(req, res)=>{
      const addedVisa = req.body;
      console.log(addedVisa);
      const result = await visaCollection.insertOne(addedVisa);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}
run();


app.get('/', (req, res) => {
    res.send(`server is running`)
})

app.listen(port, ()=>{
 console.log(`server is running on port: ${port}`);
})