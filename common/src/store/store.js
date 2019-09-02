import createStore from 'unistore';

export const actions = () => ({
  setNote(state, snip) {
    return {
      ...state,
      snip,
    };
  },
  updateStatus(state, status) {
    return {
      ...state,
      status,
    };
  },
});
export default initialState => createStore(initialState);
