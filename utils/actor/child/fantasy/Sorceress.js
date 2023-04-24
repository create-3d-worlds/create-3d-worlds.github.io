import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'
import { jumpStyles } from '/utils/constants.js'

const animDict = {
  idle: 'Standing Idle',
  walk: 'Standing Walk Forward',
  run: 'Standing Sprint Forward',
  attack: 'Standing 1H Magic Attack 01',
  attack2: 'Standing 2H Magic Attack 04',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/sorceress/', size: 1.72 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, jumpStyle: jumpStyles.FLY_JUMP, flame: { num: 25, minRadius: 0, maxRadius: .5 } }

export class SorceressPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }

  enterAttack() {
    super.enterAttack()
    this.startFlame()
  }

  exitAttack() {
    this.endFlame()
  }
}

export class SorceressAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
