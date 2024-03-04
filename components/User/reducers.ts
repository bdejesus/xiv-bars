import type { UserState, UserDispatchActions } from 'types/User';
import { maxLayouts } from 'lib/user';
import { UserActions } from './actions';

export function UserReducer(state: UserState, action: UserDispatchActions) {
  switch (action.type) {
    case UserActions.UPDATE_USER: {
      return { ...state, ...action.payload?.user };
    }

    case UserActions.UPDATE_LAYOUTS: {
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
