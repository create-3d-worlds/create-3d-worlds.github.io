import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

export function createParticles({ num = 100, color = 0xdddddd, size = .5, file } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) geometry.vertices.push(new THREE.Vector3())
  const material = new THREE.PointsMaterial({
    size,
    color,
    transparent: true,
    map: file ? new THREE.TextureLoader().load(`/assets/textures/${file}`) : null,
  })
  return new THREE.Points(geometry, material)
}

export function resetParticles({ particles, pos = [0, 0, 0], unitAngle = 1 } = {}) {
  particles.position.set(...pos)
  particles.geometry.vertices.forEach(vertex => {
    vertex.x = randomInRange(-unitAngle, unitAngle)
    vertex.y = randomInRange(-unitAngle, unitAngle)
    vertex.z = randomInRange(-unitAngle, unitAngle)
  })
}

export function moveParticles({ particles, scalar, min = 0, max = 1000 } = {}) {
  scalar = scalar ? scalar : randomInRange(min, max) // eslint-disable-line no-param-reassign
  particles.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(scalar)
  })
  particles.geometry.verticesNeedUpdate = true
}
