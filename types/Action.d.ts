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
  IsPvP?: boolean,
  IsRoleAction?: boolean,
  IsPlayerAction?: boolean,
  IsUpgradable?: boolean,
  UrlType?: string,
  Command?: string,
  Prefix?: string,
  Level?: number,
  customIcon?: string,
}

export interface SlotProps {
  action: ActionProps,
  id: string,
  key: number,
  name: string
}
