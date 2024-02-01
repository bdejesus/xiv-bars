import { buildHotbars, buildCrossHotbars } from 'lib/xbars';
import type { AppState, AppDispatchActions } from 'types/App';
import { setActionToSlot, setActionsToSlots, mergeParamsToView } from 'lib/utils/slots';
import { defaultState } from 'components/App/defaultState';
import { AppActions } from 'components/App/actions';

export function AppReducer(state:AppState, action: AppDispatchActions) {
  const { layout } = state.viewData || {};
  const { type, payload } = action;
  switch (type) {
    case AppActions.LOAD_VIEW_DATA: {
      if (payload?.viewData) {
        const readOnly = payload.viewAction === 'show';
        const viewData = mergeParamsToView({
          params: payload.urlParams,
          viewData: payload.viewData
        });

        const slottedActions = setActionsToSlots({
          encodedSlots: viewData.encodedSlots as string,
          layout: viewData.layout as number,
          actions: payload.actions,
          roleActions: payload.roleActions,
        });

        const newState:AppState = {
          ...state,
          ...payload,
          ...slottedActions,
          viewData,
          readOnly,
        };

        return newState;
      }

      return state;
    }

    case AppActions.SLOT_ACTIONS: {
      const slottedActions = (payload?.viewData?.encodedSlots)
        ? setActionsToSlots({
          encodedSlots: payload.viewData.encodedSlots,
          layout: payload.viewData.layout || defaultState.viewData.layout,
          actions: state.actions,
          roleActions: state.roleActions
        })
        : undefined;

      return {
        ...state,
        ...payload,
        ...slottedActions
      };
    }

    case AppActions.SLOT_ACTION: {
      if (payload?.action && payload?.slotID) {
        const encodedSlots = setActionToSlot({
          action: payload.action,
          slotID: payload.slotID,
          encodedSlots: state.viewData?.encodedSlots,
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
        ...payload,
        encodedSlots: defaultState.viewData?.encodedSlots,
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

export default AppReducer;
