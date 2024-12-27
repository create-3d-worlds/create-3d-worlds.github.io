import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  walk: 'Take 001'
}

/* LOADING */

const mesh = await loadModel({ file: 'animal/elephant/Unity2Skfb.gltf', size: 8, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, speed: 2, energy: 1000 }

export class ElephantPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class ElephantAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
