import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Standing Idle',
  walk: 'Standard Walk',
  run: 'Pistol Run',
  attack: 'Shooting',
  pursue: 'Pistol Walk',
  pain: 'Pistol Hit Reaction',
  death: 'Dying',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'nazi-agent.fbx', prefix: 'character/soldier/', animDict, angle: Math.PI + .3, fixColors: true, size: 1.8 })

const { mesh: pistol } = await loadModel({ file: 'weapon/luger/model.fbx', scale: .18 })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, pistol }

export class NaziAgentPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class NaziAgentAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}
