import type { HeartProps } from 'types/Heart';

export interface LayoutDataProps {
  id: number | undefined,
  encodedSlots: string | undefined,
  wxhb: number,
  xhb: number,
  exhb: number,
  hb: number[],
  isPvp: boolean,
  layout: number,
  hearted?: HeartProps,
  parentId?: number | null,
  _count: {
    hearts: number
  }
}

export interface LayoutViewProps extends LayoutDataProps {
  createdAt?: string | null,
  deletedAt?: string | null,
  description?: string,
  jobId?: string,
  title?: string,
  updatedAt?: string | null,
  user?: {
    name: string,
    id: number,
    image: string
  },
  published?: boolean,
  userId?: number,
  position?: number,
  parentLayout?: LayoutDataProps
}

export interface MergeDataProps {
  id?: number | undefined,
  encodedSlots?: string | undefined,
  s?: string | undefined,
  wxhb?: number,
  xhb?: number,
  exhb?: number,
  hb?: number[],
  isPvp?: boolean,
  layout?: number,
}

export type SortType = 'recent' | 'hearts';

export interface LayoutListOptions {
  sortBy: SortType,
  filters: string[]
}
