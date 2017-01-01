const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const moment = require('moment');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/export', (req, res, next) => {
  const filename = 'Free Write ' + moment().format('M-D-YY h.ma') + '.txt';
  res.setHeader('Content-disposition', 'attachment; filename="' + filename);
  res.setHeader('Content-type', 'text/plain');
  res.send(req.body['user-text']);
})

const router = express.Router();
app.use('/api', router);

router.get('/', (req, res, next) => {
  res.send('heyyyy, you made an api call!');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, function () {
  console.log('Server running at http://127.0.0.1:' + port + '/');
});