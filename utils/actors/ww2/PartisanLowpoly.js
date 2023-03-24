import { loadModel } from '/utils/loaders.js'
import AI from '/utils/player/AI.js'
import Player from '/utils/player/Player.js'
import FPSPlayer from '/utils/player/FPSPlayer.js'
import { animDict } from './Partisan.js'

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'partisan-lowpoly.fbx', angle: Math.PI, animDict, prefix: 'character/soldier/', fixColors: true, size: 1.8 })

const { mesh: rifle } = await loadModel({ file: 'weapon/rifle.fbx', scale: 1.25, angle: Math.PI })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, rifle }

export class PartisanLowpolyPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class PartisanLowpolyAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, attackDistance: 10, ...props })
  }
}

export class PartisanLowpolyFPSPlayer extends FPSPlayer {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
