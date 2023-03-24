import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'
import { animDict } from './Partisan.js'

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'resistance-fighter.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true })

const { mesh: rifle } = await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, rifle }

export class ResistanceFighterPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class ResistanceFighterAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
