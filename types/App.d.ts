export interface AppData {
  layout?: number,
  params?: object,
  hb?: number[],
  xhb: number,
  wxhb: number,
  exhb: number,
  showTitles: boolean,
  showAllLvl: boolean,
  showModal: boolean,
  roleActions: ActionType[],
  actions: ActionType[]
}

export interface AppState {
  layout?: number,
  params?: object,
  hb?: number[],
  xhb: number,
  wxhb: number,
  exhb: number,
  showTitles: boolean,
  showAllLvl: boolean,
  showModal: boolean,
  viewData: AppData,
  viewAction: string,
  roleActions: ActionType[],
  actions: ActionType[]
}

export interface AppActions {
  type: string,
  layout?: number,
  action?: SlotType,
  params?: {
    xhb: string,
    wxhb: string,
    exhb: string,
    encodedSlots: string,
    hb: number[]
  },
  hbId?: string,
  hb?: number[]
  hbConfig: string,
  viewData: AppData,
  message: string,
  slotID: string
}

export interface UpdateUI {
  type: AppAction.UPDATE_UI,
  paylout: AppState
}

export interface UpdateHotbarLayout {
  type: AppAction.UPDATE_HB_LAYOUT,
  paylout: AppState
}

export interface SlotActions {
  type: AppAction.SLOT_ACTIONS,
  paylout: AppState
}

export interface SlotAction {
  type: AppAction.SLOT_ACTION,
  paylout: AppState
}

export interface ToggleTitles {
  type: AppAction.TOGGLE_TITLES,
  paylout: AppState
}

export interface ToggleLvls {
  type: AppAction.TOGGLE_LVLS,
  paylout: AppState
}

export interface ToggleModal {
  type: AppAction.TOGGLE_MODAL,
  paylout: AppState
}

export interface UpdateLayout {
  type: AppAction.UPDATE_LAYOUT,
  paylout: AppState
}

export interface EditLayout {
  type: AppAction.EDIT_LAYOUT,
  paylout: AppState
}

export interface CancelLayout {
  type: AppAction.CANCEL_LAYOUT,
  paylout: AppState
}

export interface PublishLayout {
  type: AppAction.PUBLISH_LAYOUT,
  paylout: AppState
}

export interface SaveLayout {
  type: AppAction.SAVE_LAYOUT,
  paylout: AppState
}

export interface UpdateMessage {
  type: AppAction.UPDATE_MESSAGE,
  paylout: AppState
}
