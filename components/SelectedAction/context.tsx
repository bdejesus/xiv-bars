import React, {
  ReactNode, createContext, useContext, useReducer
} from 'react';
import type {
  SelectedActionState,
  SelectedActionDispatchActions
} from 'types/SelectedAction';
import { SelectedActionAction } from 'components/SelectedAction/actions';

const initialState = { selectedAction: undefined };
const SelectedActionContext = createContext<SelectedActionState>(initialState);
const SelectedActionDispatchContext = createContext<React.Dispatch<SelectedActionDispatchActions>>(() => undefined);

function selectedActionReducer(_state: SelectedActionState, action: SelectedActionDispatchActions) {
  switch (action.type) {
    case SelectedActionAction.SELECT: {
      return { selectedAction: action.payload?.selectedAction };
    }
    case SelectedActionAction.DESELECT: {
      return { selectedAction: undefined };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
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

interface Props {
  children: ReactNode
}

export function SelectedActionContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(
    selectedActionReducer as React.Reducer<SelectedActionState, SelectedActionDispatchActions>,
    initialState
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
