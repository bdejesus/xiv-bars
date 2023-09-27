export interface ActionType {
  ID: number | string,
  PreIcon?: string,
  Icon: string,
  Name: string,
  Abbr?: string,
  Discipline?: string,
  Description?: string,
  Role?: string,
  UrlType: string,
  Command?: string,
  customIcon?: string,
  upgradable?: boolean,
  Prefix?: string
}

export interface SlotType {
  action: ActionType,
  id: string,
  key: number,
  name: string
}
