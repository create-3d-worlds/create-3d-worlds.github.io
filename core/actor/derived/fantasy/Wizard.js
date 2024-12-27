import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Standing Idle',
  walk: 'Iv Pole Walking',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/wizard/', size: 1.8, texture: 'terrain/snow.jpg' })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, speed: .75 }

export class WizardPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class WizardAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
