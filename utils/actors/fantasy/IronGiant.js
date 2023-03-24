import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Idle',
  walk: 'Walking',
  jump: 'Mutant Jumping',
  attack: 'Zombie Attack',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', prefix: 'character/iron-giant/', animDict, angle: Math.PI, size: 5, fixColors: true })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class IronGiantPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class IronGiantAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
