import * as THREE from '/node_modules/three119/build/three.module.js'
import Entity from './Entity.js'

export default class Castle extends Entity {
  constructor(model) {
    super(model)
    this.name = 'village'
    this.createMesh()
  }

  createMesh() {
    const {scene} = this.model
    scene.scale.set(.1, .1, .1)
    scene.castShadow = true
    scene.rotation.x = -Math.PI / 2
    const group = new THREE.Group()
    group.add(scene.clone())
    this.mesh = group
  }
}
