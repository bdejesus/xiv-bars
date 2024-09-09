import type { LayoutViewProps } from 'types/Layout';
import { userActions } from 'components/User';

export interface UserProps {
  name: string,
  id: number,
  image: string,
  layouts: LayoutViewProps[]
  hearts: LayoutViewProps[],
  createdAt: string,
  updatedAt: string
}

export interface UserState {
  loggedIn: boolean,
  canPublish: boolean,
  layouts?: LayoutViewProps[]
}

type UserDispatchPayload = {
  user?: object,
  layouts?: LayoutViewProps[]
}

export interface UpdateUser {
  type: userActions.UPDATE_USER,
  payload: UserDispatchPayload
}

export interface UpdateLayouts {
  type: userActions.UPDATE_LAYOUTS,
  payload: UserDispatchPayload
}

export type UserDispatchActions = UpdateUser | UpdateLayouts
