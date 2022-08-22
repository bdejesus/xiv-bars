import { createContext, useContext, useReducer } from 'react';
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

export function useSelectedActionState() {
  const context = useContext(SelectedActionContext);
  if (context === undefined) {
    throw new Error('useSelectedActionState must be used within a SelectedActionContextProvider');
  }
  return context;
}

export function useSelectedActionDispatch() {
  const context = useContext(SelectedActionDispatchContext);
  if (context === undefined) {
    throw new Error('useSelectedActionDispatch must be used within a SelectedActionContextProvider');
  }
  return context;
}

export function SelectedActionContextProvider({ children }) {
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
