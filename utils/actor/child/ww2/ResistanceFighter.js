import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'
import { animDict } from './Partisan.js'

/* LOADING */

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'resistance-fighter.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true, size: 1.8 }),
  await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, attackSound: 'rifle.mp3', attackDistance: 50 }

export class ResistanceFighterPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
    if (this.cameraFollow) this.cameraFollow.distance = 1.5
  }
}

export class ResistanceFighterAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
