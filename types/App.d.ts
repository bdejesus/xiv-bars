import { appActions } from 'components/App/actions';
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
  showDetails: boolean,
  viewAction?: 'list' | 'new' | 'edit' | 'show',
  roleActions?: ActionProps[],
  actions?: ActionProps[],
  chotbar: {[key: string]: object},
  hotbar: {[key: string]: object},
  showMarkdownGuide: boolean,
  parentLayout?: LayoutViewProps
}

interface DispatchPayload {
  action?: ActionProps,
  actions?: ActionProps[],
  encodedSlots?: string,
  hbId?: string,
  viewData?: LayoutViewProps,
  roleActions?: ActionProps[],
  viewAction?: 'list' | 'new' | 'edit' | 'show',
  readOnly?: boolean,
  selectedJob?: ClassJobProps,
  slotID?: string,
  slottedActions?: SlotProps[],
  urlParams?: URLParams,
  heartsCount?: number,
  hearted?: HeartProps,
  showDetails?: boolean,
  showMarkdownGuide?: boolean,
  parentLayout?: LayoutViewProps
  _count?: { hearts: number }
}

type AppActionTypes =
appActions.SLOT_ACTIONS
  | appActions.SLOT_ACTION
  | appActions.TOGGLE_TITLES
  | appActions.TOGGLE_LVLS
  | appActions.EDIT_LAYOUT
  | appActions.CANCEL_EDITS
  | appActions.PUBLISH_LAYOUT
  | appActions.LAYOUT_SAVED
  | appActions.LOAD_VIEW_DATA;

export type AppDispatchActions = {
  type: AppActionTypes,
  payload?: DispatchPayload;
}
