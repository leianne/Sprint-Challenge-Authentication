const axios = require('axios');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../auth/authenticate');
const db = require('../database/usersModel');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

 function register(req, res) {
  // implement user registration
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10)
  console.log(user)
  db.addUser(user)
    .then(nu => {
      res.status(201).json({message: 'User Created'})
    })
    .catch(err => {
      res.status(401).json({message: 'Please Try Again!'})
    })
}

function login(req, res) {
  // implement user login
  const user = req.body;
  db.findUser(user.username)
    .then(res => {
      bcrypt.compareSync(user.password, res.password, (err, decodedToken) => {
        if(err){
          console.log(err)
        } else {
          console.log(decodedToken)
        }
      })
    })
    .catch(err => {
      res.status(500).json({message: 'Invalid Credentials'})
    })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
