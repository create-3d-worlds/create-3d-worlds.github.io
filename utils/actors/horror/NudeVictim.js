import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Unarmed Idle',
  walk: 'Drunk Run Forward',
  attack: 'Terrified',
  special: 'Zombie Agonizing',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', prefix: 'character/nude-victim/', animDict, angle: Math.PI, fixColors: true })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class NudeVictimPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class NudeVictimAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
