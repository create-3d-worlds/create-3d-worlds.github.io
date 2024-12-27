import { loadModel } from '/core/loaders.js'
import AI from '/core/actor/AI.js'
import Player from '/core/actor/Player.js'

export const animDict = {
  idle: 'Rifle Aiming Idle',
  walk: 'Walking',
  run: 'Rifle Run Aim',
  jump: 'Jump Forward',
  attack: 'Firing Rifle',
  death: 'Dying',
}

/* LOADING */

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'partisan.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', size: 1.8 }),
  await loadModel({ file: 'weapon/rifle-berthier/model.fbx', scale: .60, angle: Math.PI }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, attackDistance: 50, attackSound: 'rifle.mp3' }

export class PartisanAimAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class PartisanAimPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
