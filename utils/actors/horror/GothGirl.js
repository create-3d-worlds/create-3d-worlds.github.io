import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Thriller Idle',
  walk: 'Walking',
  run: 'Zombie Running',
  attack: 'Zombie Attack',
  attack2: 'Zombie Scream',
  pain: 'Zombie Reaction Hit',
  death: 'Zombie Dying',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'goth-girl.fbx', prefix: 'character/zombie/', angle: Math.PI, fixColors: true, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, speed: .5, runCoefficient: 8 }

export class GothGirlPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class GothGirlAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
