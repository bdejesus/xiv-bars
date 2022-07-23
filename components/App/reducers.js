import { layouts } from 'lib/xbars';
import ACTION_TYPE from 'lib/actionType';
import BUDDY_ACTION from '.apiData/BuddyAction.json';
import COMPANY_ACTION from '.apiData/CompanyAction.json';
import GENERAL_ACTION from '.apiData/GeneralAction.json';
import MAIN_COMMAND from '.apiData/MainCommand.json';
import MACRO_ICON from '.apiData/MacroIcon.json';
import PET_ACTION from '.apiData/PetAction.json';

export default function AppReducer(state, payload) {
  const { layout } = state;
  function assignActionIds(slots) {
    return Object.values(slots)
      .map(({ action }) => {
        if (action && action.ID) {
          return (typeof action.Prefix !== 'undefined')
            ? `${action.Prefix}${action.ID}`
            : `${action.ID}`;
        }
        return '0';
      });
  }

  switch (payload.type) {
    case 'updateLayout': {
      return { ...state, layout: payload.layout };
    }

    case 'bulkLoadActionsToSlots': {
      const { slottedActions } = payload;
      const slots = state[layouts[layout]];

      slottedActions.forEach((actionGroup, groupIndex) => {
        const groupName = Object.keys(slots)[groupIndex];
        const slotGroup = state[layouts[layout]][groupName];

        actionGroup.forEach((actionID, slotIndex) => {
          const actionPrefixes = Object.values(ACTION_TYPE)
            .map((type) => type.prefix);
          const prefixes = [...actionPrefixes, 'r'].join('|');
          const actionRegex = new RegExp(prefixes);
          const IDString = actionID.toString();
          const typeMatch = IDString.match(actionRegex);
          const actionType = typeMatch ? typeMatch[0] : null;
          const parsedID = parseInt(IDString.replace(actionType, ''), 10);

          const actionLib = () => {
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
          };

          const slottedAction = actionLib().find((action) => action.ID === parsedID);

          if (slottedAction) {
            slotGroup[slotIndex].action = slottedAction;
          }
        });
      });

      return { ...state };
    }

    case 'setActionToSlot': {
      // update slotted actions
      const [parent, id] = payload.slotID.split('-');
      const slot = { parent, id: id - 1 };
      const slotObject = state[layouts[layout]][slot.parent][slot.id];
      slotObject.action = payload.action;

      // update slots string query
      const encodeSlots = () => {
        const slotIDs = Object.values(state[layouts[layout]]);
        const slotsQuery = slotIDs.map((arr) => assignActionIds(arr));
        const queryString = slotsQuery
          .reduce((flat, next) => flat.concat(next), [])
          .join(',');
        return queryString;
      };

      return { ...state, encodedSlots: encodeSlots() };
    }

    case 'toggleTitles': {
      return { ...state, showTitles: !state.showTitles };
    }

    case 'toggleAllLvl': {
      return { ...state, showAllLvl: !state.showAllLvl };
    }

    case 'editLayout': {
      return { ...state, readOnly: false };
    }

    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}
