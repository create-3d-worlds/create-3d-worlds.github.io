import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'
import { reactions } from '/utils/constants.js'

/* LOADING */

const { mesh } = await loadModel({ file: 'tank/renault-ft.fbx', texture: 'metal/metal01.jpg', size: 2.5 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, speed: 2, attackDistance: 15, hitColor: 0x9E3C0E, energy: 1000 }

export class TankPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class TankAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, baseState: 'patrol', patrolDistance: 30, ...props })
  }

  turnSmooth() {
    super.turnSmooth(Math.PI, 2500)
  }

  updateMove(delta, reaction = reactions.TURN_SMOOTH) {
    super.updateMove(delta, reaction)
  }
}
