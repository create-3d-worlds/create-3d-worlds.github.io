import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

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

const mesh = await loadModel({ file: 'zombie-cop.fbx', size: 1.8, prefix: 'character/zombie/', animDict, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict, speed: .5, runCoefficient: 8, sightDistance: 15 }

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
