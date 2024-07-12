export interface ActionProps {
  ID?: string | number,
  Icon?: string,
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
  Prefix?: string,
  ActionCombo?: {
    ActionCombo: number
  },
  ActionComboTargetID?: number,
  IsPlayerAction?: number,
  ClassJobLevel?: number,
  Cast100ms?: number,
  Recast100ms?: number,
  CooldownGroup?: number,
  ActionCategory?: object,
  GameContentLinks?: {
    Action: {
      ActionCombo: number[]
    }
  }, b
  DisableOrder?: 0 | 1,
  ComboActions?: ActionProps[]
}

export interface SlotProps {
  action: ActionProps,
  id: string,
  key: number,
  name: string
}
