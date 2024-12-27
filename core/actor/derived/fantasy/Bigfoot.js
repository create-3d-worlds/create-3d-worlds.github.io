import Player from '/core/actor/Player.js'
import AI from '/core/actor/AI.js'
import { loadModel } from '/core/loaders.js'

const animDict = {
  idle: 'Goalkeeper Idle',
  walk: 'Mutant Walking',
  attack: 'Zombie Punching',
}

/* LOADING */

const mesh = await loadModel({ file: 'model.fbx', prefix: 'character/bigfoot/', angle: Math.PI, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations: mesh.userData.animations, animDict }

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
