import { h } from 'preact';

import { Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';

export class Home extends Component {
	state = {
		url: ''
  }

	handleChange = e => {
		this.setState({
			url: e.target.value.trim()
		});
  }

	handleSubmit = e => {
    e.preventDefault();
		if(this.state.url)
			route(this.state.url);
		else
			console.log('Invalid URL')
  }

	render() {
    //TODO replace with unistore
    let { protocol, host } =  {protocol: 'https',host:'localhost:3000'}
		return (
			<form class={style.container} onSubmit={this.handleSubmit}>
        <span class={style.url__base}>
          {protocol}//{host}/
        </span>
        <input
          autoFocus
          class={`${style.url__base} ${style.url__snip}`}
          type="text"
          placeholder="Enter_Your_Snip_URL_Here"
          value={this.state.url}
          onChange={this.handleChange}
        />
			</form>
		);
	}
}
