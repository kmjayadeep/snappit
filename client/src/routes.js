import { h } from 'preact';

import { Router } from 'preact-router';
import { Snip } from './components/snip/';
import { Home } from './components/home/';

export default ()=>(
  <Router>
    <Home path='/' />
    <Snip path='/:url' />
  </Router>
);
