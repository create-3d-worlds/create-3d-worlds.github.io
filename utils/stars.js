import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

export function createStars({ minRange = 500, maxRange = 2000, num = 10000, unitAngle = 1 } = {}) {
  const geometry = new THREE.Geometry()

  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
    const distance = randomInRange(minRange, maxRange)
    vertex.multiplyScalar(distance)
    geometry.vertices.push(vertex)
  }

  const material = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: .7,
    transparent: true,
    map: new THREE.TextureLoader().load('star.png')
  })

  return new THREE.Points(geometry, material)
}