const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const jwt = require('jsonwebtoken');
const { query } = require('express');


//middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.arcfa0l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
      await client.connect();
      const ContactCollection = client.db('Contacts-App').collection('contactList');
  
      //Auth
      app.post('/login', async (req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '2d'
        })
        res.send({ accessToken });
      })
  
      //load inventory item
      app.get('/contact', async (req, res) => {
        const query = {};
        const cursor = ContactCollection.find(query);
        const contacts = await cursor.toArray();
        res.send(contacts);
      })
     
     
      //Add new item
      app.post('/contact', async (req, res) => {
        const newContact = req.body;
        const result = await ContactCollection.insertOne(newContact);
        res.send(result);
      })
  
      
  
    }
    finally {
  
    }
  }
  run().catch(console.dir);
  
  app.get('/', (req, res) => {
    res.send('Contacts App');
  })
  
  app.listen(port, () => {
    console.log('Contacts App is running', port);
  })
