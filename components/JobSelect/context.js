import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const JobSelectContext = createContext();
const JobSelectDispatchContext = createContext();

function jobSelectReducer(state, payload) {
  switch (payload.type) {
    case 'open': {
      return { isSelectingJob: true };
    }
    case 'close': {
      return { isSelectingJob: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}

function useJobSelectState() {
  const context = React.useContext(JobSelectContext);
  if (context === undefined) {
    throw new Error('useJobSelectState must be used within a JobSelectContextProvider');
  }
  return context;
}

function useJobSelectDispatch() {
  const context = React.useContext(JobSelectDispatchContext);
  if (context === undefined) {
    throw new Error('useJobSelectDispatch must be used within a JobSelectContextProvider');
  }
  return context;
}

function JobSelectContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    jobSelectReducer,
    {}
  );

  return (
    <JobSelectContext.Provider value={state}>
      <JobSelectDispatchContext.Provider value={dispatch}>
        {children}
      </JobSelectDispatchContext.Provider>
    </JobSelectContext.Provider>
  );
}

JobSelectContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired
};

export default JobSelectContextProvider;
export {
  JobSelectContextProvider,
  useJobSelectState,
  useJobSelectDispatch
};
