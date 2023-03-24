import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Take 001'
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'character/ghost/scene.gltf', angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class GhostPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }

  directionBlocked() {
    return false
  }
}

export class GhostAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }

  directionBlocked() {
    return false
  }

  checkHit() {
    super.checkHit()
    if (this.isDead) {
      this.mesh.rotateY(.15)
      this.mesh.translateY(.03)
    }
  }
}
