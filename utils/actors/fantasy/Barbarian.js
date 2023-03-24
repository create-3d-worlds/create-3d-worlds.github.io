import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Dwarf Walk',
  run: 'Running',
  jump: 'Mutant Jumping',
  attack: 'Standing Melee Kick',
  attack2: 'Mma Kick',
  special: 'Standing 2H Magic Attack 05',
  pain: 'Standing React Large From Right',
  death: 'Falling Back Death',
}

/* LOADING */

const { mesh, animations } = await loadModel({ prefix: 'character/barbarian/', file: 'model.fbx', angle: Math.PI, fixColors: true, animDict, size: 1.78 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, jumpStyle: 'FLY_JUMP', maxJumpTime: 18 }

export class BarbarianPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }

  checkHit() {
    // untouchable during attack
    if (this.currentState.name.includes('attack')) {
      this.hitAmount = 0
      return
    }
    super.checkHit()
  }
}

export class BarbarianAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
