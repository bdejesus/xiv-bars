import initXBars from '../initXBars';
import {
  ADD_ACTION_TO_SLOT,
  REMOVE_ACTION_FROM_SLOT,
  STORE_ACTION
} from '../constants/action-types';

export default (state = initXBars(), action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_ACTION_TO_SLOT: {
      const bars = state.bars.primary;
      const slotId = Number.parseInt(
        payload.event.currentTarget.getAttribute('id'),
        10
      );
      const slot = bars.find(s => s.id === slotId);
      slot.action = payload.action;

      return Object.assign({}, state, {
        ...state,
        bars: {
          primary: bars
        }
      });
    }
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
        selectedAction: payload.selectedAction
      });
    default:
      return state;
  }
};
