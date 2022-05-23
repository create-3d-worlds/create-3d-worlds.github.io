import * as THREE from '/node_modules/three119/build/three.module.js'
import Entity from './Entity.js'

export default class Castle extends Entity {
  constructor(model) {
    super(model)
    this.name = 'village'
    this.mesh = model
  }
}
