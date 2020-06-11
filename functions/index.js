// http://localhost:5000/functions-6e9db/us-central1/helloWorld
// 上のURLにアクセスすると
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// }); が動作する
// delpoy URL
// https://us-central1-functions-6e9db.cloudfunctions.net/helloWorld
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const functions = require('firebase-functions');
const express = require('express');
const requestPromise = require('request-promise-native');
const cors = require('cors');

const app = express();

// app.use(cors());

const getDataFromAPI = async (keyword) => {
  const requestUrl =
    'https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle:';
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

const getDataFromStockAPI = async (tikcerName) => {
  const result = await requestPromise(
    `https://api.tiingo.com/tiingo/daily/${tikcerName}/prices?token=30db6bf2c3da3d5008e46f03541e28bb22991d57`
  );
  return result;
};

app.get('/hello', (req, res) => {
  res.send('hello, express');
});

app.get('/user/:userId', async (req, res) => {
  const users = [
    { id: 1, name: 'masanari' },
    { id: 2, name: 'karin' },
    { id: 3, name: 'hori' },
    { id: 4, name: 'hongo' },
    { id: 5, name: 'soso' },
  ];

  const targetUser = users.find(
    (user) => user.id === Number(req.params.userId)
  );
  res.send(targetUser);
});

app.get('/gbooks/:keyword', cors(), async (req, res) => {
  const response = await getDataFromAPI(req.params.keyword);
  res.send(response);
});

app.get('/stocks/:tickerName', cors(), async (req, res) => {
  const response = await getDataFromStockAPI(req.params.tickerName);
  res.send(response);
});

const api = functions.https.onRequest(app);
module.exports = { api };
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });
