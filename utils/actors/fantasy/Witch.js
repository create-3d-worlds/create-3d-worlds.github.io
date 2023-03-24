import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Crouch Idle',
  walk: 'Crouched Walking',
  run: 'Run',
  attack: 'Standing 2H Magic Attack 01',
  attack2: 'Spell Casting',
  special: 'Zombie Scream',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/witch/', fixColors: true, size: 1.7 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class WitchPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class WitchAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
