
var express = require('express');
var app = express();
const request = require('request');
const sql = require('mssql');
const bodyParser = require('body-parser');
// New Libs
const sanitizer = require('sanitizer');
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid')

// Subscription endpoints
const subscriptionKey = "bcae16414b29423cab25c8480a519339";
const endpoint = "https://api.cognitive.microsofttranslator.com";
const location = "westus2";

// Set the View Engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Set up the server
// process.env.PORT is related to deploying on AWS
var server = app.listen(process.env.PORT || 5000, listen);
module.exports = server;
path = require('path');



// Send the index.ejs file
app.get('/', async (req, res) => {
  res.render('public/index')
})

app.post('/translate', async (req, res) => {
  // Debugging
  console.log(req.body)

  // Sanitize data
  const inputVal = sanitizer.sanitize(req.body.txtInput)
  const language = sanitizer.sanitize(req.body.language)


  // Get data from Microsoft API
  axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: {
        'api-version': '3.0',
        'from': 'en',
        'to': [language]
    },
    data: [{
        'text': inputVal
    }],
    responseType: 'json'
  }).then(function(response){
    //console.log(JSON.stringify(response.data, null, 4))

    res.render('public/index', {"item": response.data[0].translations[0].text})

  })
  .catch(function (error) {
    console.log(error)
  })


})



// ***********************************************
// Be sure any routes are setup before this!
// Set the folder for public items
publicDir = path.join(__dirname,'public');
app.use(express.static(publicDir))
app.set('views', __dirname);
app.use(express.urlencoded({ extended: true }))

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}