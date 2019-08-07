import { Component } from 'preact';
import { Router } from 'preact-router';
import { Snip } from './snip/';
import { Home } from './home/';

export default class App extends Component {
	render() {
		return (
      <Router>
        <Home path='/' />
        <Snip path='/:url' />
      </Router>
		);
	}
}