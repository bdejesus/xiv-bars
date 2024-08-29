import { ParsedUrlQuery } from 'querystring';
import type { LayoutViewProps } from './Layout';
import type { ClassJobProps } from './ClassJob';
import type { ActionProps } from './Action';

export interface QueryProps extends ParsedUrlQuery {
  jobId?: string,
  s?: string,
  s1?: string,
  wxhb?: string,
  xhb?: string,
  exhb?: string,
  hb?: string,
  l?: string,
  isPvp?: string
}

export interface PageProps {
  viewData: LayoutViewProps,
  selectedJob: ClassJobProps,
  actions: ActionProps[],
  roleActions: ActionProps[],
  viewAction: 'list' | 'new' | 'edit' | 'show',
  ownerLayouts: LayoutViewProps[],
  classJobLayouts: LayoutViewProps[],
  parentLayout: LayoutViewProps
}
