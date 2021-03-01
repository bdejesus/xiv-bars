import { layouts } from 'lib/xbars';
import ACTION_TYPE from 'lib/actionType';
import BUDDY_ACTION from 'data/BuddyAction';
import COMPANY_ACTION from 'data/CompanyAction';
import GENERAL_ACTION from 'data/GeneralAction';
import MAIN_COMMAND from 'data/MainCommand';
import MACRO_ICON from 'data/MacroIcon';
import PET_ACTION from 'data/PetAction';

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
          const prefixes = [...Object.values(ACTION_TYPE), 'r'].join('|');
          const actionRegex = new RegExp(prefixes);
          const IDString = actionID.toString();
          const actionType = IDString.match(actionRegex);
          const parsedID = parseInt(IDString.replace(actionType, ''), 10);

          const actionLib = () => {
            if (actionType) {
              switch (actionType.toString()) {
                case ACTION_TYPE.BuddyAction: return BUDDY_ACTION;
                case ACTION_TYPE.CompanyAction: return COMPANY_ACTION;
                case ACTION_TYPE.GeneralAction: return GENERAL_ACTION;
                case ACTION_TYPE.MainCommand: return MAIN_COMMAND;
                case ACTION_TYPE.MacroIcon: return MACRO_ICON;
                case ACTION_TYPE.PetAction: return PET_ACTION;
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

    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}
