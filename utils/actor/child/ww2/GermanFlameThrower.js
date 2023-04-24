import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
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

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'german-machine-gunner.fbx', animDict, prefix: 'character/soldier/', angle: Math.PI, fixColors: true }),
  await loadModel({ file: 'weapon/flame-gun/model.fbx', scale: .75 }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, speed: 1.8, attackStyle: 'LOOP', attackDistance: 7, attackSound: 'fire-swoosh.mp3' }

const adjustFlamePos = self => {
  const { flame, mesh } = self
  flame.mesh.position.copy(mesh.position)
  flame.mesh.rotation.copy(mesh.rotation)
  flame.mesh.rotateX(Math.PI)
  flame.mesh.translateY(-1.2)
  flame.mesh.translateZ(1.75)
}

const constructor = self => {
  const flame = new Flame()
  flame.mesh.material.opacity = 0
  self.flame = flame
}

const enterAttack = self => {
  self.scene.add(self.flame.mesh)
  self.flame.reset({ randomize: false })
  adjustFlamePos(self)
  self.shouldLoop = true
}

const exitAttack = self => {
  self.shouldLoop = false
}

const update = (self, delta) => {
  self.flame.update({ delta, max: self.attackDistance, loop: self.shouldLoop })
}

export class GermanFlameThrowerPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    constructor(this)
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
    if (this.state.includes('attack')) adjustFlamePos(this)
  }
}

export class GermanFlameThrowerAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    constructor(this)
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
    if (this.state.includes('attack')) adjustFlamePos(this)
  }
}
