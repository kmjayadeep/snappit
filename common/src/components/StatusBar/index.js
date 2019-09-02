import { h } from 'preact';
import './style.css';

export default function StatusBar({ status }) {
  if (status === 'syncing') return <div class='statusbar'>⟲ Syncing</div>;
  if (status === 'saved') return <div class='statusbar'>✅ Saved</div>;
  if (status === 'error_saving') return <div class='statusbar'>⚠️ Error Saving</div>;
  return <div class='statusbar'>In Sync</div>;
}
