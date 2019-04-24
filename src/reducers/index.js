import initXBars from '../initXBars';

import {
  ADD_ACTION_TO_SLOT,
  REMOVE_ACTION_FROM_SLOT,
  STORE_ACTION,
  UPDATE_TOOLTIP
} from '../constants/action-types';

export default (state = initXBars(), action) => {
  const { type, payload } = action;

  switch (type) {
    // addActionToSlot()
    case ADD_ACTION_TO_SLOT: {
      const bars = state.bars[payload.xbar];
      const slotId = Number.parseInt(
        payload.event.currentTarget.getAttribute('id'),
        10
      );

      const slot = bars.find(s => s.id === slotId);
      slot.action = payload.action;

      return Object.assign({}, state, {
        ...state,
        bars: { ...state.bars, [payload.xbar]: bars },
        selectedAction: {}
      });
    }

    // removeActionFromSlot()
    case REMOVE_ACTION_FROM_SLOT:
      return Object.assign({}, state, { ...state, payload });

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
