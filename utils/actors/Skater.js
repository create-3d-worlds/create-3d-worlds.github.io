import Player from '/utils/player/Player.js'
import { loadModel } from '/utils/loaders.js'

const skaterAnimations = {
  idle: 'Skateboarding',
  jump: 'Jumping',
}

const { mesh, animations, animDict } = await loadModel({ file: 'model.fbx', prefix: 'character/skater-girl/', animDict: skaterAnimations, angle: Math.PI, fixColors: true })

export class Skater extends Player {
  constructor() {
    super({ mesh, animations, animDict })
  }
}
