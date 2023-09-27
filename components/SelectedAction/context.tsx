import {
  ReactNode, createContext, useContext, useReducer
} from 'react';
import { SelectedActionType, selectedActionDefaults, SelectedActionDispatchType } from 'types/SelectedAction';

const SelectedActionContext = createContext<SelectedActionType | null>(null);
const SelectedActionDispatchContext = createContext<SelectedActionDispatchType | null>(null);

function selectedActionReducer(state: SelectedActionType, payload: SelectedActionDispatchType) {
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

export function SelectedActionContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    selectedActionReducer,
    selectedActionDefaults
  );

  return (
    <SelectedActionContext.Provider value={state}>
      <SelectedActionDispatchContext.Provider value={dispatch}>
        {children}
      </SelectedActionDispatchContext.Provider>
    </SelectedActionContext.Provider>
  );
}

export default SelectedActionContextProvider;
