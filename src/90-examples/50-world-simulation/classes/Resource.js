import * as THREE from '/node_modules/three127/build/three.module.js'

import Entity from './Entity.js'

/**
 * Small items to be carried by mobs.
 */
export default class Resource extends Entity {
  constructor(name, position) {
    super()
    switch (name) {
      case 'tree':
        this.name = 'wood'
        this.color = 0x966f33
        break
      case 'mine':
        this.name = 'gold'
        this.color = 0xfdd017
        break
    }
    this.createMesh(position)
  }

  createMesh(pos) {
    const geometry = new THREE.BoxGeometry(4, 4, 4)
    const material = new THREE.MeshLambertMaterial({ color: this.color })
    this.mesh = new THREE.Mesh(geometry, material)
    const { position } = geometry.attributes
    const vertex = new THREE.Vector3()
    for (let i = 0, l = position.count; i < l; i ++) {
      vertex.fromBufferAttribute(position, i)
      vertex.y += 5
      position.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }
    this.mesh.castShadow = true
    this.mesh.position.copy(pos)
  }
}
