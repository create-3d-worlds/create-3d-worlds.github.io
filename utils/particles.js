import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

// TODO: random star colors
export function createParticles({ num = 100, color = 0xdddddd, size = .5, unitAngle = 1, file } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    geometry.vertices.push(vertex)
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
  }
  const material = new THREE.PointsMaterial({
    size,
    color,
    transparent: true,
    map: file ? new THREE.TextureLoader().load(`/assets/textures/${file}`) : null,
  })
  return new THREE.Points(geometry, material)
}

export function expandParticles({ particles, scalar, min = 0, max = 1000 } = {}) {
  scalar = scalar ? scalar : randomInRange(min, max) // eslint-disable-line no-param-reassign
  particles.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(scalar)
  })
  particles.geometry.verticesNeedUpdate = true
}

export function resetParticles({ particles, pos = [0, 0, 0], unitAngle = 1 } = {}) {
  particles.position.set(...pos)
  particles.geometry.vertices.forEach(vertex => {
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
  })
}
