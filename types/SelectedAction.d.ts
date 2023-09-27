export interface SelectedActionType {
  selectedAction: object | undefined
}

export const selectedActionDefaults:SelectedActionType = {
  selectedAction: {}
};

export interface SelectedActionDispatchType {
  type?: string,
  payload?: string | number | object,
  selectedAction?: object,
  value?: object
}
