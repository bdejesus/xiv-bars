import { buildHotbars, buildCrossHotbars } from 'lib/xbars';
import type { AppState, AppDispatchActions } from 'types/App';
import { setActionToSlot, setActionsToSlots } from 'lib/utils/slots';
import { defaultState } from 'components/App/defaultState';
import { AppAction } from 'components/App/actions';

export default function AppReducer(state: AppState, action: AppDispatchActions) {
  const { layout } = state;
  switch (action.type) {
    case AppAction.SLOT_ACTIONS: {
      const slottedActions = (action.payload?.encodedSlots)
        ? setActionsToSlots({
          encodedSlots: action.payload.encodedSlots,
          layout: layout || defaultState.layout,
          actions: state.actions,
          roleActions: state.roleActions
        })
        : undefined;

      return {
        ...state,
        ...action.payload,
        ...slottedActions
      };
    }

    case AppAction.SLOT_ACTION: {
      if (action.payload?.action && action.payload?.slotID) {
        const encodedSlots = setActionToSlot({
          action: action.payload.action,
          slotID: action.payload.slotID,
          encodedSlots: state.encodedSlots,
          layout
        });
        return { ...state, encodedSlots };
      }
      return state;
    }

    case AppAction.TOGGLE_TITLES: {
      return { ...state, showTitles: !state.showTitles };
    }

    case AppAction.TOGGLE_LVLS: {
      return { ...state, showAllLvl: !state.showAllLvl };
    }

    case AppAction.TOGGLE_MODAL: {
      return { ...state, showModal: !state.showModal };
    }

    case AppAction.EDIT_LAYOUT: {
      return {
        ...state,
        readOnly: false,
        showPublish: true,
        message: undefined
      };
    }

    case AppAction.PUBLISH_LAYOUT: {
      return { ...state, showPublish: true, message: undefined };
    }

    case AppAction.CANCEL_LAYOUT: {
      return {
        ...state,
        showPublish: false,
        readOnly: state.viewAction === 'show',
        message: undefined
      };
    }

    case AppAction.LAYOUT_SAVED: {
      return {
        ...state,
        ...action.payload,
        readOnly: true,
        showPublish: false,
        viewAction: 'show'
      };
    }

    case AppAction.UPDATE_MESSAGE: {
      if (action.payload?.message) {
        return { ...state, message: action.payload.message };
      }
      return state;
    }

    case AppAction.INITIALIZE: {
      const newState = {
        ...state,
        encodedSlots: defaultState.encodedSlots,
        chotbar: buildCrossHotbars(),
        hotbar: buildHotbars()
      };

      return newState;
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
