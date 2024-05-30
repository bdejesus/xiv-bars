import React, {
  createContext, useContext, useReducer, useEffect, ReactNode
} from 'react';
import { useSession } from 'next-auth/react';
import { maxLayouts } from 'lib/user';
import type { UserState, UserDispatchActions } from 'types/User';
import { userActions } from './actions';
import UserReducer from './reducers';

const initialState = {
  loggedIn: false,
  canPublish: false,
  layouts: []
};

const UserContext = createContext<UserState>(initialState);
const UserDispatchContext = createContext<React.Dispatch<UserDispatchActions>>(() => undefined);

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

interface Props {
  children: ReactNode
}

export function UserProvider({ children }: Props) {
  const { data: session, status } = useSession();
  const [state, dispatch] = useReducer(UserReducer as React.Reducer<UserState, UserDispatchActions>, initialState);

  useEffect(() => {
    const layoutsCount = session?.user?._count?.layouts || 0;
    const canPublish = layoutsCount < maxLayouts;
    dispatch({
      type: userActions.UPDATE_USER,
      payload: {
        user: { loggedIn: status === 'authenticated', canPublish }
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

export default UserProvider;
