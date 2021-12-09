import React, { createContext, useReducer } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { chotbar, hotbar } from 'lib/xbars';
import AppReducer from './reducers';

const AppContext = createContext();
const AppDispatchContext = createContext();

function useAppState() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within the AppContextProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within the AppContextProvider');
  }
  return context;
}

function AppContextProvider({
  children, actions, roleActions, host, encodedSlots
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    AppReducer, {
      chotbar,
      hotbar,
      layout: parseInt(router.query.l, 10) || 0,
      encodedSlots,
      actions,
      roleActions,
      host,
      expandedHotbars: !!encodedSlots
    }
  );

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired,
  host: PropTypes.string,
  encodedSlots: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.string
    )
  )
};

AppContextProvider.defaultProps = {
  roleActions: undefined,
  host: undefined,
  encodedSlots: undefined
};

export default AppContextProvider;
export {
  AppContextProvider,
  useAppState,
  useAppDispatch
};
