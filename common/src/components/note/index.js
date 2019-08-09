import { h } from 'preact';
import { Component } from 'preact';
import './style.css';

export class Note extends Component {
  handleChange = e => {
    let body = {
      'url': this.props.url,
      'note': e.target.value,
    }
    fetch('/api/snip', {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(body)
    }).then(res => res.json())
    .then(res => {
      console.log(res)
    });
  }
	render({url}) {
		return (
      <textarea
        autoFocus
        placeholder="You can type here..."
        class="note"
        value={this.props.note}
        onChange={this.handleChange}
      ></textarea>
		);
	}
}
