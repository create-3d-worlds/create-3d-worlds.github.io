import * as THREE from '/node_modules/three119/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const createDrop = () => {
  const geometry = new THREE.SphereGeometry(randomInRange(1, 3))
  const material = new THREE.MeshBasicMaterial({
    color: 0x9999ff,
    transparent: true,
    opacity: 0.6,
  })
  const drop = new THREE.Mesh(geometry, material)
  drop.scale.set(0.1, 1, 0.1)
  drop.velocity = randomInRange(5, 10)
  drop.initialPosition = new THREE.Vector3()
  return drop
}

export default class Rain {
  constructor({ center = new THREE.Vector3(), size = 800, dropsNum = 1000, ground = -100 } = {}) {
    this.size = size
    this.ground = ground
    this.createDrops(center, size, dropsNum)
  }

  createDrops(center, size, dropsNum) {
    this.drops = []
    for (let i = 0; i < dropsNum; i++) {
      const drop = createDrop()
      drop.position.x = drop.initialPosition.x = randomInRange(center.x - size / 2, center.x + size / 2)
      drop.position.y = randomInRange(-size, size)
      drop.position.z = drop.initialPosition.z = randomInRange(center.z - size / 2, center.z + size / 2)
      this.drops.push(drop)
    }
  }

  // optionaly follows player
  update(center) {
    this.drops.forEach(drop => {
      if (center) drop.position.x = drop.initialPosition.x + center.x
      if (center) drop.position.z = drop.initialPosition.z + center.z
      drop.position.y -= drop.velocity
      if (drop.position.y < this.ground) drop.position.y += this.size * 2
    })
  }
}
