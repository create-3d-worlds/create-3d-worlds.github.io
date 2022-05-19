import * as THREE from '/node_modules/three108/build/three.module.js'

export function createParticles({ num = 100, color = 0xfffafa, size = 0.4 } = {}) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < num; i++) {
    const vertex = new THREE.Vector3()
    geometry.vertices.push(vertex)
  }
  const material = new THREE.PointsMaterial({
    color,
    size
  })
  return new THREE.Points(geometry, material)
}
