import React, {
  ReactNode,
  createContext,
  useContext,
  useReducer
} from 'react';
import { defaultState } from 'components/App/defaultState';
import type { AppState, AppDispatchActions } from 'types/App';
import AppReducer from './reducer';

const AppContext = createContext<AppState>(defaultState);
const AppDispatchContext = createContext<React.Dispatch<AppDispatchActions>>(() => undefined);

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within the AppContextProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within the AppContextProvider');
  }
  return context;
}

interface ContextProps {
  children: ReactNode,
}

export function AppContextProvider({ children }: ContextProps) {
  const [state, dispatch] = useReducer(
    AppReducer as React.ReducerWithoutAction<AppState>,
    defaultState
  );

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export default AppContextProvider;
