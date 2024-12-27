import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Mutant Breathing Idle',
  walk: 'Mutant Walking',
  jump: 'Mutant Jumping',
  attack: 'Zombie Attack',
  special: 'Zombie Scream',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', prefix: 'character/demon/', animDict, angle: Math.PI, size: 3 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict }

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
