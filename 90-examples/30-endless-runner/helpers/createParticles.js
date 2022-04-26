import * as THREE from '/node_modules/three108/build/three.module.js'

export function createParticles(particleCount) {
  const geometry = new THREE.Geometry()
  for (let i = 0; i < particleCount; i++) {
    const vertex = new THREE.Vector3()
    geometry.vertices.push(vertex)
  }
  const pMaterial = new THREE.PointsMaterial({
    color: 0xfffafa,
    size: 0.2
  })
  // mesh.visible = false
  return new THREE.Points(geometry, pMaterial)
}
