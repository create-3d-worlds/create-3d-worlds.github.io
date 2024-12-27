import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Machine Gun Idle',
  walk: 'Machine Gun Walk',
  run: 'Rifle Run',
  attack: 'Crouch Rapid Fire',
  pain: 'Hit Reaction',
  death: 'Crouch Death',
}

/* LOADING */

const [mesh, twoHandedWeapon] = await Promise.all([
  await loadModel({ file: 'german-machine-gunner.fbx', animDict, prefix: 'character/soldier/', angle: Math.PI }),
  await loadModel({ file: 'weapon/mg-42/lowpoly.fbx', scale: 1.4 }),
])

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, twoHandedWeapon, speed: 1.8, attackStyle: 'LOOP', attackSound: 'rifle-burst.mp3' }

export class GermanMachineGunnerPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class GermanMachineGunnerAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 14, ...props })
  }
}
