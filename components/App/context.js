import React, { createContext, useReducer } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { xbars, hotbars, layouts } from 'lib/xbars';
import ACTION_TYPE from 'lib/actionType';
import BUDDY_ACTION from 'bin/BuddyAction';
import COMPANY_ACTION from 'bin/CompanyAction';
import GENERAL_ACTION from 'bin/GeneralAction';
import MAIN_COMMAND from 'bin/MainCommand';
import MACRO_ICON from 'bin/MacroIcon';
import PET_ACTION from 'bin/PetAction';

const AppContext = createContext();
const AppDispatchContext = createContext();

function AppReducer(state, payload) {
  const { layout } = state;

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
          const actionType = actionID.match(actionRegex);
          const parsedID = parseInt(actionID.replace(actionType, ''), 10);

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
      const stringifiedSlots = () => {
        const slotIDs = Object.values(state[layouts[layout]]);
        const queryString = slotIDs.map((arr) => {
          const group = Object.values(arr).map((obj) => {
            if (obj.action && obj.action.ID) {
              if (typeof obj.action.Prefix !== 'undefined') {
                return `${obj.action.Prefix}${obj.action.ID}`;
              }
              return `${obj.action.ID}`;
            }
            return '0';
          });

          return group;
        });

        return JSON.stringify(queryString);
      };

      return { ...state, encodedSlots: stringifiedSlots() };
    }
    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}

function useAppState() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within the AppContextProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within the AppContextProvider');
  }
  return context;
}

function AppContextProvider({
  children, actions, roleActions, host
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    AppReducer, {
      xbars,
      hotbars,
      layout: parseInt(router.query.l, 10) || 0,
      encodedSlots: '',
      actions,
      roleActions,
      host
    }
  );

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired,
  host: PropTypes.string
};

AppContextProvider.defaultProps = {
  roleActions: undefined,
  host: undefined
};

export default AppContextProvider;
export {
  AppContextProvider,
  useAppState,
  useAppDispatch
};
