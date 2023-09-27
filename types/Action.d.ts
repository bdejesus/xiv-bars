export type ActionType = {
  ID: number | string,
  PreIcon?: string,
  Icon: string,
  Name: string,
  Abbr?: string,
  Discipline?: string,
  Role?: string,
  UrlType: string,
  Command?: string,
  customIcon?: string,
  upgradable?: boolean
}

export type SlotType = {
  action: ActionType,
  id: string,
  key: number,
  name: string
}
