import { maxLayouts } from 'lib/user';

export default function UserReducer(state, payload) {
  switch (payload.type) {
    case 'UPDATE_USER': {
      return { ...state, ...payload.user };
    }

    case 'UPDATE_LAYOUTS': {
      return { ...state, canPublish: payload.layouts > maxLayouts };
    }

    default: {
      throw new Error(`Unhandled action type: ${payload.type}`);
    }
  }
}
