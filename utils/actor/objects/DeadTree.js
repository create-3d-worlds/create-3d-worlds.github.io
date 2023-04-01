import Entity from '/utils/actor/Entity.js'
import { loadModel } from '/utils/loaders.js'

const { mesh } = await loadModel({ file: 'nature/dead-tree/model.glb', size: 5 })

export default class DeadTree extends Entity {
  constructor(params = {}) {
    super({ mesh, color: 0x362419, ...params })
  }
}