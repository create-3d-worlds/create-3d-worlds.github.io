import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

export function createParticles({ num = 100, color = 0xdddddd, size = .5, unitAngle = 1, file } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
    geometry.vertices.push(vertex)
  }
  const material = new THREE.PointsMaterial({
    size,
    color,
    transparent: true,
    map: file ? new THREE.TextureLoader().load(`/assets/textures/${file}`) : null,
  })
  return new THREE.Points(geometry, material)
}

export function explode({ particles, x = 0, y = 0, z = 0 } = {}) {
  particles.position.set(x, y, z)
  particles.geometry.vertices.forEach(vertex => {
    vertex.x = randomInRange(-1, 1)
    vertex.y = randomInRange(-1, 1)
    vertex.z = randomInRange(-1, 1)
  })
  particles.visible = true
}

export function moveParticles({ particles, distance, min = 0, max = 1000 } = {}) {
  distance = distance ? distance : randomInRange(min, max) // eslint-disable-line no-param-reassign
  particles.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(distance)
  })
  particles.geometry.verticesNeedUpdate = true
}
