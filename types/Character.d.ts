export interface ActiveClassJob {
  level?: number,
  icon?: string,
  textImage?: string
}

export interface GearSlot {
  name?: string,
  image?: string,
  glamour?: object
}

export interface Character {
  id: number
  face?: string
  portrait?: string,
  name?: string
  title?: string
  titleTop?: boolean
  world?: string
  race?: string
  nameday?: string
  guardian?: string
  cityState?: string
  grandCompanyName?: string
  grandCompanyRank?: string
  freeCompany?: string
  activeClassJob: ActiveClassJob
  gearSlots: {
    mainhand?: GearSlot | null
    offhand?: GearSlot | null
    head?: GearSlot | null
    body?: GearSlot | null
    hands?: GearSlot | null
    legs?: GearSlot | null
    feet?: GearSlot | null
    earrings?: GearSlot | null
    necklace?: GearSlot | null
    bracelets?: GearSlot | null
    ring1?: GearSlot | null
    ring2?: GearSlot | null
    soulstone?: GearSlot | null
  },
  updatedAt: string
}
