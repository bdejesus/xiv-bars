import React, {
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { useRouter } from 'next/router';
import { hotbar, chotbar } from 'lib/xbars';

import Jobs from 'apiData/Jobs.json';
import { ClassJob } from 'types/ClassJob';
import { ActionType } from 'types/Action';
import { AppState, AppData, AppDispatchActions } from 'types/App';
import AppReducer from './reducers';

const defaultState = {
  jobs: Jobs,
  layout: 0,
  readOnly: false,
  xhb: 1,
  wxhb: 0,
  exhb: 0,
  hb: new Array(10).fill(1, 0, 10),
  showPublish: false,
  showTitles: false,
  showAllLvl: false,
  showModal: false,
  selectedJob: undefined,
  encodedSlots: undefined,
  actions: undefined,
  roleActions: undefined,
  viewData: undefined,
  viewAction: undefined,
  message: undefined,
  chotbar: undefined,
  hotbar: undefined,
  slotId: undefined,
  action: undefined,
  hbId: undefined,
  hbConfig: undefined
};

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

interface Props {
  children: ReactNode,
  selectedJob?: ClassJob,
  layout?: number,
  encodedSlots?: string,
  actions?: ActionType[],
  roleActions?: ActionType[],
  readOnly?: boolean,
  viewData?: AppData,
  viewAction?: string,
  hbConfig?: string
}

interface QueryProps {
  [key: string]: string
}

export function AppContextProvider({
  children,
  selectedJob,
  layout,
  encodedSlots,
  actions,
  roleActions,
  readOnly,
  viewData,
  viewAction,
  hbConfig
}: Props) {
  const formatHbConfig = hbConfig?.split(',').map((i) => parseInt(i, 10));
  const router = useRouter();
  const query = router.query as QueryProps;
  const initialState = {
    ...defaultState,
    selectedJob,
    layout: layout || viewData?.layout || parseInt(query.l, 10) || 0,
    encodedSlots,
    actions,
    roleActions,
    readOnly,
    viewData,
    viewAction,
    chotbar,
    hotbar,
    xhb: viewData?.xhb || 1,
    wxhb: viewData?.wxhb || 0,
    exhb: viewData?.exhb || 0,
    hb: formatHbConfig || (viewData?.hb && JSON.parse(viewData?.hb)) || new Array(10).fill(1, 0, 10),
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
