import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const createDrop = () => {
  const geometry = new THREE.SphereGeometry(Math.random() * 5)
  const material = new THREE.MeshBasicMaterial({
    color: 0x9999ff,
    transparent: true,
    opacity: 0.6,
  })
  const drop = new THREE.Mesh(geometry, material)
  drop.scale.set(0.1, 1, 0.1)
  drop.velocity = randomInRange(5, 10)
  return drop
}

export default class Rain {
  constructor({ center = { x: 0, y: 250, z: 0 }, size = 800, dropsNum = 1000, ground = -100 } = {}) {
    this.size = size
    this.center = center
    this.ground = ground
    this.createDrops(center, size, dropsNum)
  }

  createDrops(center, size, dropsNum) {
    this.drops = []
    for (let i = 0; i < dropsNum; i++) {
      const drop = createDrop()
      drop.position.x = randomInRange(center.x - size / 2, center.x + size / 2)
      drop.position.y = randomInRange(-size, size)
      drop.position.z = randomInRange(center.z - size / 2, center.z + size / 2)
      // drop.position.set(randomInRange(-size, size), randomInRange(-size, size), randomInRange(-size, size))
      this.drops.push(drop)
    }
  }

  // TODO: updateRainCenter() da prati polozaj igraca

  update() {
    this.drops.forEach(drop => {
      // drop.position.x = center.x
      // drop.position.z = center.z
      drop.position.y -= drop.velocity
      if (drop.position.y < this.ground) drop.position.y += this.size * 2
    })
  }
}
