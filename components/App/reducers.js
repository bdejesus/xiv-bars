import { layouts, hotbarKeyPos } from 'lib/xbars';
import ACTION_TYPE from 'data/ActionType.json';
import BUDDY_ACTION from '.apiData/BuddyAction.json';
import COMPANY_ACTION from '.apiData/CompanyAction.json';
import GENERAL_ACTION from '.apiData/GeneralAction.json';
import MAIN_COMMAND from '.apiData/MainCommand.json';
import MACRO_ICON from '.apiData/MacroIcon.json';
import PET_ACTION from '.apiData/PetAction.json';
import { group } from 'lib/utils/array';

export default function AppReducer(state, payload) {
  const { layout } = state;

  function assignActionIds(slots) {
    return Object.values(slots).map(({ action }) => {
      if (action && action.ID) {
        return (typeof action.Prefix !== 'undefined')
          ? `${action.Prefix}${action.ID}`
          : `${action.ID}`;
      }
      return '0';
    });
  }

  function encodeSlots() {
    const slotIDs = Object.values(state[layouts[layout]]);
    const slotsQuery = slotIDs.map((arr) => assignActionIds(arr));
    const queryString = slotsQuery
      .reduce((flat, next) => flat.concat(next), [])
      .join(',');
    return queryString;
  }

  function setActionToSlot() {
    // update slotted actions
    const [parent, id] = payload.slotID.split('-');
    const slot = { parent, id: id - 1 };
    const slotObject = state[layouts[layout]][slot.parent][slot.id];
    slotObject.action = payload.action;
    // update slots string query
    return encodeSlots();
  }

  function getActionKey(actionType) {
    if (actionType) {
      switch (actionType) {
        case ACTION_TYPE.BuddyAction.prefix: return BUDDY_ACTION;
        case ACTION_TYPE.CompanyAction.prefix: return COMPANY_ACTION;
        case ACTION_TYPE.GeneralAction.prefix: return GENERAL_ACTION;
        case ACTION_TYPE.MainCommand.prefix: return MAIN_COMMAND;
        case ACTION_TYPE.MacroIcon.prefix: return MACRO_ICON;
        case ACTION_TYPE.PetAction.prefix: return PET_ACTION;
        case 'r': return state.roleActions;
        default: return state.actions;
      }
    }

    return state.actions;
  }

  function setActionsByGroup(slotGroup, actionID, slotIndex) {
    const actionPrefixes = Object.values(ACTION_TYPE)
      .map((type) => type.prefix);
    const prefixes = [...actionPrefixes, 'r'].join('|');
    const actionRegex = new RegExp(prefixes);
    const IDString = actionID.toString();
    const typeMatch = IDString.match(actionRegex);
    const actionType = typeMatch ? typeMatch[0] : null;
    const parsedID = parseInt(IDString.replace(actionType, ''), 10);

    const slottedAction = getActionKey(actionType)
      .find((action) => action.ID === parsedID);
    // eslint-disable-next-line no-param-reassign
    if (slottedAction && slotGroup[slotIndex]) slotGroup[slotIndex].action = slottedAction;
  }

  function setActionsToSlot(encodedSlots) {
    const slots = state[layouts[layout]];
    const slottedActions = state.layout === 1
      ? group(encodedSlots.split(','), 12)
      : group(encodedSlots.split(','), 16);
    slottedActions.forEach((actionGroup, groupIndex) => {
      const groupName = Object.keys(slots)[groupIndex];
      const slotGroup = state[layouts[layout]][groupName];
      actionGroup
        .forEach((actionID, slotIndex) => setActionsByGroup(slotGroup, actionID, slotIndex));
    });
  }

  switch (payload.type) {
    case 'updateUI': {
      return { ...state, ...payload.params };
    }

    case 'updateLayout': {
      return { ...state, layout: payload.layout };
    }

    case 'updateHotbarLayout': {
      const position = hotbarKeyPos(payload.hbId);
      const configValue = parseInt(payload.hbConfig, 10);
      const updatedHb = state.hb.toSpliced(position, 1, configValue);
      return { ...state, hb: updatedHb };
    }

    case 'bulkLoadActionsToSlots': {
      const {
        xhb, wxhb, exhb, encodedSlots, hb
      } = payload.params;

      setActionsToSlot(encodedSlots);

      return {
        ...state,
        xhb: parseInt(xhb, 10) || state.xhb,
        wxhb: parseInt(wxhb, 10) || state.wxhb,
        exhb: parseInt(exhb, 10) || state.exhb,
        hb: hb || state.hb,
        encodedSlots
      };
    }

    case 'setActionToSlot': {
      const encodedSlots = setActionToSlot();
      return { ...state, encodedSlots };
    }

    case 'toggleTitles': {
      return { ...state, showTitles: !state.showTitles };
    }

    case 'toggleAllLvl': {
      return { ...state, showAllLvl: !state.showAllLvl };
    }

    case 'toggleModal': {
      return { ...state, showModal: !state.showModal };
    }

    case 'editLayout': {
      return {
        ...state,
        readOnly: false,
        showPublish: true,
        message: undefined,
        layout: state.viewData?.layout || state.layout
      };
    }

    case 'publishLayout': {
      return { ...state, showPublish: true, message: undefined };
    }

    case 'cancelPublish': {
      return {
        ...state,
        showPublish: false,
        readOnly: state.viewAction === 'show',
        message: undefined,
        layout: state.viewData?.layout || state.layout
      };
    }

    case 'saveLayout': {
      return {
        ...state,
        readOnly: true,
        viewData: payload.viewData,
        showPublish: false,
        viewAction: 'show',
        message: { type: 'success', body: 'Success!' }
      };
    }

    case 'setMessage': {
      return { ...state, message: payload.message };
    }

    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}
