const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const app = express();
app.use(cors());
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
