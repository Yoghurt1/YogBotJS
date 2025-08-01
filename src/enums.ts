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
  FLAG = "Flag",
  CAR_EVENT = "CarEvent",
  DRS = "Drs",
  SAFETY_CAR = "SafetyCar"
}

export enum Flag {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  DOUBLE_YELLOW = "DOUBLE YELLOW",
  RED = "RED",
  BLACK = "BLACK",
  WHITE = "WHITE",
  BLACK_AND_WHITE = "BLACK AND WHITE",
  BLUE = "BLUE",
  CHEQUERED = "CHEQUERED",
  CLEAR = "CLEAR"
}

export enum Scope {
  TRACK = "Track",
  DRIVER = "Driver",
  SECTOR = "Sector"
}
