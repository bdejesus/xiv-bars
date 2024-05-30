import type { ActionProps } from 'types/Action';
import { selectedActionActions } from 'components/SelectedAction/actions';

export interface SelectedActionState {
  selectedAction?: ActionProps | undefined
}

export interface SelectedActionPayload {
  payload?: string | number | object,
  selectedAction?: object | undefined,
  value?: object
}

export interface SelectAction {
  type: selectedActionActions.SELECT
  payload: SelectedActionPayload
}

export interface DeselectAction {
  type: selectedActionActions.SELECT
  payload?: SelectedActionPayload
}

export type SelectedActionDispatchActions = SelectAction | DeselectAction
