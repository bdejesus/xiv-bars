export interface LayoutProps {
  createdAt: string,
  deletedAt: string | null,
  description?: string,
  encodedSlots: string,
  exhb: number,
  hb: number,
  id: number,
  isPvp: boolean,
  jobId: string,
  layout: number,
  title: number,
  updatedAt: string,
  user: {
    name: string
  },
  userId: number,
  wxhb: number,
  xhb: number
}
