export type ActionType = {
  ID: string,
  PreIcon: string,
  Icon: string,
  Name: string,
  Abbr: string,
  Discipline: string,
  Role: string,
  UrlType: string,
  customIcon: string,
  Command: string
}

export type SlottedAction = {
  action: ActionType,
  id: string,
  key: number,
  name: string
}
