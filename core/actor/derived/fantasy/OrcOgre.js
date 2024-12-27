import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Mutant Walking',
  run: 'Mutant Run',
  attack: 'Mutant Swiping',
  attack2: 'Zombie Attack',
  // special: 'Zombie Scream',
  pain: 'Zombie Reaction Hit',
  death: 'Zombie Dying',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', prefix: 'character/orc-ogre/', animDict, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict }

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
