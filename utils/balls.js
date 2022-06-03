import * as THREE from '/node_modules/three127/build/three.module.js'

export function createBall({ r = 1 } = {}) {
  const geometry = new THREE.DodecahedronGeometry(r, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = mesh.castShadow = true
  return mesh
}

export function createSphere({ r = 1, widthSegments = 32, heightSegments = 16 } = {}) {
  const geometry = new THREE.SphereGeometry(r, widthSegments, heightSegments)
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = mesh.castShadow = true
  return mesh
}

/* WORLD SPHERE */

function distort({ geometry, heightSegments, widthSegments } = {}) {
  let vertexIndex
  let vertexVector = new THREE.Vector3()
  let nextVertexVector = new THREE.Vector3()
  let firstVertexVector = new THREE.Vector3()
  let offset = new THREE.Vector3()
  let currentTier = 1
  let lerpValue = 0.5
  let heightValue
  const maxHeight = 0.07

  for (let j = 1; j < heightSegments - 2; j++) {
    currentTier = j
    for (let i = 0; i < widthSegments; i++) {
      vertexIndex = (currentTier * widthSegments) + 1
      vertexVector = geometry.vertices[i + vertexIndex].clone()
      if (j % 2 !== 0) {
        if (i == 0) firstVertexVector = vertexVector.clone()
        nextVertexVector = geometry.vertices[i + vertexIndex + 1].clone()
        if (i == widthSegments - 1) nextVertexVector = firstVertexVector
        lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25
        vertexVector.lerp(nextVertexVector, lerpValue)
      }
      heightValue = (Math.random() * maxHeight) - (maxHeight / 2)
      offset = vertexVector.clone().normalize().multiplyScalar(heightValue)
      geometry.vertices[i + vertexIndex] = (vertexVector.add(offset))
    }
  }
}

export function createWorldSphere({ r = 26, widthSegments = 40, heightSegments = 40 } = {}) {
  const geometry = new THREE.SphereBufferGeometry(r, widthSegments, heightSegments)
  // distort({ geometry, heightSegments, widthSegments })
  const material = new THREE.MeshStandardMaterial({
    color: 0xfffafa,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = mesh.castShadow = false
  mesh.rotation.z = -Math.PI / 2
  return mesh
}
