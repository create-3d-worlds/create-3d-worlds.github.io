import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Take 001'
}

/* LOADING */

const mesh = await loadModel({ file: 'character/ghost/scene.gltf', angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict }

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
    if (this.dead) {
      this.mesh.rotateY(.15)
      this.mesh.translateY(.03)
    }
  }
}
