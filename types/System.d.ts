import { SystemActions } from 'components/System/actions';

export interface SystemProps {
  message?: {
    text: string,
    status: 'info' | 'success' | 'warn' | 'fail' | undefined
  },
  showModal?: boolean,
}

export type SystemDispatchActions = {
  type: SystemActions.TOGGLE_MODAL | SystemActions.SET_MESSAGE,
  payload?: {
    showModal?: boolean,
    text?: string,
    status?: string
  }
};
