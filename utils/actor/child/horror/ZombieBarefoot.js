import Player from '/utils/actor/Player.js'
import AI from '/utils/actor/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Zombie Scratch Idle',
  walk: 'Zombie Walk',
  run: 'Zombie Running',
  attack: 'Zombie Punching',
  attack2: 'Zombie Kicking',
  pain: 'Zombie Reaction Hit Back',
  death: 'Zombie Death',
}

/* LOADING */

const mesh = await loadModel({ file: 'zombie-barefoot.fbx', prefix: 'character/zombie/', angle: Math.PI, fixColors: true, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, speed: .5, runCoefficient: 8, sightDistance: 15 }

export class ZombieBarefootPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class ZombieBarefootAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
