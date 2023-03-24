import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Rifle Aiming Idle',
  walk: 'Rifle Walk',
  run: 'Rifle Run Aim',
  attack: 'Firing Rifle',
  attack2: 'Fire Rifle Crouch',
  pain: 'Hit Reaction',
  death: 'Dying'
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'german-soldier.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', size: 1.8, fixColors: true })

const { mesh: rifle } = await loadModel({ file: 'weapon/rifle.fbx', scale: 1.33, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, rifle }

export class GermanSoldierPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class GermanSoldierAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
