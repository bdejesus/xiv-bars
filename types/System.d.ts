import { SystemActions } from 'components/System/actions';

export interface SystemProps {
  message?: {
    text: string,
    status: 'INFO' | 'SUCCESS' | 'WARN' | 'FAIL' | undefined
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
