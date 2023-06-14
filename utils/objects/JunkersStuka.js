import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({
  file: 'aircraft/airplane/junkers-ju-87-stuka/B6L6UIB83ZKUE6YOCT94DAHM3.obj',
  mtl: 'aircraft/airplane/junkers-ju-87-stuka/B6L6UIB83ZKUE6YOCT94DAHM3.mtl',
  size: 3,
  // angle: -Math.PI * .5
})

export default class JunkersStuka extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.position.y += this.height / 2
  }
}