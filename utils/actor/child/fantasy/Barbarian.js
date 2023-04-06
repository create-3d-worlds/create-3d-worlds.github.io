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

const { mesh, animations } = await loadModel({ prefix: 'character/barbarian/', file: 'model.fbx', angle: Math.PI, fixColors: true, animDict, size: 1.78, runCoefficient: 4 })

const { mesh: rightHandWeapon } = await loadModel({ file: 'weapon/axe-lowpoly/model.fbx', scale: .18 })

/* EXTENDED CLASSES */

const sharedProps = { rightHandWeapon, mesh, animations, animDict, jumpStyle: 'FLY_JUMP', maxJumpTime: 18, attackStyle: 'LOOP' }

export class BarbarianPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.particles = new RedFlame()
    this.particles.mesh.material.opacity = 0
  }

  enterAttack() {
    super.enterAttack('enemy', this.height * .5)
  }

  checkHit() {
    // untouchable during attack
    if (this.state.includes('attack')) {
      this.hitAmount = 0
      return
    }
    super.checkHit()
  }

  resetParticles() {
    const { particles } = this
    particles.reset({ pos: this.mesh.position })
    particles.mesh.rotation.copy(this.mesh.rotation)
    particles.mesh.rotateX(Math.PI)
    this.shouldLoop = true
  }

  enterSpecial() {
    this.scene.add(this.particles.mesh)
    setTimeout(() => {
      this.resetParticles()
      this.areaDamage()
    }, 1000)
  }

  exitSpecial() {
    this.shouldLoop = false
  }

  update(delta) {
    super.update(delta)
    this.particles.update({ delta, max: this.attackDistance, loop: this.shouldLoop, minVelocity: 2.5, maxVelocity: 5 })
  }
}

export class BarbarianAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
