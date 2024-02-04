import type { ViewDataProps } from './Layout';
import type { ClassJobProps } from './ClassJob';
import type { ActionProps } from './Action';

export interface URLProps {
  jobId?: string,
  s?: string,
  s1?: string,
  wxhb?: number,
  xhb?: number,
  exhb?: number,
  hb?: number[],
  l?: number,
  isPvp?: boolean,
}

export interface URLParams {
  jobId?: string,
  s?: string,
  s1?: string,
  wxhb?: string,
  xhb?: string,
  exhb?: string,
  hb?: string,
  l?: string,
  isPvp?: string,
}

export interface PageProps {
  viewData: ViewDataProps,
  selectedJob: ClassJobProps,
  actions: ActionProps[],
  roleActions: ActionProps[],
  viewAction: string
}
