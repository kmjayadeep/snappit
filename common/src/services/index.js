const NoteService = {
  save: data => fetch('/api/snip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  get: url => fetch(`/api/snip/${url}`)
    .then(res => res.json()),
};

export default NoteService;
