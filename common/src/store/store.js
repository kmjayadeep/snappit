import createStore from 'unistore';

export const actions = () => ({
  setNote(state, snip) {
    return {
      ...state,
      snip,
    };
  },
});

export default initialState => createStore(initialState);
