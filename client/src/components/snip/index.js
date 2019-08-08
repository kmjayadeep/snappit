import { h } from 'preact';

import { Component } from 'preact';
import { Note } from '../note';
import style from './style.css';

export class Snip extends Component {
  componentDidMount() {
    console.log(this.props.url);
    fetch(`http://localhost:3000/api/snip/${this.props.url}`).then(res => res.json())
    .then(res => {
      this.setState({
        snip: res
      });
    });
  }
	render({url}, {snip}) {
		return (
			<div class={style.container}>
        <Note note={snip ? snip.note : ''} url={url} />
			</div>
		);
	}
}
