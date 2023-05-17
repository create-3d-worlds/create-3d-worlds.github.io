import Player from '/utils/actor/Player.js'
import { loadModel } from '/utils/loaders.js'

const animDict = {
  idle: 'Skateboarding',
  jump: 'Jumping',
}

const mesh = await loadModel({ file: 'model.fbx', prefix: 'character/skater-girl/', animDict, angle: Math.PI, fixColors: true })

export class Skater extends Player {
  constructor() {
    super({ mesh, animations: mesh.userData.animations, animDict })
  }
}
