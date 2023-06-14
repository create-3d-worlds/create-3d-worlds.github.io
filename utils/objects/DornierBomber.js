import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({
  file: 'aircraft/airplane/dornier-do-217/WXSUTGFGGAETK9J6AYCJWA8OO.obj',
  mtl: 'aircraft/airplane/dornier-do-217/WXSUTGFGGAETK9J6AYCJWA8OO.mtl',
  size: 3
})

export default class DornierBomber extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.position.y += this.height / 2
  }
}