import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

/* LOADING */

const { mesh } = await loadModel({ file: 'cloud/lowpoly.gltf', size: 20, angle: Math.PI })

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
