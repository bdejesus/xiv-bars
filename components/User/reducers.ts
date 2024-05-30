import type { UserState, UserDispatchActions } from 'types/User';
import { maxLayouts } from 'lib/user';
import { userActions } from './actions';

export function UserReducer(state: UserState, action: UserDispatchActions) {
  switch (action.type) {
    case userActions.UPDATE_USER: {
      return { ...state, ...action.payload?.user };
    }

    case userActions.UPDATE_LAYOUTS: {
      const layoutsCount = action.payload?.layouts?.length;
      const canPublish = layoutsCount ? layoutsCount > maxLayouts : false;
      return { ...state, layouts: action.payload.layouts, canPublish };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export default UserReducer;
