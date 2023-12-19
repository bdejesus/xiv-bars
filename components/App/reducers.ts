import { layouts, hotbarKeyPos } from 'lib/xbars';
import type { AppState, AppDispatchActions } from 'types/App';
import { setActionToSlot, setActionsToSlots } from 'lib/utils/slots';
import { AppAction } from './actions';

export default function AppReducer(state: AppState, action: AppDispatchActions) {
  const { layout } = state;
  const layoutKey = layouts[layout as keyof typeof layouts];
  const slots = state[layoutKey as keyof typeof state];

  switch (action.type) {
    case AppAction.UPDATE_UI: {
      return { ...state, ...action.payload };
    }

    case AppAction.UPDATE_LAYOUT: {
      if (action.payload) {
        return { ...state, layout: action.payload.layout };
      }
      return state;
    }

    case AppAction.UPDATE_HB_LAYOUT: {
      if (action.payload?.hbId) {
        const position = hotbarKeyPos(action.payload.hbId);
        const configValue = action.payload.hbConfig;
        const updatedHb = configValue ? state.hb?.toSpliced(position, 1, configValue) : state.hb;
        return { ...state, hb: updatedHb };
      }
      return state;
    }

    case AppAction.SLOT_ACTIONS: {
      if (action.payload?.encodedSlots) {
        setActionsToSlots({
          encodedSlots: action.payload.encodedSlots,
          layout,
          slots: slots as object,
          actions: state.actions,
          roleActions: state.roleActions
        });
      }
      return {
        ...state,
        xhb: action.payload?.xhb || state.xhb || 0,
        wxhb: action.payload?.xhb || state.wxhb || 0,
        exhb: action.payload?.xhb || state.exhb || 0,
        hb: action.payload?.hb || state.hb,
        encodedSlots: action.payload?.encodedSlots || undefined
      };
    }

    case AppAction.SLOT_ACTION: {
      const encodedSlots = setActionToSlot({
        action: action.payload?.action,
        slotID: action.payload?.slotID,
        slots: slots as object
      });
      return { ...state, encodedSlots };
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
        message: undefined,
        layout: state.viewData?.layout || state.layout
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
        message: undefined,
        layout: state.viewData?.layout || state.layout
      };
    }

    case AppAction.SAVE_LAYOUT: {
      if (action.payload?.viewData) {
        return {
          ...state,
          readOnly: true,
          viewData: { ...state.viewData, ...action.payload.viewData },
          showPublish: false,
          viewAction: 'show',
          message: { type: 'success', body: 'Success!' }
        };
      }
      return state;
    }

    case AppAction.UPDATE_MESSAGE: {
      if (action.payload?.message) {
        return { ...state, message: action.payload.message };
      }
      return state;
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
