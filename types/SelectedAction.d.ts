export interface SelectedActionType {
  selectedAction: object | undefined
}

export interface SelectedActionDispatchType {
  type?: string,
  payload?: string | number | object,
  selectedAction?: object,
  value?: object
}
