import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Mutant Walking',
  run: 'Mutant Run',
  attack: 'Mutant Swiping',
  attack2: 'Zombie Attack',
  special: 'Zombie Scream',
  pain: 'Zombie Reaction Hit',
  death: 'Zombie Dying',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', prefix: 'character/orc-ogre/', animDict, angle: Math.PI, fixColors: true })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class OrcOgrePlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class OrcOgreAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
