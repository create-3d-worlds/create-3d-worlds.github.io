import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Orc Walk',
  // run: 'Unarmed Run Forward',
  attack: 'Zombie Attack',
  // attack2: 'Zombie Kicking',
  // special: 'Zombie Scream',
  pain: 'Zombie Reaction Hit',
  death: 'Death From The Back',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', prefix: 'character/orc/', animDict, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict }

export class OrcPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class OrcAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
