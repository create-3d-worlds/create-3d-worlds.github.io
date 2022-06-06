import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomInRange } from '/utils/helpers.js'

export function createSphere({
  r = 1, widthSegments = 32, heightSegments = widthSegments, color = 0xff0000,
  castShadow = true, receiveShadow = true } = {}
) {
  const geometry = new THREE.SphereGeometry(r, widthSegments, heightSegments)
  const material = new THREE.MeshStandardMaterial({
    color,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = receiveShadow
  mesh.castShadow = castShadow
  return mesh
}

// grudva
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

/* WORLD SPHERE */

export function createWorldSphere({ r = 26, widthSegments = 40, heightSegments = 40, distort = .5 } = {}) {
  const geometry = new THREE.SphereBufferGeometry(r, widthSegments, heightSegments)

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()
  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    vertex.x += randomInRange(-distort, distort)
    vertex.z += randomInRange(-distort, distort)
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const material = new THREE.MeshStandardMaterial({
    color: 0xfffafa,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = mesh.castShadow = false
  mesh.rotation.z = -Math.PI / 2
  return mesh
}
