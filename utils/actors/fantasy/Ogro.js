import Player from '/utils/player/Player.js'
import AI from '/utils/player/AI.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'stand',
  walk: 'run',
  run: 'run',
  jump: 'jump', // wavealt
  fall: 'bumflop',
  attack: 'salute_alt', // attack, crattack
  death: 'deathc', // deatha, deathb, deathc, crdeath
  special: 'flip', // sniffsniff
  // paina, painb, painc, crpain
}

/* LOADING */

const { mesh, animations } = await loadModel({ file: 'character/ogro/ogro.md2', texture: 'character/ogro/skins/arboshak.png', size: 2, angle: Math.PI * .5, shouldCenter: true, shouldAdjustHeight: true, fixColors: true })

/* EXTENDED CLASSES */

const sharedProps = { mesh, animations, animDict }

export class OgroPlayer extends Player {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}

export class OgroAI extends AI {
  constructor(props = {}) {
    super({ ...sharedProps, ...props })
  }
}
