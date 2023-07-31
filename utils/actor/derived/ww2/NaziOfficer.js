import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

export const animDict = {
  idle: 'Dwarf Idle',
  walk: 'Pistol Walk',
  run: 'Pistol Run',
  attack: 'Shooting',
  special: 'Yelling',
  pain: 'Hit Reaction Pistol',
  death: 'Standing React Death Backward',
}

/* LOADING */

const [mesh, rightHandWeapon] = await Promise.all([
  await loadModel({ file: 'nazi-officer.fbx', prefix: 'character/soldier/', animDict, angle: Math.PI + .3, size: 2 }),
  await loadModel({ file: 'weapon/luger/model.fbx', scale: .18 }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, rightHandWeapon, speed: 1.9, attackSound: 'rifle.mp3' }

export class NaziOfficerPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class NaziOfficerAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
