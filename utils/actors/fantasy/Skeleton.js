import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  special: 'Zombie Scream',
  run: 'Flying',
  walk: 'Walking',
  idle: 'Zombie Idle',
  attack: 'Zombie Neck Bite',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', prefix: 'character/skeleton/', angle: Math.PI, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, speed: 1.2 }

export class SkeletonPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class SkeletonAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
