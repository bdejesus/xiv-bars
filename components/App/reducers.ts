import { layouts, hotbarKeyPos } from 'lib/xbars';
import ACTION_CAT from 'data/ActionCategory.json';
import BUDDY_ACTION from '.apiData/BuddyAction.json';
import COMPANY_ACTION from '.apiData/CompanyAction.json';
import GENERAL_ACTION from '.apiData/GeneralAction.json';
import MAIN_COMMAND from '.apiData/MainCommand.json';
import MACRO_ICON from '.apiData/MacroIcon.json';
import PET_ACTION from '.apiData/PetAction.json';
import { AppState, AppDispatchActions } from 'types/App';
import { group } from 'lib/utils/array';
import { ActionType, SlotType } from 'types/Action';
import { AppAction } from './actions';

export default function AppReducer(state: AppState, action: AppDispatchActions) {
  const { layout } = state;

  const layoutKey = layouts[layout as keyof typeof layouts];
  const slots = state[layoutKey as keyof typeof state];

  function assignActionIds(slotActions: SlotType[]) {
    return Object.values(slotActions).map((slot) => {
      if (slot.action?.ID) {
        return (typeof slot.action.Prefix !== 'undefined')
          ? `${slot.action.Prefix}${slot.action.ID}`
          : `${slot.action.ID}`;
      }
      return '0';
    });
  }

  function encodeSlots() {
    if (slots) {
      const slotIDs = Object.values(slots);
      const slotsQuery = slotIDs.map((arr) => assignActionIds(arr as SlotType[]));
      const queryString = slotsQuery
        .reduce((flat, next) => flat.concat(next), [])
        .join(',');
      return queryString;
    }
    return null;
  }

  function setActionToSlot() {
    // update slotted actions
    if (action.payload?.slotID) {
      const [parent, id] = action.payload.slotID.split('-');
      const slot = { parent, id: parseInt(id, 10) - 1 };
      const slotObject: { action: object | undefined } = slots
        ? slots[slot.parent as keyof typeof slots][slot.id]
        : { action: undefined };
      if (slotObject) slotObject.action = action.payload.action;
      // update slots string query
      return encodeSlots();
    }
    return null;
  }

  function getActionKey(actionCategory: string | undefined) {
    if (actionCategory) {
      switch (actionCategory) {
        case ACTION_CAT.BuddyAction.prefix: return BUDDY_ACTION;
        case ACTION_CAT.CompanyAction.prefix: return COMPANY_ACTION;
        case ACTION_CAT.GeneralAction.prefix: return GENERAL_ACTION;
        case ACTION_CAT.MainCommand.prefix: return MAIN_COMMAND;
        case ACTION_CAT.MacroIcon.prefix: return MACRO_ICON;
        case ACTION_CAT.PetAction.prefix: return PET_ACTION;
        case 'r': return state.roleActions;
        default: return state.actions;
      }
    }

    return state.actions;
  }

  function setActionsByGroup(slotGroup: { action: ActionType }[], actionID: string, slotIndex: number) {
    const actionPrefixes = Object.values(ACTION_CAT).map((type) => type.prefix);
    const prefixes = [...actionPrefixes, 'r'].join('|');
    const actionRegex = new RegExp(prefixes);
    const IDString = actionID.toString();
    const typeMatch = IDString.match(actionRegex);
    const actionType = typeMatch ? typeMatch[0] : undefined;

    if (actionType) {
      const parsedID = actionType
        ? parseInt(IDString.replace(actionType, ''), 10)
        : parseInt(IDString, 10);
      const slottedAction = getActionKey(actionType)?.find((slotAction: ActionType) => slotAction.ID === parsedID);
      // eslint-disable-next-line no-param-reassign
      if (slottedAction && slotGroup[slotIndex]) slotGroup[slotIndex].action = slottedAction;
    }
  }

  function setActionsToSlot(encodedSlots: string) {
    const slottedActions = state.layout === 1
      ? group(encodedSlots.split(','), 12)
      : group(encodedSlots.split(','), 16);

    slottedActions.forEach((actionGroup, groupIndex) => {
      if (slots) {
        const slotKeys = Object.keys(slots);
        const groupName = slotKeys[groupIndex] as keyof typeof slots;
        const slotGroup = slots[groupName];
        actionGroup
          .forEach((actionID: string, slotIndex: number) => setActionsByGroup(slotGroup, actionID, slotIndex));
      }
    });
  }

  switch (action.type) {
    case AppAction.UPDATE_UI: {
      return { ...state, ...action.payload };
    }

    case AppAction.UPDATE_LAYOUT: {
      if (action.payload?.layout) {
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
        setActionsToSlot(action.payload.encodedSlots);

        return {
          ...state,
          xhb: action.payload.xhb || state.xhb,
          wxhb: action.payload.xhb || state.wxhb,
          exhb: action.payload.xhb || state.exhb,
          hb: action.payload.hb || state.hb,
          encodedSlots: action.payload.encodedSlots
        };
      }
      return state;
    }

    case AppAction.SLOT_ACTION: {
      const encodedSlots = setActionToSlot();
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
          viewData: action.payload.viewData,
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
