import type { SystemProps, SystemDispatchActions } from 'types/System';
import { systemActions } from 'components/System/actions';

export function SystemReducer(state:SystemProps, action:SystemDispatchActions) {
  const { type, payload } = action;

  switch (type) {
    case systemActions.TOGGLE_MODAL: {
      const showModal = payload ? payload.showModal : !state.showModal;
      return { ...state, showModal };
    }

    case systemActions.SET_MESSAGE: {
      return { ...state, message: payload };
    }

    case systemActions.LOADING_START: {
      return { ...state, isLoading: true };
    }

    case systemActions.LOADING_END: {
      return { ...state, isLoading: false };
    }

    default: {
      throw new Error(`${type} is an unhandled SystemAction`);
    }
  }
}

export default SystemReducer;
