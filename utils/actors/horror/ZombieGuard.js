import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Zombie Idle',
  walk: 'Walking',
  run: 'Zombie Running',
  attack: 'Zombie Kicking',
  attack2: 'Zombie Attack',
  pain: 'Zombie Reaction Hit',
  death: 'Zombie Dying',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'zombie-guard.fbx', prefix: 'character/zombie/', angle: Math.PI, fixColors: true, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, speed: .5, runCoefficient: 8 }

export class ZombieGuardPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class ZombieGuardAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
