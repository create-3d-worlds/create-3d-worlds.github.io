import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'
import { RedFlame } from '/utils/classes/Particles.js'

const animDict = {
  idle: 'Idle',
  walk: 'Dwarf Walk',
  run: 'Fast Run',
  jump: 'Mutant Jumping',
  attack: 'Sword And Shield Slash', // Mma Kick
  attack2: 'Standing Melee Kick',
  special: 'Standing 2H Magic Attack 05',
  pain: 'Standing React Large From Right',
  death: 'Falling Back Death',
}

/* LOADING */

const [mesh, rightHandWeapon] = await Promise.all([
  await loadModel({ prefix: 'character/barbarian/', file: 'model.fbx', angle: Math.PI, fixColors: true, animDict, size: 1.78, runCoefficient: 4 }),
  await loadModel({ file: 'weapon/axe-lowpoly/model.fbx', scale: .18 }),
])

/* EXTENDED CLASSES */

const sharedProps = { rightHandWeapon, mesh, animations: mesh.userData.animations, animDict, jumpStyle: 'FLY_JUMP', maxJumpTime: 18, attackStyle: 'LOOP', useFlame: true }

export class BarbarianPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.flame = new RedFlame()
  }

  enterAttack() {
    super.enterAttack('enemy', this.height * .5)
  }

  checkHit() {
    if (this.state.includes('attack')) {
      this.hitAmount = 0 // untouchable during attack
      return
    }
    super.checkHit()
  }

  resetFlame() {
    const { flame } = this
    flame.reset({ pos: this.mesh.position })
    flame.mesh.rotation.copy(this.mesh.rotation)
    flame.mesh.rotateX(Math.PI)
    this.shouldLoop = true
  }

  enterSpecial() {
    this.startFlame(1000, () => this.areaDamage())
  }

  exitSpecial() {
    this.endFlame()
  }
}

export class BarbarianAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
