import * as THREE from '/node_modules/three108/build/three.module.js'

export function createWorld(radius) {
  const sides = 40
  const tiers = 40
  const sphereGeometry = new THREE.SphereGeometry(radius, sides, tiers)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xfffafa,
    flatShading: true
  })
  let vertexIndex
  let vertexVector = new THREE.Vector3()
  let nextVertexVector = new THREE.Vector3()
  let firstVertexVector = new THREE.Vector3()
  let offset = new THREE.Vector3()
  let currentTier = 1
  let lerpValue = 0.5
  let heightValue
  const maxHeight = 0.07
  for (let j = 1; j < tiers - 2; j++) {
    currentTier = j
    for (let i = 0; i < sides; i++) {
      vertexIndex = (currentTier * sides) + 1
      vertexVector = sphereGeometry.vertices[i + vertexIndex].clone()
      if (j % 2 !== 0) {
        if (i == 0) firstVertexVector = vertexVector.clone()
        nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone()
        if (i == sides - 1) nextVertexVector = firstVertexVector
        lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25
        vertexVector.lerp(nextVertexVector, lerpValue)
      }
      heightValue = (Math.random() * maxHeight) - (maxHeight / 2)
      offset = vertexVector.clone().normalize().multiplyScalar(heightValue)
      sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset))
    }
  }
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  mesh.receiveShadow = true
  mesh.castShadow = false
  mesh.rotation.z = -Math.PI / 2
  mesh.position.y = -24
  mesh.position.z = 2
  return mesh
}
