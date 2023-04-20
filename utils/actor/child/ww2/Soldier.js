import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'
import { animDict } from './Partisan.js'

/* LOADING */

const mesh = await loadModel({ file: 'soldier.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true })

const twoHandedWeapon = await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, attackSound: 'rifle.mp3' }

export class SoldierPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class SoldierAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
