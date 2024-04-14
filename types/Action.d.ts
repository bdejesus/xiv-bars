export interface ActionProps {
  ID?: string | number,
  PreIcon?: string,
  Icon?: string,
  Name?: string,
  Name_ja?: string | null,
  Discipline?: string,
  Description?: string | null,
  Description_ja?: string | null,
  Role?: string,
  UrlType?: string,
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
