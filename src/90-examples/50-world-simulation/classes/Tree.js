import { createSimpleFir } from '/utils/trees.js'

import Entity from './Entity.js'

/**
 * Trees constructed from primitives.
 * Provide wood resources.
 */
export default class Tree extends Entity {
  constructor(pos) {
    super()
    this.name = 'tree'
    this.units = 4
    const tree = createSimpleFir({ size: 80 })
    this.mesh = tree
    this.mesh.position.copy(pos)
  }
}
