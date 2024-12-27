import GameObject from '/core/objects/GameObject.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({ file: 'nature/dead-tree/model.glb', size: 5 })

export default class DeadTree extends GameObject {
  constructor(params = {}) {
    super({ mesh, color: 0x362419, ...params })
  }
}