import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

/* LOADING */

const mesh = await loadModel({ file: 'nature/cloud/lowpoly.gltf', size: 20, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, shouldRaycastGround: false, baseState: 'patrol', patrolDistance: Infinity }

export class CloudPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.position.y = 120
  }
}

export class CloudAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.position.y = 120
  }
}
