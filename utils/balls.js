import * as THREE from '/node_modules/three108/build/three.module.js'

export function createBall(radius, x, y) {
  const geometry = new THREE.DodecahedronGeometry(radius, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  mesh.castShadow = true
  mesh.position.y = y
  mesh.position.z = 4.8
  mesh.position.x = x
  return mesh
}
