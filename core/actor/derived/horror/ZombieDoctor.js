import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Thriller Idle',
  walk: 'Walking',
  run: 'Zombie Running',
  attack: 'Zombie Attack',
  attack2: 'Zombie Scream',
  pain: 'Zombie Reaction Hit',
  death: 'Zombie Dying',
}

/* LOADING */

const mesh = await loadModel({ file: 'zombie-doctor.fbx', size: 1.76, prefix: 'character/zombie/', angle: Math.PI, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, speed: .5, runCoefficient: 8, sightDistance: 15 }

export class ZombieDoctorPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class ZombieDoctorAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
