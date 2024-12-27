import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

/* LOADING */

const mesh = await loadModel({ file: 'aircraft/airship/zeppelin.fbx', size: 20 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, shouldRaycastGround: true, speed: 4, baseState: 'patrol', patrolDistance: Infinity, altitude: 40 }

export class ZeppelinPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.position.y = 60
    this.propeller = this.mesh.getObjectByName('propeler')
  }

  update(delta) {
    super.update(delta)
    this.propeller?.rotateY(delta * -1)
  }
}

export class ZeppelinAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.position.y = 60
    this.propeller = this.mesh.getObjectByName('propeler')
  }

  update(delta) {
    super.update(delta)
    this.propeller?.rotateY(delta * -1)
  }
}
