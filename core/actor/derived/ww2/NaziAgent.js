import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Standing Idle',
  walk: 'Standard Walk',
  run: 'Pistol Run',
  attack: 'Shooting',
  pursue: 'Pistol Walk',
  pain: 'Pistol Hit Reaction',
  death: 'Dying',
}

/* LOADING */

const [mesh, rightHandWeapon] = await Promise.all([
  await loadModel({ file: 'nazi-agent.fbx', prefix: 'character/soldier/', animDict, angle: Math.PI + .3, size: 1.8 }),
  await loadModel({ file: 'weapon/luger/model.fbx', scale: .18 }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, rightHandWeapon, attackSound: 'rifle.mp3' }

export class NaziAgentPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class NaziAgentAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
