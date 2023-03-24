import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Zombie Idle',
  walk: 'Zombie Walk',
  run: 'Zombie Run',
  attack: 'Zombie Neck Bite',
  attack2: 'Zombie Attack Two Hand',
  pain: 'Hit Reaction',
  death: 'Zombie Death',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'zombie-cop.fbx', prefix: 'character/zombie/', animDict, angle: Math.PI, fixColors: true })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, speed: .5, runCoefficient: 8 }

export class ZombieCopPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class ZombieCopAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
