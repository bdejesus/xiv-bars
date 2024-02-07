import type { SystemProps, SystemDispatchActions } from 'types/System';
import { SystemActions } from 'components/System/actions';

export function SystemReducer(state:SystemProps, action:SystemDispatchActions) {
  const { type, payload } = action;

  switch (type) {
    case SystemActions.TOGGLE_MODAL: {
      const showModal = payload ? payload.showModal : !state.showModal;
      return { ...state, showModal };
    }
    case SystemActions.SET_MESSAGE: {
      return { ...state, message: payload };
    }
    default: {
      throw new Error(`${type} is an unhandled SystemAction`);
    }
  }
}

export default SystemReducer;
