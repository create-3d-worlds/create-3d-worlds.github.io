import { loadModel } from '/utils/loaders.js'
import AI from '/utils/actor/AI.js'
import Player from '/utils/actor/Player.js'

export const animDict = {
  idle: 'Rifle Aiming Idle',
  walk: 'Walking',
  run: 'Rifle Run Aim',
  jump: 'Jump Forward',
  attack: 'Firing Rifle',
  death: 'Dying',
}

/* LOADING */

const mesh = await loadModel({ file: 'partisan.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true, size: 1.8 })

const twoHandedWeapon = await loadModel({ file: 'weapon/rifle-berthier/model.fbx', scale: .60, angle: Math.PI })

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
