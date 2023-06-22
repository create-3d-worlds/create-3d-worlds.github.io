import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

/* LOADING */

const animDict = {
  idle: 'Rifle Idle',
  walk: 'Rifle Walk',
  run: 'Rifle Run',
}

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'resistance-fighter.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true, size: 1.8 }),
  await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, altitude: .7, attackStyle: 'ONCE', showHealthBar: false }

export class ResistanceWalkerPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    if (this.chaseCamera) this.chaseCamera.distance = 1.5
  }
}

export class ResistanceWalkerAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
