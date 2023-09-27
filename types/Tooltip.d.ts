import { ActionType } from 'types/Action';

export interface TooltipState {
  content?: ActionType,
  position?: {
    left?: number,
    top?: number
  },
  mouse?: {
    x: number,
    y: number
  },
  error?: string
}

export const initialTooltipState:TooltipState = {
  content: undefined,
  position: {
    left: 0,
    top: 0
  },
  mouse: {
    x: 0,
    y: 0
  },
  error: undefined
};

export const TooltipAction = {
  HIDE: 'hide',
  UPDATE: 'updatePosition',
  START: 'startUpdate',
  FINISH: 'finishUpdate',
  FAIL: 'updateFailed'
};

export interface HideTooltip {
  type: TooltipAction.HIDE,
  payload: TooltipState
}

export interface UpdateTooltip {
  type: TooltipAction.UPDATE,
  payload: TooltipState
}

export interface StartTooltipUpdate {
  type: TooltipAction.START,
  payload: TooltipState
}

export interface FinishTooltipUpdate {
  type: TooltipAction.FINISH,
  payload: TooltipState
}

export interface FailTooltip {
  type: TooltipAction.FAIL,
  payload: TooltipState
}

export type TooltipActions = HideTooltip | UpdateTooltip | StartTooltipUpdate | FinishTooltipUpdate | FailTooltip;

export interface TooltipDispatch {
  type: string,
  payload?: TooltipState
}
