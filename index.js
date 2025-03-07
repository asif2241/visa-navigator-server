const express = require('express')
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');


const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

//  testing 

// visaNavigator
// m0r9jpGNjUUfjFOg



const uri = "mongodb+srv://visaNavigator:m0r9jpGNjUUfjFOg@cluster0.teftn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const visaCollection = client.db('visaDB').collection('visa')

    app.post('/visa', async(req, res)=>{
      const addedVisa = req.body;
      console.log(addedVisa);
      const result = await visaCollection.insertOne(addedVisa);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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