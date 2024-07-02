import React, {
  ReactNode,
  createContext,
  useContext,
  useReducer
} from 'react';
import type { SystemProps, SystemDispatchActions } from 'types/System';
import SystemReducer from './reducers';

const defaultState:SystemProps = {
  showModal: false,
  message: undefined,
  isLoading: false
};
const SystemContext = createContext<SystemProps>(defaultState);
const SystemDispatchContext = createContext<React.Dispatch<SystemDispatchActions>>(() => undefined);

export function useSystemState() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystemState must be used within the SystemContextProvider');
  }
  return context;
}

export function useSystemDispatch() {
  const context = useContext(SystemDispatchContext);
  if (context === undefined) {
    throw new Error('useSystemDispatch must be used within the SystemContextProvider');
  }
  return context;
}

interface ContextProps extends SystemProps {
  children: ReactNode
}

export function SystemContextProvider({
  children
}:ContextProps) {
  const [state, dispatch] = useReducer(SystemReducer as React.ReducerWithoutAction<SystemProps>, defaultState);

  return (
    <SystemContext.Provider value={state}>
      <SystemDispatchContext.Provider value={dispatch}>
        {children}
      </SystemDispatchContext.Provider>
    </SystemContext.Provider>
  );
}

export default SystemContextProvider;
