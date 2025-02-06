const express = require('express');
const app = express();
app.use(express.json());
const {getMessages, addMessage} = require('./database.js');

const APIKEY = "123456";

app.get('/', (req, res) => {
  res.send('Hola Mundo!');
})

app.get('/message', (req, res) => {    
   // Devolver mensajes alamacenados en la BBDD
   const apikey = req.headers['apikey'];
   if (apikey !== APIKEY){
     return res.status(401).send('Unauthorized');
   }
   res.json(getMessages());
})

app.post('/message', (req, res) => {    
   // Guardar mensajes en la BBDD
   const apikey = req.headers['apikey'];
  if (apikey !== APIKEY) {
    return res.status(401).send('Unauthorized');
  }
  const message = req.body.message;
  if (message) {
    addMessage(message);
    res.status(201).send('Message added');
  } else {
    res.status(400).send('Bad Request');
  }
})

app.listen(3000, () => {    
    console.log('Servidor corriendo en http://localhost:3000');
})