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
  hearted?: HeartProps
}

export interface LayoutViewProps extends LayoutDataProps {
  _count: {
    hearts: number
  },
  createdAt?: string | null,
  deletedAt?: string | null,
  description?: string,
  jobId?: string,
  title?: string,
  updatedAt?: string | null,
  user?: {
    name: string,
    id: number
  },
  published?: boolean,
  userId?: number,
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
