import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
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

const { mesh, animations } = await loadModel({ file: 'zombie-barefoot.fbx', prefix: 'character/zombie/', angle: Math.PI, fixColors: true, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, speed: .5, runCoefficient: 8 }

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
