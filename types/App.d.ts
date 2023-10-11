import { AppAction } from 'components/App/actions';

export interface AppData {
  layout: number,
  params?: object,
  hb?: string,
  xhb: number,
  wxhb: number,
  exhb: number,
  showTitles: boolean,
  showAllLvl: boolean,
  showModal: boolean,
  roleActions: ActionType[],
  actions: ActionType[],
  title: string,
  description?: string,
  userId?: number,
  jobId?: string,
  id?: number
}

export interface AppState {
  layout: number,
  params?: object,
  hb: number[] | string[],
  xhb: number,
  wxhb: number,
  exhb: number,
  jobs: ClassJob[],
  readOnly: boolean,
  selectedJob?: ClassJob,
  showTitles: boolean,
  showAllLvl: boolean,
  showModal: boolean,
  showPublish: boolean,
  viewData?: AppData,
  viewAction?: string,
  roleActions?: ActionType[],
  actions?: ActionType[],
  encodedSlots?: string,
  message?: { type: string, body: string },
  chotbar?: {[key: string]: object},
  hotbar?: {[key: string]: object}
}

interface DispatchPayload {
  layout?: number,
  message?: { type: string, body: string },
  slottedActions?: SlotType[],
  wxhb?: number,
  xhb?: number,
  exhb?: number
  hb?: number[],
  encodedSlots?: string,
  slotID?: string,
  action?: ActionType,
  hbId?: string,
  hbConfig?: string,
  viewData?: AppData,
}

export interface UpdateUI {
  type: AppAction.UPDATE_UI,
  payload?: DispatchPayload
}

export interface UpdateHotbarLayout {
  type: AppAction.UPDATE_HB_LAYOUT,
  payload?: DispatchPayload
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

export interface UpdateLayout {
  type: AppAction.UPDATE_LAYOUT,
  payload?: DispatchPayload
}

export interface EditLayout {
  type: AppAction.EDIT_LAYOUT,
  payload?: DispatchPayload
}

export interface CancelLayout {
  type: AppAction.CANCEL_LAYOUT,
  payload?: DispatchPayload
}

export interface PublishLayout {
  type: AppAction.PUBLISH_LAYOUT,
  payload?: DispatchPayload
}

export interface SaveLayout {
  type: AppAction.SAVE_LAYOUT,
  payload?: DispatchPayload
}

export interface UpdateMessage {
  type: AppAction.UPDATE_MESSAGE,
  payload?: DispatchPayload
}

export type AppDispatchActions = UpdateUI | UpdateHotbarLayout | SlotActions | SlotAction | ToggleTitles | ToggleLvls | ToggleModal | UpdateLayout | EditLayout | CancelLayout | PublishLayout | SaveLayout | UpdateMessage;
