export interface ActionProps {
  ID?: string | number,
  Icon?: {
    id: number,
    path: string,
    path_hr1: string
  },
  Name?: string,
  Name_de?: string | null,
  Name_fr?: string | null,
  Name_ja?: string | null,
  Discipline?: string,
  Description?: string | null,
  Description_de?: string | null,
  Description_fr?: string | null,
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
