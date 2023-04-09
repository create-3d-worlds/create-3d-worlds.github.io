import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'
import { Flame } from '/utils/classes/Particles.js'

const animDict = {
  idle: 'Crouch Idle',
  walk: 'Crouched Walking',
  run: 'Run',
  attack: 'Standing 2H Magic Attack 01',
  attack2: 'Spell Casting',
  special: 'Zombie Scream',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/witch/', fixColors: true, size: 1.7 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, attackStyle: 'ONCE', attackDistance: 3 }

const createParticles = () => {
  const flame = new Flame({ num: 25, minRadius: 0, maxRadius: .5 })
  flame.mesh.material.opacity = 0
  return flame
}

const resetFlame = self => {
  const { flame, mesh } = self
  flame.reset({ pos: self.position })
  flame.mesh.rotation.copy(mesh.rotation)
  flame.mesh.rotateX(Math.PI)
  flame.mesh.translateY(-1.2)
  flame.mesh.translateZ(1.75)
  self.shouldLoop = true
}

const enterAttack = self => {
  self.scene.add(self.flame.mesh)
  setTimeout(() => resetFlame(self), 1000)
}

const exitAttack = self => {
  self.shouldLoop = false
}

const update = (self, delta) => {
  self.flame.update({ delta, max: self.attackDistance, loop: self.shouldLoop, minVelocity: 2.5, maxVelocity: 5 })
}

export class WitchPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.flame = createParticles()
  }

  enterAttack() {
    super.enterAttack()
    enterAttack(this)
  }

  exitAttack() {
    exitAttack(this)
  }

  update(delta) {
    super.update(delta)
    update(this, delta)
  }
}

export class WitchAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
