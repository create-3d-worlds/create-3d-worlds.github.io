import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

const createDrop = () => {
  const geometry = new THREE.SphereGeometry(randomInRange(.3, .9))
  const material = new THREE.MeshBasicMaterial({
    color: 0x9999ff,
    transparent: true,
    opacity: 0.4,
  })
  const drop = new THREE.Mesh(geometry, material)
  drop.velocity = randomInRange(3, 6)
  drop.scale.set(0.1, 3, 0.1)
  return drop
}

export default class Rain {
  constructor(center = {x: 0, y: 250, z: 0}, size = 800, dropsNum = 1000) {
    this.size = size
    this.y = center.y
    this.createDrops(center.x, center.z, size, dropsNum)
  }

  createDrops(x, z, size, dropsNum) {
    this.drops = []
    for (let i = 0; i < dropsNum; i++) {
      const drop = createDrop()
      drop.position.x = randomInRange(x - size / 2, x + size / 2)
      drop.position.y = randomInRange(-500, 500)
      drop.position.z = randomInRange(z - size / 2, z + size / 2)
      this.drops.push(drop)
    }
  }

  // TODO: updateRainCenter() da prati polozaj igraca

  update() {
    this.drops.forEach(drop => {
      drop.position.y -= drop.velocity
      if (drop.position.y < 0)
        drop.position.y += this.y
    })
  }
}
