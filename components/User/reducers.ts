import type { UserState, UserDispatchActions } from 'types/User';
import { maxLayouts } from 'lib/user';
import { UserActions } from './actions';

export default function UserReducer(state: UserState, action: UserDispatchActions) {
  switch (action.type) {
    case UserActions.UPDATE_USER: {
      return { ...state, ...action.payload?.user };
    }

    case UserActions.UPDATE_LAYOUTS: {
      const layoutsCount = action.payload?.layouts;
      const canPublish = layoutsCount ? layoutsCount > maxLayouts : false;
      return { ...state, canPublish };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
