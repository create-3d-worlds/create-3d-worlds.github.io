import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'
import { Flame } from '/utils/classes/Particles.js'

const animDict = {
  idle: 'Machine Gun Idle',
  walk: 'Machine Gun Walk',
  run: 'Rifle Run',
  attack: 'Crouch Rapid Fire',
  attack2: 'Machine Gun Idle',
  pain: 'Hit Reaction',
  death: 'Crouch Death',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'german-machine-gunner.fbx', animDict, prefix: 'character/soldier/', angle: Math.PI, fixColors: true })

const { mesh: rifle } = await loadModel({ file: 'weapon/flame-gun/model.fbx', scale: .75 })

/* SHARED METHODS */

const constructor = self => {
  const particles = new Flame()
  particles.mesh.rotateX(Math.PI)
  particles.mesh.translateY(-1.2)
  particles.mesh.translateZ(1.75)
  particles.mesh.material.opacity = 0
  self.particles = particles
  self.add(particles.mesh)
}

const attackAction = self => {
  self.particles.mesh.material.opacity = 1
  self.shouldFadeOut = false
}

const endAttack = self => {
  self.shouldFadeOut = true
}

const update = (self, delta) => {
  self.particles.update({ delta, max: self.attackDistance, loop: !self.shouldFadeOut })
}

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, rifle, speed: 1.8, attackStyle: 'LOOP', attackDistance: 7 }

export class GermanFlameThrowerPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    constructor(this)
  }

  attackAction() {
    super.attackAction()
    attackAction(this)
  }

  endAttack() {
    endAttack(this)
  }

  update(delta) {
    super.update(delta)
    update(this, delta)
  }
}

export class GermanFlameThrowerAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    constructor(this)
  }

  attackAction() {
    super.attackAction()
    attackAction(this)
  }

  endAttack() {
    endAttack(this)
  }

  update(delta) {
    super.update(delta)
    update(this, delta)
  }
}
