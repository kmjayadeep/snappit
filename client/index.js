import { h, render } from 'preact';
import { Provider } from 'unistore/preact';

import createStore from '../common/src/store/store';
import App from '../common/src/App';

const store = createStore(window.INITIAL_STATE);

const app = document.getElementById('app');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  app,
  app.lastChild,
);
