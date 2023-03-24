import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = { walk: 'flamingo_flyA_' }

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'animal/flamingo.glb', size: 20, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, speed: 8, shouldRaycastGround: false }

export class FlamingoPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.position.y = 45
  }
}

export class FlamingoAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.position.y = 45
  }
}
