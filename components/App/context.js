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
  jobs,
  selectedJob,
  layout,
  encodedSlots,
  actions,
  roleActions,
  readOnly,
  viewData,
  viewAction
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(AppReducer, {
    jobs,
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
    showPublish: false,
    showTitles: false,
    showAllLvl: false
  });

  useEffect(() => {
    if (encodedSlots) {
      const decodedSlots = state.layout === 1
        ? group(encodedSlots.split(','), 12)
        : group(encodedSlots.split(','), 16);

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
  readOnly: PropTypes.bool,
  viewData: PropTypes.shape(),
  viewAction: PropTypes.oneOf(['show', 'edit', 'new'])
};

AppContextProvider.defaultProps = {
  roleActions: undefined,
  selectedJob: undefined,
  encodedSlots: undefined,
  layout: 0,
  readOnly: false,
  viewData: undefined,
  viewAction: 'show'
};

export default AppContextProvider;
export {
  AppContextProvider,
  useAppState,
  useAppDispatch
};
