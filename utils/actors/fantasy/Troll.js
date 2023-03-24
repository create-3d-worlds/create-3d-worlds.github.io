import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Mutant Walking',
  attack: 'Zombie Attack',
  pain: 'Shove Reaction',
  death: 'Mutant Dying',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/troll/', fixColors: true, size: 3 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class TrollPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class TrollAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
