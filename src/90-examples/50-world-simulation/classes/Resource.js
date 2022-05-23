import * as THREE from '/node_modules/three119/build/three.module.js'

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
    for (let i = 0; i < this.mesh.geometry.vertices.length; i++)
      this.mesh.geometry.vertices[i].y += 5
    this.mesh.castShadow = true
    this.mesh.position.copy(pos)
  }
}
