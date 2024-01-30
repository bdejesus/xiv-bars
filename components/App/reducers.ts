import { buildHotbars, buildCrossHotbars } from 'lib/xbars';
import type { AppState, AppDispatchActions } from 'types/App';
import { setActionToSlot, setActionsToSlots } from 'lib/utils/slots';
import { defaultState } from 'components/App/defaultState';
import { AppActions } from 'components/App/actions';

export default function AppReducer(state: AppState, action: AppDispatchActions) {
  const { layout } = state;
  switch (action.type) {
    case AppActions.SLOT_ACTIONS: {
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

    case AppActions.SLOT_ACTION: {
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

    case AppActions.TOGGLE_TITLES: {
      return { ...state, showTitles: !state.showTitles };
    }

    case AppActions.TOGGLE_LVLS: {
      return { ...state, showAllLvl: !state.showAllLvl };
    }

    case AppActions.EDIT_LAYOUT: {
      return {
        ...state,
        readOnly: false,
        showPublish: true,
        message: undefined
      };
    }

    case AppActions.PUBLISH_LAYOUT: {
      return { ...state, showPublish: true, message: undefined };
    }

    case AppActions.CANCEL_EDITS: {
      return {
        ...state,
        readOnly: true,
        showPublish: true,
        message: undefined
      };
    }

    case AppActions.LAYOUT_SAVED: {
      return {
        ...state,
        ...action.payload,
        readOnly: true,
        showPublish: false,
        viewAction: 'show'
      };
    }

    case AppActions.INITIALIZE: {
      return {
        ...state,
        encodedSlots: defaultState.encodedSlots,
        chotbar: buildCrossHotbars(),
        hotbar: buildHotbars()
      };
    }

    case AppActions.LOAD_JOBACTIONS: {
      return {
        ...state,
        actions: action.payload?.actions
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
