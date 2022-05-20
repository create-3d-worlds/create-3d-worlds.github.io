import * as THREE from '/node_modules/three108/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

export function createParticles({ num = 30, color = 0xfffafa, size = 0.04, file } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    geometry.vertices.push(vertex)
  }
  const material = new THREE.PointsMaterial({
    color,
    size,
    map: file ? new THREE.TextureLoader().load(`/assets/textures/${file}`) : null,
    // transparent: true,
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

export function moveParticles({ particles, distance = 1.07 } = {}) {
  particles.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(distance)
  })
  particles.geometry.verticesNeedUpdate = true
}
