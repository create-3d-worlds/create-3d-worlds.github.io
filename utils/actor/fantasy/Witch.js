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

const constructor = self => {
  const particles = new Flame({ num: 25 })
  particles.mesh.rotateX(Math.PI)
  particles.mesh.translateY(-1.2)
  particles.mesh.translateZ(1.75)
  particles.mesh.material.opacity = 0
  self.particles = particles
  self.add(particles.mesh)
}

const attackAction = self => {
  self.particles.mesh.material.opacity = 1
  self.particles.mesh.visible = true
  self.shouldFadeOut = false
}

const endAttack = self => {
  self.shouldFadeOut = true
}

const update = (self, delta) => {
  self.particles.update({ delta, max: self.attackDistance, loop: !self.shouldFadeOut, minVelocity: 2.5, maxVelocity: 5, maxRounds: 75 })
}

export class WitchPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    constructor(this)
  }

  attackAction() {
    setTimeout(() => {
      super.attackAction()
      attackAction(this)
    }, 1000)
  }

  endAttack() {
    endAttack(this)
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
