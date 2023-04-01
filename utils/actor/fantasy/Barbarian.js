import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Sword And Shield Idle', // Unarmed Idle
  walk: 'Standing Walk Forward', // Dwarf Walk
  run: 'Fast Run',
  jump: 'Mutant Jumping',
  attack: 'Sword And Shield Slash', // Sword And Shield Kick, Standing Melee Kick
  attack2: 'Standing Melee Kick',
  special: 'Standing 2H Magic Attack 05',
  pain: 'Standing React Large From Right',
  death: 'Falling Back Death',
}

/* LOADING */

const { mesh, animations } = await loadModel({ prefix: 'character/barbarian/', file: 'model.fbx', angle: Math.PI, fixColors: true, animDict, size: 1.78, runCoefficient: 4 })

const { mesh: rightHandWeapon } = await loadModel({ file: 'weapon/axe-lowpoly/model.fbx', scale: .18 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, jumpStyle: 'FLY_JUMP', maxJumpTime: 18, attackStyle: 'LOOP', rightHandWeapon }

export class BarbarianPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }

  attackAction() {
    super.attackAction('enemy', this.height * .5)
  }

  checkHit() {
    if (this.currentState.name.includes('attack')) {
      // untouchable during attack
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
