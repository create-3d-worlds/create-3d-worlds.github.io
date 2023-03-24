import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Mutant Breathing Idle',
  walk: 'Mutant Walking',
  jump: 'Mutant Jumping',
  attack: 'Zombie Attack',
  special: 'Zombie Scream',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', prefix: 'character/demon/', animDict, angle: Math.PI, fixColors: true, size: 3 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class DemonPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class DemonAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
