import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const SelectedActionContext = createContext();
const SelectedActionDispatchContext = createContext();

function selectedActionReducer(state, payload) {
  switch (payload.type) {
    case 'selectAction': {
      return { selectedAction: payload.selectedAction };
    }
    case 'deselectAction': {
      return { selectedAction: {} };
    }
    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}

function useSelectedActionState() {
  const context = React.useContext(SelectedActionContext);
  if (context === undefined) {
    throw new Error('useSelectedActionState must be used within a SelectedActionContextProvider');
  }
  return context;
}

function useSelectedActionDispatch() {
  const context = React.useContext(SelectedActionDispatchContext);
  if (context === undefined) {
    throw new Error('useSelectedActionDispatch must be used within a SelectedActionContextProvider');
  }
  return context;
}

function SelectedActionContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    selectedActionReducer,
    { selectedAction: {} }
  );

  return (
    <SelectedActionContext.Provider value={state}>
      <SelectedActionDispatchContext.Provider value={dispatch}>
        {children}
      </SelectedActionDispatchContext.Provider>
    </SelectedActionContext.Provider>
  );
}

SelectedActionContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape),
    PropTypes.shape
  ]).isRequired
};

export default SelectedActionContextProvider;
export {
  SelectedActionContextProvider,
  useSelectedActionState,
  useSelectedActionDispatch
};
