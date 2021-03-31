const express = require ('express');
const bodyParser = require ('body-parser');
const activities = require('./activities')

// MODEL:
const brain = require ('brain.js')
const data = require('./sentimentData.json');

const network = new brain.recurrent.LSTM();

const trainingData = data.map(item => ({
  input: item.input,
  output: item.output
}));

network.train(trainingData, {
  iterations: 300,
  // errorThresh: 0.019,
  log: (status) => console.log(status)
});


// EXPRESS:
const app = express();

app.set('view engine', 'ejs')

const urlencodedParser = bodyParser.urlencoded({extended:false})

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.render('home')
})

app.get('/getStarted', function (req, res) {
  res.render('name')
})

app.post('/getStarted', urlencodedParser, function (req, res) {
  const name = req.body.name
  console.log(`Hello ${name}`)
  res.render('intake', {
    name: req.body.name,
  })
})

app.post('/predict', urlencodedParser, function (req, res) {
  console.log(req.body.message)
  // runs user input through model;
  const result = network.run(req.body.message)
  console.log(`sentiment: ${result}`)
  res.render('results', {
    myData: req.body.message,
    resultData: result,
    activities: activities
  })
})

const PORT = 3000
app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`)
})

