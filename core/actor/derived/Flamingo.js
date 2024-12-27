import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = { walk: 'flamingo_flyA_' }

/* LOADING */

const mesh = await loadModel({ file: 'animal/flamingo.glb', size: 20, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, speed: 8, shouldRaycastGround: true, altitude: 60 }

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
