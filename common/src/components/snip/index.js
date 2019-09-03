import { h, Component } from 'preact';
import { connect } from 'unistore/preact';

import { actions } from '../../store/store';
import NoteService from '../../services';
import Note from '../note';
import StatusBar from '../StatusBar';
import './style.css';

class Snip extends Component {
  componentDidMount() {
    if (!this.props.snip) {
      NoteService.get(this.props.url)
        .then(res => this.props.setNote(res));
    }
  }

  handleChange = (e) => {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      const data = {
        url: this.props.url,
        note: e.target.value,
      };
      this.props.setNote(data);
      this.props.updateStatus('syncing');
      NoteService.save(data)
        .then(() => {
          this.props.updateStatus('saved');
          setTimeout(() => this.props.updateStatus(''), 5000);
        }).catch(() => {
          this.props.updateStatus('error_saving');
        });
    }, 1000);
  }

  render({ snip, status }) {
    return (
      <div class='container'>
        <StatusBar status={status} />
        <Note handleChange={this.handleChange} note={snip ? snip.note : ''} />
      </div>
    );
  }
}

export default connect('snip, status', actions)(Snip);
