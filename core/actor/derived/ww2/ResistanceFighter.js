import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Rifle Idle',
  walk: 'Rifle Walk',
  run: 'Rifle Run',
  attack: 'Firing Rifle',
  pain: 'Hit Reaction',
  death: 'Dying',
}

/* LOADING */

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'resistance-fighter.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', size: 1.8 }),
  await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, attackSound: 'rifle.mp3', attackDistance: 50 }

export class ResistanceFighterPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    if (this.chaseCamera) this.chaseCamera.distance = 1.5
  }
}

export class ResistanceFighterAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
