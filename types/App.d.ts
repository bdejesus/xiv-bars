import { AppAction } from 'components/App/actions';
import type { ActionProps, SlotProps } from 'types/Action';
import type { ClassJobProps } from 'types/ClassJob';

export interface LayoutProps {
  layout?: number,
  hb?: number[],
  xhb?: number,
  wxhb?: number,
  exhb?: number,
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
  showModal?: boolean,
  showPublish?: boolean,
  viewAction?: string,
  roleActions?: ActionProps[],
  actions?: ActionProps[],
  message?: {
    type: string,
    body: string
  },
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
  hbId?: string,
  showModal?: boolean,
  viewAction?: string,
  message?: {
    type: string,
    body: string
  },
  encodedSlots?: string
}

export interface SlotActions {
  type: AppAction.SLOT_ACTIONS,
  payload?: DispatchPayload
}

export interface SlotAction {
  type: AppAction.SLOT_ACTION,
  payload?: DispatchPayload
}

export interface ToggleTitles {
  type: AppAction.TOGGLE_TITLES,
  payload?: DispatchPayload
}

export interface ToggleLvls {
  type: AppAction.TOGGLE_LVLS,
  payload?: DispatchPayload
}

export interface ToggleModal {
  type: AppAction.TOGGLE_MODAL,
  payload?: DispatchPayload
}

export interface EditLayout {
  type: AppAction.EDIT_LAYOUT,
  payload?: DispatchPayload
}

export interface CancelLayout {
  type: AppAction.CANCEL_EDITS,
  payload?: DispatchPayload
}

export interface PublishLayout {
  type: AppAction.PUBLISH_LAYOUT,
  payload?: DispatchPayload
}

export interface LayoutSaved {
  type: AppAction.LAYOUT_SAVED,
  payload?: DispatchPayload
}

export interface UpdateMessage {
  type: AppAction.UPDATE_MESSAGE,
  payload?: DispatchPayload
}

export type AppDispatchActions = SlotActions | SlotAction | ToggleTitles | ToggleLvls | ToggleModal | EditLayout | CancelLayout | PublishLayout | LayoutSaved | UpdateMessage;
