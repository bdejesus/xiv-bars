export interface LayoutProps {
  createdAt: string,
  deletedAt: string | null,
  description?: string,
  encodedSlots: string,
  exhb: number,
  hb: string,
  id: number,
  isPvp: boolean,
  jobId: string,
  layout: number,
  title: string,
  updatedAt: string,
  user: {
    name: string
  },
  userId: number,
  wxhb: number,
  xhb: number
}
