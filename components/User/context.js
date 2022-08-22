import PropTypes from 'prop-types';
import {
  createContext, useContext, useReducer, useEffect
} from 'react';
import { useSession } from 'next-auth/react';
import { maxLayouts } from 'lib/user';
import UserReducer from './reducers';

const UserContext = createContext();
const UserDispatchContext = createContext();

export function useUserState() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within the UserProvider');
  }
  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within the UserProvider');
  }
  return context;
}

export function UserProvider({ children }) {
  const { data: session, status } = useSession();
  const defaultState = {
    canPublish: false,
    loggedIn: false
  };
  const [state, dispatch] = useReducer(UserReducer, defaultState);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_USER',
      user: {
        loggedIn: status === 'authenticated',
        canPublish: session?.user._count.layouts < maxLayouts
      }
    });
  }, [status]);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.shape()
  ]).isRequired,
};

export default UserProvider;
