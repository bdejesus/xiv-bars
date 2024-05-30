import { systemActions } from 'components/System';

export interface SystemProps {
  message?: {
    text: string,
    status: 'info' | 'success' | 'warn' | 'fail' | undefined
  },
  showModal?: boolean,
  isLoading?: boolean
}

export type SystemDispatchActions = {
  type: systemActions.TOGGLE_MODAL | systemActions.SET_MESSAGE,
  payload?: {
    showModal?: boolean,
    text?: string,
    status?: string,
    isLoading?: boolean
  }
};
