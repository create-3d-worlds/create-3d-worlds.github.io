import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Mutant Walking',
  attack: 'Zombie Kicking',
  special: 'Mutant Swiping',
  pain: 'Zombie Reaction Hit',
  death: 'Standing Death Forward 01',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/golem/', size: 2.5, fixColors: true })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class GolemPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class GolemAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
