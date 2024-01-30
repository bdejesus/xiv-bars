import { AppActions } from 'components/App/actions';
import type { ActionProps, SlotProps } from 'types/Action';
import type { ClassJobProps } from 'types/ClassJob';

export interface LayoutProps {
  layout?: number,
  hb?: number[],
  xhb?: number,
  wxhb?: number,
  exhb?: number,
  pvp?: number,
  encodedSlots?: string,
  title?: string,
  description?: string,
  user?: {
    name: string,
    id: number
  },
  userId?: number,
  jobId?: string,
  layoutId?: number,
  updatedAt?: string
}

export interface AppState extends LayoutProps {
  jobs?: ClassJobProps[],
  readOnly?: boolean,
  selectedJob?: ClassJobProps,
  showTitles?: boolean,
  showAllLvl?: boolean,
  showPublish?: boolean,
  viewAction?: string,
  roleActions?: ActionProps[],
  actions: ActionProps[],
  chotbar?: {[key: string]: object},
  hotbar?: {[key: string]: object},
}

export interface ViewDataProps extends LayoutProps {
  hb: string
}

interface DispatchPayload {
  slottedActions?: SlotProps[],
  slotID?: string,
  action?: ActionProps,
  actions?: ActionProps[],
  hbId?: string,
  viewAction?: string,
  encodedSlots?: string
}

export interface SlotActions {
  type: AppActions.SLOT_ACTIONS,
  payload?: DispatchPayload
}

export interface SlotAction {
  type: AppActions.SLOT_ACTION,
  payload?: DispatchPayload
}

export interface ToggleTitles {
  type: AppActions.TOGGLE_TITLES,
  payload?: DispatchPayload
}

export interface ToggleLvls {
  type: AppActions.TOGGLE_LVLS,
  payload?: DispatchPayload
}

export interface EditLayout {
  type: AppActions.EDIT_LAYOUT,
  payload?: DispatchPayload
}

export interface CancelLayout {
  type: AppActions.CANCEL_EDITS,
  payload?: DispatchPayload
}

export interface PublishLayout {
  type: AppActions.PUBLISH_LAYOUT,
  payload?: DispatchPayload
}

export interface LayoutSaved {
  type: AppActions.LAYOUT_SAVED,
  payload?: DispatchPayload
}

export type AppDispatchActions = SlotActions | SlotAction | ToggleTitles | ToggleLvls | EditLayout | CancelLayout | PublishLayout | LayoutSaved;
