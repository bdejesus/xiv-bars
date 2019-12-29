import React, { createContext, useReducer } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { xbars, hotbars, layouts } from 'data/xbars';

const XIVBarsContext = createContext();
const XIVBarsDispatchContext = createContext();

function XIVBarsReducer(state, payload) {
  const { layout } = state;

  switch (payload.type) {
    case 'updateLayout': {
      return { ...state, layout: payload.layout };
    }
    case 'loadActionsToSlots': {
      const { slottedActions } = payload;
      const slots = state[layouts[layout]];

      slottedActions.forEach((actionGroup, groupIndex) => {
        const groupName = Object.keys(slots)[groupIndex];
        const slotGroup = state[layouts[layout]][groupName];

        actionGroup.forEach((actionID, slotIndex) => {
          const slottedAction = state.actions.find((action) => action.ID === actionID);
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
        const string = Object.values(state[layouts[layout]])
          .map(
            (arr) => `[${Object.values(arr)
              .map((obj) => (obj.action && obj.action.ID ? obj.action.ID : '0'))
              .toString()}]`
          )
          .toString();
        return `[${string}]`;
      };

      return { ...state, encodedSlots: stringifiedSlots() };
    }
    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}

function useXIVBarsState() {
  const context = React.useContext(XIVBarsContext);
  if (context === undefined) {
    throw new Error('useXIVBarsState must be used within the XIVBarsContextProvider');
  }
  return context;
}

function useXIVBarsDispatch() {
  const context = React.useContext(XIVBarsDispatchContext);
  if (context === undefined) {
    throw new Error('useXIVBarsDispatch must be used within the XIVBarsContextProvider');
  }
  return context;
}

function XIVBarsContextProvider({ children, actions }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    XIVBarsReducer, {
      xbars,
      hotbars,
      layout: parseInt(router.query.l, 10) || 0,
      encodedSlots: '',
      actions
    }
  );

  return (
    <XIVBarsContext.Provider value={state}>
      <XIVBarsDispatchContext.Provider value={dispatch}>
        {children}
      </XIVBarsDispatchContext.Provider>
    </XIVBarsContext.Provider>
  );
}

XIVBarsContextProvider.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired
};

export default XIVBarsContextProvider;
export {
  XIVBarsContextProvider,
  useXIVBarsState,
  useXIVBarsDispatch
};
