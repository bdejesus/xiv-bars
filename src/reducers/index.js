import initXBars from '../initXBars';
import { ADD_TO_SLOT, REMOVE_FROM_SLOT } from '../constants/action-types';

export default (state = initXBars(), action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_TO_SLOT:
      // add_from_slot()
      return Object.assign({}, state, {
        ...state,
        payload
      });
    case REMOVE_FROM_SLOT:
      // remove_from_slot()
      return Object.assign({}, state, {
        ...state,
        payload
      });
    default:
      return state;
  }
};
