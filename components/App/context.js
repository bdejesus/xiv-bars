import {
  createContext, useContext, useReducer, useEffect
} from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { hotbar, chotbar } from 'lib/xbars';
import { group } from 'lib/utils/array';
import AppReducer from './reducers';

const AppContext = createContext();
const AppDispatchContext = createContext();

function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within the AppContextProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within the AppContextProvider');
  }
  return context;
}

function AppContextProvider({
  children,
  actions,
  roleActions,
  selectedJob,
  jobs,
  encodedSlots,
  layout,
  readOnly
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(AppReducer, {
    jobs,
    selectedJob,
    chotbar,
    hotbar,
    layout: layout || parseInt(router.query.l, 10) || 0,
    encodedSlots,
    actions,
    roleActions,
    showTitles: false,
    showAllLvl: false,
    readOnly
  });

  useEffect(() => {
    if (encodedSlots) {
      const decodedSlots = group(encodedSlots.split(','), 16);
      dispatch({
        type: 'bulkLoadActionsToSlots',
        slottedActions: decodedSlots
      });
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
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
  readOnly: PropTypes.bool
};

AppContextProvider.defaultProps = {
  roleActions: undefined,
  selectedJob: undefined,
  encodedSlots: undefined,
  layout: 0,
  readOnly: false
};

export default AppContextProvider;
export {
  AppContextProvider,
  useAppState,
  useAppDispatch
};
