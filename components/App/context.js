import {
  createContext, useContext, useReducer, useEffect
} from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { hotbar, chotbar } from 'lib/xbars';

import Jobs from '.apiData/Jobs.json';
import AppReducer from './reducers';

const AppContext = createContext();
const AppDispatchContext = createContext();

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
}) {
  const formatHbConfig = hbConfig?.split(',').map((i) => parseInt(i, 10));
  const router = useRouter();
  const [state, dispatch] = useReducer(AppReducer, {
    jobs: Jobs,
    selectedJob,
    layout: layout || viewData?.layout || parseInt(router.query.l, 10) || 0,
    encodedSlots,
    actions,
    roleActions,
    readOnly,
    viewData,
    viewAction,
    message: undefined,
    chotbar,
    hotbar,
    xhb: viewData?.xhb || 1,
    wxhb: viewData?.wxhb || 0,
    exhb: viewData?.exhb || 0,
    hb: formatHbConfig || (viewData?.hb && JSON.parse(viewData?.hb)) || new Array(10).fill(1, 0, 10),
    showPublish: false,
    showTitles: false,
    showAllLvl: false,
    showModal: false
  });

  useEffect(() => {
    if (encodedSlots) {
      dispatch({ type: 'bulkLoadActionsToSlots', params: { encodedSlots } });
    }
  }, [encodedSlots]);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()),
  roleActions: PropTypes.arrayOf(PropTypes.shape()),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired,
  selectedJob: PropTypes.shape({
    ID: PropTypes.number
  }),
  encodedSlots: PropTypes.string,
  layout: PropTypes.number,
  readOnly: PropTypes.bool,
  viewData: PropTypes.shape(),
  viewAction: PropTypes.oneOf(['show', 'edit', 'new']),
  hbConfig: PropTypes.string
};

AppContextProvider.defaultProps = {
  actions: undefined,
  roleActions: undefined,
  selectedJob: undefined,
  encodedSlots: undefined,
  layout: 0,
  readOnly: false,
  viewData: undefined,
  viewAction: 'show',
  hbConfig: undefined
};

export default AppContextProvider;
