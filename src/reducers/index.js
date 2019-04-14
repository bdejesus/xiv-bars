import initXBars from '../initXBars';
import {
  ADD_ACTION_TO_SLOT,
  REMOVE_ACTION_FROM_SLOT,
  STORE_ACTION
} from '../constants/action-types';

export default (state = initXBars(), action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_ACTION_TO_SLOT:
      // add_action_to_slot()
      console.log(payload.event.currentTarget);
      return Object.assign({}, state, {
        ...state,
        selectedJob: null,
        payload
      });
    case REMOVE_ACTION_FROM_SLOT:
      // remove_action_from_slot()
      return Object.assign({}, state, {
        ...state,
        payload
      });
    case STORE_ACTION:
      // store_action()
      return Object.assign({}, state, {
        ...state,
        payload
      });
    default:
      return state;
  }
};
