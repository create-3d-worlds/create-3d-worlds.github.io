import { isCollide } from '../utils/helpers.js'

export default class PlayerBox {

  constructor(size) {
    this.movements = []
    this.createMesh(size)
  }

  createMesh(size) {
    const outlineSize = size * 0.05
    const geometry = new THREE.BoxBufferGeometry(size, size, size)
    const material = new THREE.MeshPhongMaterial({ color: 0x22dd88 })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.y = size / 2

    const outline_geo = new THREE.BoxGeometry(size + outlineSize, size + outlineSize, size + outlineSize)
    const outline_mat = new THREE.MeshBasicMaterial({ color: 0x0000000, side: THREE.BackSide })
    const outline = new THREE.Mesh(outline_geo, outline_mat)
    this.mesh.add(outline)
  }

  detectCollisions(colliders) {
    const playerBounds = {
      xMin: this.mesh.position.x - this.mesh.geometry.parameters.width / 2,
      xMax: this.mesh.position.x + this.mesh.geometry.parameters.width / 2,
      yMin: this.mesh.position.y - this.mesh.geometry.parameters.height / 2,
      yMax: this.mesh.position.y + this.mesh.geometry.parameters.height / 2,
      zMin: this.mesh.position.z - this.mesh.geometry.parameters.width / 2,
      zMax: this.mesh.position.z + this.mesh.geometry.parameters.width / 2,
    }
    colliders.forEach(obj => {
      if (!isCollide(playerBounds, obj)) return
      this.movements = []
      if (playerBounds.xMin <= obj.xMax && playerBounds.xMax >= obj.xMin) {
        const objectCenterX = ((obj.xMax - obj.xMin) / 2) + obj.xMin
        const playerCenterX = ((playerBounds.xMax - playerBounds.xMin) / 2) + playerBounds.xMin
        if (objectCenterX > playerCenterX) this.mesh.position.x -= 1
        else this.mesh.position.x += 1
      }
      if (playerBounds.zMin <= obj.zMax && playerBounds.zMax >= obj.zMin) {
        const objectCenterZ = ((obj.zMax - obj.zMin) / 2) + obj.zMin
        const playerCenterZ = ((playerBounds.zMax - playerBounds.zMin) / 2) + playerBounds.zMin
        if (objectCenterZ > playerCenterZ) this.mesh.position.z -= 1
        else this.mesh.position.z += 1
      }
    })
  }

  add(obj) {
    this.mesh.add(obj)
  }
}
