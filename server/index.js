import { h } from 'preact';
import { Provider } from 'unistore/preact';
import App from '../common/src/App';
import createStore from '../common/src/store/store';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');

const render = require('preact-render-to-string');
const docs = require('./routes/docs');
const api = require('./routes/api');
const snipService = require('./services/snip');

const app = express();
const authMiddleware = require('./middlewares/auth');

const db = mongoose.connection;

const config = require('./config');

const PORT = config.port;

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

const HTMLShell = (html, state) => `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="shortcut icon" type="image/png" href="/assets/favicon.ico"/>
        <link rel="stylesheet" href="/main.css"/>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title> Snappit </title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>window.INITIAL_STATE=${JSON.stringify(state).replace(/<|>/g, '')}</script>
        <script src="./app.js"></script>
      </body>
    </html>`;

app.use(express.static(path.join(__dirname, '../public')));

// middleware to parse jwt
app.use('/api', authMiddleware.authHeader);
app.use('/api', api);

app.use('/docs', docs);

// TODO handle lock
app.get('**', async (req, res) => {
  const url = req.path.slice(1);
  const snip = await snipService.findByUrl(url);

  const store = createStore({ snip });
  const state = store.getState();

  const html = render(
    <Provider store={store}>
      <App url={url} />
    </Provider>,
  );

  res.send(HTMLShell(html, state));
});

app.listen(PORT, () => {
  console.log(`Listening to port : ${PORT}`);
});
