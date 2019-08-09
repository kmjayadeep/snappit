import { h, Component } from 'preact';

import './style.css';

export default class Note extends Component {
  handleChange = (e) => {
    const body = {
      url: this.props.url,
      note: e.target.value,
    };
    fetch('/api/snip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(res => res.json())
      .then((res) => {
        console.log(res);
      });
  }

  render() {
    return (
      <textarea
        autoFocus
        placeholder='You can type here...'
        class='note'
        value={this.props.note}
        onChange={this.handleChange}
       />
    );
  }
}
