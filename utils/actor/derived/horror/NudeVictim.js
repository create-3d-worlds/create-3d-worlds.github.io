import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Drunk Run Forward',
  run: 'Drunk Run Forward',
  attack: 'Terrified',
  special: 'Zombie Agonizing',
}

/* LOADING */

// BUG: model is not centered
const mesh = await loadModel({ file: 'model.fbx', size: 1.75, prefix: 'character/nude-victim/', animDict, angle: Math.PI, fixColors: true })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, runCoefficient: 1 }

export class NudeVictimPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class NudeVictimAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
