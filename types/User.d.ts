export interface UserState {
  loggedIn: boolean,
  canPublish: boolean,
}

type UserDispatchPayload = {
  user?: object,
  layouts?: number
}

export interface UpdateUser {
  type: UserActions.UPDATE_USER,
  payload: UserDispatchPayload
}

export interface UpdateLayouts {
  type: UserActions.UPDATE_LAYOUTS,
  payload: UserDispatchPayload
}

export type UserDispatchActions = UpdateUser | UpdateLayouts
