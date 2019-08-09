import { h, Component } from 'preact';


import Note from '../note';
import './style.css';

export default class Snip extends Component {
  componentDidMount() {
    console.log(this.props.url);
    fetch(`/api/snip/${this.props.url}`).then(res => res.json())
      .then((res) => {
        this.setState({
          snip: res,
        });
      });
  }

  render({ url }, { snip }) {
    return (
      <div class='container'>
        <Note note={snip ? snip.note : ''} url={url} />
      </div>
    );
  }
}
