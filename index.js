const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
app.use(express.json());
const {getMessages, addMessage} = require('./database.js');
const path = require('path');

const APIKEY = "123456";

app.get('/', (req, res) => {
  res.send('Bienvenido al despliegue del servidor de Alvaro!');
})

app.get('/message', (req, res) => {    
   // Devolver mensajes alamacenados en la BBDD
   const apikey = req.headers['apikey'];
   if (apikey !== APIKEY){
     return res.status(401).send('Unauthorized');
    }else if (apikey === APIKEY){
      res.json(getMessages());
      return res.status(200).send('OK');  
   }
})

app.post('/message', (req, res) => {    
   // Guardar mensajes en la BBDD
   const apikey = req.headers['apikey'];
  if (apikey !== APIKEY) {
    return res.status(401).send('Unauthorized');
  }

  // Manda el mensaje por la query y lo añadade a la BBDD
  const message = req.body.message;  
  if (message) {
    addMessage(message);
    res.status(201).send('Message added');
  } else {
    res.status(400).send('Bad Request');
  }
})

const options = {
  key: fs.readFileSync(path.join(__dirname, '/etc/letsencrypt/live/dev1.cyberbunny.online/privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/etc/letsencrypt/live/dev1.cyberbunny.online/fullchain.pem'))
};

https.createServer(options, app).listen(3000, () => {
  console.log('Server started on https://dev1.cyberbunny.online:3000');
});