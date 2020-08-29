import React, { createContext, useReducer } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { xbars, hotbars, layouts } from 'lib/xbars';
import ACTION_TYPE from 'data/actionType';
import MAIN_COMMANDS from 'bin/MainCommand';
import MACROS from 'bin/MacroIcon';
import GENERAL_ACTIONS from 'bin/GeneralAction';

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
          const actionRegex = new RegExp(/[c|g|m|r]/);
          const actionType = actionID.match(actionRegex);
          const parsedID = parseInt(actionID.replace(actionType, ''), 10);

          const actionLib = () => {
            if (actionType) {
              switch (actionType.toString()) {
                case ACTION_TYPE.MainCommand: return MAIN_COMMANDS;
                case ACTION_TYPE.GeneralAction: return GENERAL_ACTIONS;
                case ACTION_TYPE.MacroIcon: return MACROS;
                case ACTION_TYPE.RoleAction: return state.roleActions;
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

function AppContextProvider({ children, actions, roleActions }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    AppReducer, {
      xbars,
      hotbars,
      layout: parseInt(router.query.l, 10) || 0,
      encodedSlots: '',
      actions,
      roleActions
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
  ]).isRequired
};

AppContextProvider.defaultProps = {
  roleActions: undefined
};

export default AppContextProvider;
export {
  AppContextProvider,
  useAppState,
  useAppDispatch
};
