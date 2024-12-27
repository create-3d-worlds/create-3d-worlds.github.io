import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'
import { RedFlame } from '/core/Particles.js'

const animDict = {
  idle: 'Idle',
  walk: 'Dwarf Walk',
  run: 'Fast Run',
  jump: 'Mutant Jumping',
  attack: 'Sword And Shield Slash', // Mma Kick
  // attack2: 'Standing Melee Kick',
  special: 'Standing 2H Magic Attack 05',
  pain: 'Standing React Large From Right',
  death: 'Falling Back Death',
}

/* LOADING */

const [mesh, rightHandWeapon] = await Promise.all([
  await loadModel({ prefix: 'character/barbarian/', file: 'model.fbx', angle: Math.PI, animDict, size: 1.78, runCoefficient: 4 }),
  await loadModel({ file: 'weapon/axe-lowpoly/model.fbx', scale: .18 }),
])

/* EXTENDED CLASSES */

const sharedProps = { rightHandWeapon, mesh, animations: mesh.userData.animations, animDict, jumpStyle: 'FLY_JUMP', maxJumpTime: .3, runCoefficient: 2.5, attackStyle: 'LOOP', flame: { num: 25, minRadius: 0, maxRadius: .5 } }

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
