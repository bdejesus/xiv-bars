export interface ViewParamsProps {
  id: number | undefined,
  encodedSlots: string | undefined,
  wxhb: number,
  xhb: number,
  exhb: number,
  hb: number[],
  isPvp: boolean,
  layout: number,
}

export interface ViewDataProps extends ViewParamsProps {
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
  userId?: number
}

export interface LayoutDataProps extends ViewDataProps {
  id: number | undefined,
  encodedSlots: string | undefined,
  wxhb: number,
  xhb: number,
  exhb: number,
  hb: string,
  isPvp: boolean,
  layout: number,
}
