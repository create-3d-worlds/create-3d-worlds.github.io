import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Mutant Walking',
  attack: 'Zombie Kicking',
  attack2: 'Mutant Swiping',
  pain: 'Zombie Reaction Hit',
  death: 'Standing Death Forward 01',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/golem/', size: 2.5 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict }

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
