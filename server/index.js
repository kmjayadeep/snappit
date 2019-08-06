
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');

const routes = require('./routes/index');
const docs = require('./routes/docs');
const api = require('./routes/api');

const app = express();
const authMiddleware = require('./middlewares/auth');

const db = mongoose.connection;

const config = require('./config');

const PORT = config.port;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'));
app.use(express.static(path.join(__dirname, '../client/public/')));
app.use(logger('dev'));
app.use(helmet());

mongoose.set('useCreateIndex', true);
mongoose.connect(config.dbHost, { useNewUrlParser: true });
const errorLog = console.error.bind(console, 'connection error : ');
db.on('error', errorLog);
db.once('open', () => {
  console.log(`Connected to : ${config.dbHost}`);
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.render('index');
});

if (config.env === 'development')
  app.use('/api', cors());
// middleware to parse jwt
app.use('/api', authMiddleware.authHeader);
app.use('/api', api);

app.use('/docs', docs);
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Listening to port : ${PORT}`);
});
