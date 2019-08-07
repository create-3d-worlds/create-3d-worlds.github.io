import { isCollide } from '../utils/helpers.js'
import { createSketchBox } from '../utils/three-helpers.js'

const playerSpeed = 5

export default class PlayerBox {
  constructor(size) {
    this.movements = []
    this.mesh = createSketchBox(size)
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

  move() {
    const { position } = this.mesh
    const newPosX = this.movements[0].x
    const newPosZ = this.movements[0].z

    const diffX = Math.abs(position.x - newPosX)
    const diffZ = Math.abs(position.z - newPosZ)
    const distance = Math.sqrt(diffX * diffX + diffZ * diffZ)

    const multiplierX = position.x > newPosX ? -1 : 1
    const multiplierZ = position.z > newPosZ ? -1 : 1
    position.x += (playerSpeed * (diffX / distance)) * multiplierX
    position.z += (playerSpeed * (diffZ / distance)) * multiplierZ

    if (Math.floor(position.x) <= Math.floor(newPosX) + 15 &&
      Math.floor(position.x) >= Math.floor(newPosX) - 15 &&
      Math.floor(position.z) <= Math.floor(newPosZ) + 15 &&
      Math.floor(position.z) >= Math.floor(newPosZ) - 15
    ) {
      position.x = Math.floor(position.x)
      position.z = Math.floor(position.z)
      this.movements = []
    }
  }

  add(obj) {
    this.mesh.add(obj)
  }
}
