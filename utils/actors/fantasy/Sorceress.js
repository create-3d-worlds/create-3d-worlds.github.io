import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'
import { jumpStyles } from '/utils/constants.js'

const animDict = {
  idle: 'Standing Idle',
  walk: 'Standing Walk Forward',
  run: 'Standing Sprint Forward',
  attack: 'Standing 1H Magic Attack 01',
  special: 'Standing 2H Magic Attack 04',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'model.fbx', angle: Math.PI, animDict, prefix: 'character/sorceress/', size: 1.72 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, jumpStyle: jumpStyles.FLY_JUMP }

export class SorceressPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class SorceressAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
