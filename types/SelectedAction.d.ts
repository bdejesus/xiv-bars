import type { ActionProps } from 'types/Action';
import { SelectedActionAction } from 'components/SelectedAction/actions';

export interface SelectedActionState {
  selectedAction?: ActionProps | undefined
}

export interface SelectedActionPayload {
  payload?: string | number | object,
  selectedAction?: object | undefined,
  value?: object
}

export interface SelectAction {
  type: SelectedActionAction.SELECT
  payload: SelectedActionPayload
}

export interface DeselectAction {
  type: SelectedActionAction.SELECT
  payload?: SelectedActionPayload
}

export type SelectedActionDispatchActions = SelectAction | DeselectAction
