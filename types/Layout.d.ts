export interface LayoutParamsProps {
  id: number | undefined,
  encodedSlots: string | undefined,
  wxhb: number,
  wxhb: number,
  xhb: number,
  exhb: number,
  hb: string,
  isPvp: boolean,
  layout: number
}

export interface LayoutProps extends LayoutParamsProps {
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
