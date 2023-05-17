import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Machine Gun Idle',
  walk: 'Machine Gun Walk',
  run: 'Rifle Run',
  attack: 'Gunplay',
  pain: 'Hit Reaction',
  death: 'Dying',
}

/* LOADERS */

/* LOADING */

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'soviet-partisan.fbx', prefix: 'character/soldier/', animDict, angle: Math.PI, size: 1.8, fixColors: true }),
  await loadModel({ file: 'weapon/mg-42/model.fbx', scale: .4 }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, attackStyle: 'LOOP', attackSound: 'rifle.mp3' }

export class SovietPartisanPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class SovietPartisanAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
