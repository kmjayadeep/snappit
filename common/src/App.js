import { h } from 'preact';

import { Snip } from './components/snip';
import { Home } from './components/home';
import Router from 'preact-router';

export default ({url})=>(
  <Router url={url}>
    <Home path='/' />
    <Snip path='/:url' />
    <div default></div>
  </Router>
);
