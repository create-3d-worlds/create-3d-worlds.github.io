import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Sleeping Idle',
  walk: 'Zombie Crawl',
  run: 'Running Crawl',
  attack: 'Zombie Biting',
  death: 'Prone Death',
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'zombie-doctor.fbx', prefix: 'character/zombie/', angle: Math.PI, fixColors: true, animDict })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict, speed: .5, runCoefficient: 8 }

export class ZombieDoctorCrawlPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class ZombieDoctorCrawlAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
