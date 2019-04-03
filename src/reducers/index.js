import initXBars from '../initXBars';

export const ADD_TO_SLOT = 'ADD_TO_SLOT';
export const REMOVE_FROM_SLOT = 'REMOVE_FROM_SLOT';

export default (state = initXBars(), action) => {
  switch (action.type) {
    case ADD_TO_SLOT:
      // add_from_slot()
      return Object.assign({}, state, {
        ...state
      });
    case REMOVE_FROM_SLOT:
      // remove_from_slot()
      return Object.assign({}, state, {
        ...state
      });
    default:
      return state;
  }
};
