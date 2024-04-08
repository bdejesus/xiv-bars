import { AppActions } from 'components/App/actions';
import type { ActionProps, SlotProps } from 'types/Action';
import type { ClassJobProps } from 'types/ClassJob';
import type { LayoutViewProps } from 'types/Layout';
import type { URLParams } from 'types/Page';
import type { HeartProps } from 'types/Heart';

export interface AppState {
  viewData: LayoutViewProps,
  jobs: ClassJobProps[],
  readOnly: boolean,
  selectedJob?: ClassJobProps,
  showTitles?: boolean,
  showAllLvl?: boolean,
  viewAction?: 'list' | 'new' | 'edit' | 'show',
  roleActions?: ActionProps[],
  actions?: ActionProps[],
  chotbar: {[key: string]: object},
  hotbar: {[key: string]: object}
}

interface DispatchPayload {
  action?: ActionProps,
  actions?: ActionProps[],
  encodedSlots?: string,
  hbId?: string,
  viewData?: LayoutViewProps,
  roleActions?: ActionProps[],
  viewAction?: string,
  readOnly?: boolean,
  selectedJob?: ClassJobProps,
  slotID?: string,
  slottedActions?: SlotProps[],
  urlParams?: URLParams,
  heartsCount?: number,
  hearted?: HeartProps,
  _count?: { hearts: number }
}

type AppActionTypes =
  AppActions.SLOT_ACTIONS
  | AppActions.SLOT_ACTION
  | AppActions.TOGGLE_TITLES
  | AppActions.TOGGLE_LVLS
  | AppActions.EDIT_LAYOUT
  | AppActions.CANCEL_EDITS
  | AppActions.PUBLISH_LAYOUT
  | AppActions.LAYOUT_SAVED
  | AppActions.LOAD_VIEW_DATA;

export type AppDispatchActions = {
  type: AppActionTypes,
  payload?: DispatchPayload;
}
