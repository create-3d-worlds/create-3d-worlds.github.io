import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

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
  await loadModel({ file: 'german-machine-gunner.fbx', animDict, prefix: 'character/soldier/', angle: Math.PI }),
  await loadModel({ file: 'weapon/flame-gun/model.fbx', scale: .75 }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, speed: 1.8, attackStyle: 'LOOP', attackDistance: 7, attackSound: 'fire-swoosh.mp3', flame: {} }

export class GermanFlameThrowerPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }

  enterAttack() {
    super.enterAttack()
    this.startFlame(0, null, false)
  }

  exitAttack() {
    this.endFlame()
  }
}

export class GermanFlameThrowerAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }

  enterAttack() {
    super.enterAttack()
    this.startFlame(0, null, false)
  }

  exitAttack() {
    this.endFlame()
  }

  update(delta) {
    super.update(delta)
    if (this.state != 'attack') this.endFlame()
  }
}
