import * as THREE from 'three'

const { Vector3 } = THREE

export const CIRCLE = 2 * Math.PI

export const DEGREE = Math.PI / 180

export const RIGHT_ANGLE = Math.PI * .5

export const dir = {
  upForward: new Vector3(0, 1, -1),
  forward: new Vector3(0, 0, -1),
  upBackward: new Vector3(0, 1, 1),
  backward: new Vector3(0, 0, 1),
  left: new Vector3(-1, 0, 0),
  right: new Vector3(1, 0, 0),
  up: new Vector3(0, 1, 0),
  down: new Vector3(0, -1, 0),
}

export const jumpStyles = {
  FALSE_JUMP: 'FALSE_JUMP',
  FLY_JUMP: 'FLY_JUMP',
  FLY: 'FLY',
}

export const attackStyles = {
  ONCE: 'ONCE',
  LOOP: 'LOOP',
}

export const reactions = {
  BOUNCE: 'BOUNCE',
  TURN_SMOOTH: 'TURN_SMOOTH',
  STEP_OFF: 'STEP_OFF',
  STOP: 'STOP',
}

/**
 * pursue (if target): idle, patrol, wander
 * doesn't pursue: flee i follow
 */
export const baseAiStates = {
  idle: 'idle',
  patrol: 'patrol',
  wander: 'wander',
  flee: 'flee',
  follow: 'follow',
}

export const pursueStates = [baseAiStates.idle, baseAiStates.patrol, baseAiStates.wander]