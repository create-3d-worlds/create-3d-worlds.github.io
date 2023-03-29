import { loadModel } from '/utils/loaders.js'
import AI from '/utils/actor/AI.js'
import Player from '/utils/actor/Player.js'
import FPSPlayer from '/utils/actor/FPSPlayer.js'

export const animDict = {
  idle: 'Rifle Idle',
  walk: 'Rifle Walk',
  run: 'Rifle Run',
  jump: 'Jump Forward',
  attack: 'Firing Rifle',
  attack2: 'Fire Rifle Crouch',
  // special: 'Toss Grenade',
  pain: 'Reaction',
  death: 'Dying',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'partisan.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true, size: 1.8 })

const { mesh: twoHandedWeapon } = await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, twoHandedWeapon, attackDistance: 50 }

export class PartisanAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class PartisanPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class PartisanFPSPlayer extends FPSPlayer {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
