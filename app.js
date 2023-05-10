const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const password = req.body.password;
  if (password === process.env.PASSWORD) {
    res.send('Logged in successfully!');
  } else {
    res.send('Incorrect password');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
