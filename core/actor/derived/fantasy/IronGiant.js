import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Idle',
  walk: 'Walking',
  jump: 'Mutant Jumping',
  attack: 'Zombie Attack',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', prefix: 'character/iron-giant/', animDict, angle: Math.PI, size: 5 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict }

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
