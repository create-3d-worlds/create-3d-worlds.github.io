import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Rifle Aiming Idle',
  walk: 'Rifle Walk',
  run: 'Crouched Run',
  attack: 'Firing Rifle',
  attack2: 'Fire Rifle Crouch',
  pain: 'Hit Reaction',
  death: 'Death Crouching Headshot Front',
}

/* LOADING */

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'nazi.fbx', animDict, prefix: 'character/soldier/', angle: Math.PI, size: 1.8 }),
  await loadModel({ file: 'weapon/rifle.fbx', scale: 1.33, angle: Math.PI }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, speed: 1.75, attackSound: 'rifle.mp3' }

export class SSSoldierPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    this.mesh.translateY(.1)
  }
}

export class SSSoldierAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
    this.mesh.translateY(.1)
  }
}
