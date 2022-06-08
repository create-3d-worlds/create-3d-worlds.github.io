import { nemesis } from '/data/maps.js'

export const NUM_AI = 5
export const PROJECTILEDAMAGE = 20
export const INITIAL_HEALTH = 100

export const UNITSIZE = 15
export const MOVESPEED = 10
export const LOOKSPEED = 0.1
export const BULLETMOVESPEED = MOVESPEED * 10
export const HEALTH_REFILL_TIME = 30000 // half minute

export const mapWidth = nemesis.length
export const mapHeight = nemesis[0].length
