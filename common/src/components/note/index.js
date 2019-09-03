import { h } from 'preact';

import './style.css';

const Note = ({ note, handleChange }) => (
  <textarea
    autoFocus
    placeholder='You can type here...'
    class='note'
    value={note}
    onInput={handleChange}
   />
);

export default Note;
