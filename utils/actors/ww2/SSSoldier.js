import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Rifle Aiming Idle',
  walk: 'Rifle Walk',
  run: 'Crouched Run',
  attack: 'Firing Rifle',
  attack2: 'Fire Rifle Crouch',
  pain: 'Hit Reaction',
  death: 'Death Crouching Headshot Front',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'nazi.fbx', animDict, prefix: 'character/soldier/', angle: Math.PI, fixColors: true, size: 1.8 })

const { mesh: rifle } = await loadModel({ file: 'weapon/rifle.fbx', scale: 1.33, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, rifle, speed: 1.75 }

export class SSSoldierPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.translateY(.1)
  }
}

export class SSSoldierAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
    this.mesh.translateY(.1)
  }
}
