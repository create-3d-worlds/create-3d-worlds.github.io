import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Goalkeeper Idle',
  walk: 'Mutant Walking',
  attack: 'Zombie Punching',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', prefix: 'character/bigfoot/', angle: Math.PI, fixColors: true, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class BigfootPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class BigfootAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
