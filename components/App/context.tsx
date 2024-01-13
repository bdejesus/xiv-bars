import React, {
  ReactNode,
  createContext,
  useContext,
  useReducer
} from 'react';
import { hotbar, chotbar } from 'lib/xbars';
import { defaultState } from 'components/App/defaultState';
import type { AppState, AppDispatchActions } from 'types/App';
import AppReducer from './reducers';

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

interface ContextProps extends AppState {
  children: ReactNode,
  viewAction?: string,
}

export function AppContextProvider({
  children,
  selectedJob,
  layout,
  encodedSlots,
  actions,
  roleActions,
  readOnly,
  user,
  xhb,
  wxhb,
  exhb,
  hb,
  layoutId,
  title,
  description,
  viewAction
}:ContextProps) {
  const initialState = {
    ...defaultState,
    layout: layout || defaultState.layout,
    hb: hb || defaultState.hb,
    xhb: xhb || defaultState.xhb,
    wxhb: wxhb || defaultState.wxhb,
    exhb: exhb || defaultState.exhb,
    readOnly,
    selectedJob,
    encodedSlots,
    user,
    viewAction,
    roleActions,
    actions,
    chotbar,
    hotbar,
    layoutId,
    title,
    description
  };

  const [state, dispatch] = useReducer(AppReducer as React.ReducerWithoutAction<AppState>, initialState);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export default AppContextProvider;

AppContextProvider.defaultProps = {
  viewAction: undefined
};
