export interface ActionProps {
  ID: string | number,
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

export interface SlotProps {
  action: ActionProps,
  id: string,
  key: number,
  name: string
}
