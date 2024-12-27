import { loadModel } from '/core/loaders.js'
import AI from '/core/actor/AI.js'
import Player from '/core/actor/Player.js'

const animDict = {
  idle: 'Rifle Idle',
  walk: 'Rifle Walk',
  run: 'Rifle Run',
  attack: 'Firing Rifle',
  // attack2: 'Fire Rifle Crouch',
  // jump: 'Jump Forward',
  // special: 'Toss Grenade',
  pain: 'Hit Reaction',
  death: 'Dying',
}

/* LOADING */

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'partisan-lowpoly.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', size: 1.8 }),
  await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, attackSound: 'rifle.mp3' }

export class PartisanLowpolyPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class PartisanLowpolyAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
