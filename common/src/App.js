import { h } from 'preact';

import Router from 'preact-router';
import Snip from './components/snip';
import Home from './components/home';

import './style/style.css';

export default ({ url }) => (
  <Router url={url}>
    <Home path='/' />
    <Snip path='/:url' />
    <div default />
  </Router>
);
