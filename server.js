const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Origin', 'https://tunesurge.netlify.app/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;



app.post('/refresh', (req,res) => {
  const refreshToken = req.body.refreshToken;

  const refreshData = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: client_id,
      password: client_secret,
    },
    data: qs.stringify(refreshData)
  }).then((response) => {
    res.json({
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in
    })
  }).catch((err) => {
    res.sendStatus(400);
  })
});

app.post('/login', (req, res) => {
  const authCode = req.body.code;

  const accessData = {
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: redirect_uri
  };

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: client_id,
      password: client_secret,
    },
    data: qs.stringify(accessData)
  }).then((response) => {
    res.json({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    })
  }).catch((err) => {
    console.error(err);
    res.sendStatus(400);
  })
});

app.listen(5000);
