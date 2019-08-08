import { h, render } from 'preact';
import { Provider } from 'unistore/preact';
import { Router } from 'preact-router';

import createStore from '../common/src/store/store';
import App from '../common/src/App';

const store = createStore(window.__STATE__);

const app = document.getElementById('app');

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  app,
  app.lastChild
);
