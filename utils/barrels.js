import * as THREE from '/node_modules/three127/build/three.module.js'

const loader = new THREE.TextureLoader()

export function createBarrel({ r = 40, height = 90, segments = 32 } = {}) {
  const geometry = new THREE.CylinderGeometry(r, r, height, segments)
  const material = new THREE.MeshBasicMaterial({ map: loader.load('/assets/textures/rust.jpg') })
  const cylinder = new THREE.Mesh(geometry, material)
  return cylinder
}
