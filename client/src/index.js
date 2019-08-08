import { h, render } from 'preact';
import { Provider } from 'unistore/preact';
import Routes from './routes';

import createStore from './store/store';

const store = createStore(window.__STATE__);

const app = document.getElementById('app');

render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  app,
  app.lastChild
);
