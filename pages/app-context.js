import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import XIVAPI from 'xivapi-js';

const api = new XIVAPI();
const TooltipContext = createContext();
const TooltipDispatchContext = createContext();

function tooltipReducer(state, payload) {
  switch (payload.type) {
    case 'hide': {
      return {
        content: {},
        position: { left: 0, top: 0 }
      };
    }
    case 'startUpdate': {
      return {
        content: {},
        position: { left: 0, top: 0 }
      };
    }
    case 'finishUpdate': {
      const { content, position } = payload;
      return {
        content: { Name: content.Name, Description: content.Description },
        position
      };
    }
    case 'updateFailed': {
      throw new Error(payload.error);
    }
    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}

function useTooltipState() {
  const context = React.useContext(TooltipContext);
  if (context === undefined) {
    throw new Error('useTooltipState must be used within a AppContextProvider');
  }
  return context;
}

function useTooltipDispatch() {
  const context = React.useContext(TooltipDispatchContext);
  if (context === undefined) {
    throw new Error('useTooltipDispatch must be used within an AppContextProvider');
  }
  return context;
}

async function updateTooltip(dispatch, data) {
  const { action, position } = data;
  dispatch({ type: 'startUpdate', data });
  try {
    const content = await api.data.get('Action', action.ID);
    dispatch({ type: 'finishUpdate', content, position });
  } catch (error) {
    dispatch({ type: 'updateFailed', error });
  }
}

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    tooltipReducer,
    { content: {}, position: { left: 0, top: 0 } }
  );

  return (
    <TooltipContext.Provider value={state}>
      <TooltipDispatchContext.Provider value={dispatch}>
        {children}
      </TooltipDispatchContext.Provider>
    </TooltipContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired
};

export default AppContextProvider;
export {
  useTooltipState, useTooltipDispatch, updateTooltip
};
