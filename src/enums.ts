export enum Segment {
  NOT_AVAILABLE = 0,
  YELLOW_SECTOR = 2048,
  GREEN_SECTOR = 2049,
  UNKNOWN_1 = 2050,
  PURPLE_SECTOR = 2051,
  UNKNOWN_2 = 2052,
  PITLANE = 2064,
  UNKNOWN_3 = 2068,
}

export enum RaceControlCategory {
  FLAG = 'Flag',
  CAR_EVENT = 'CarEvent',
  DRS = 'Drs',
  SAFETY_CAR = 'SafetyCar'
}

export enum Flag {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  DOUBLE_YELLOW = 'DOUBLE YELLOW',
  RED = 'RED',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  BLACK_AND_WHITE = 'BLACK AND WHITE',
  BLUE = 'BLUE',
  CHEQUERED = 'CHEQUERED',
  CLEAR = 'CLEAR'
}

export enum Scope {
  TRACK = 'Track',
  DRIVER = 'Driver',
  SECTOR = 'Sector'
}

export enum Topic {
  RaceControl = 'v1/race_control',
  Sessions = 'v1/sessions',
  Meetings = 'v1/meetings'
}

export enum Emote {
  GREEN = '<:greenflag:759534303821692988>',
  CLEAR = '<:greenflag:759534303821692988>',
  YELLOW = '<:yellowflag:759534303817236550>',
  DOUBLE_YELLOW = '<:yellowflag:759534303817236550><:yellowflag:759534303817236550>',
  BLACK_AND_WHITE = '<:blackwhiteflag:759447554047475723>',
  BLACK = '<:blackflag:759534303595331615>',
  SAFETY_CAR = '<:safetycar:757207851893522472>',
  FCY = '<:fcy:759432420092805170>',
  RETIRED = '<:F_:592914927396585472>',
  RED = '<:redflag:759534303842402314>',
  OFF_TRACK = '<:offtrack:769633560327880706>',
  BLACK_AND_ORANGE = '<:meatball:759447536376873000>',
  BLUE = '<:blueflag:759534303788400670>',
  CHEQUERED = '🏁',
  INVESTIGATION = '🔍',
  NOTED = '🗒️',
  NO_FURTHER_ACTION = '✅',
  PB = '🟩',
  SB = '🟪',
  DRIVER_CHANGE = '🔄'
}

export enum FlagColour {
  GREEN = 0x3EA808,
  YELLOW = 0xE8E517,
  DOUBLE_YELLOW = 0xE8E517,
  RED = 0xFF1801,
  BLACK = 0x000000,
  WHITE = 0xFFFFFF,
  BLACK_AND_WHITE = 0x000000,
  BLUE = 0x002BE8,
  CHEQUERED = 0xFFFFFF,
  CLEAR = 0x3EA808
}
