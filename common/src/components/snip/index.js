import { h, Component } from 'preact';
import { connect } from 'unistore/preact';

import { actions } from '../../store/store';
import NoteService from '../../services';
import Note from '../note';
import './style.css';

class Snip extends Component {
  componentDidMount() {
    NoteService.get(this.props.url)
      .then(res => this.props.setNote(res));
  }

  handleChange = (e) => {
    const data = {
      url: this.props.url,
      note: e.target.value,
    };
    NoteService.save(data)
      .then(res => this.props.setNote(res));
  }

  render({ snip }) {
    return (
      <div class='container'>
        <Note handleChange={this.handleChange} note={snip ? snip.note : ''} />
      </div>
    );
  }
}

export default connect('snip', actions)(Snip);
