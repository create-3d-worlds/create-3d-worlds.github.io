import * as THREE from '/node_modules/three127/build/three.module.js'

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