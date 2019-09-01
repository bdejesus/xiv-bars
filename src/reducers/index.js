import initXBars from '../initXBars';

import {
  ADD_ACTION_TO_SLOT,
  STORE_ACTION,
  UPDATE_TOOLTIP
} from '../constants/action-types';

export default (state = initXBars(), action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_ACTION_TO_SLOT: {
      const bars = state.bars[payload.xbar];
      const slotId = payload.event.currentTarget.getAttribute('id');

      const slot = bars.find(s => s.id === slotId);
      slot.action = payload.action;

      return Object.assign({}, state, {
        ...state,
        bars: { ...state.bars, [payload.xbar]: bars }
      });
    }

    // storeAction()
    case STORE_ACTION:
      return Object.assign({}, state, {
        ...state,
        selectedAction: payload.selectedAction
      });

    // showActionTooltip();
    case UPDATE_TOOLTIP: {
      return Object.assign({}, state, {
        ...state,
        tooltip: payload.details
      });
    }

    default:
      return state;
  }
};
