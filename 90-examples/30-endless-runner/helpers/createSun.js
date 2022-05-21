import * as THREE from '/node_modules/three119/build/three.module.js'

export function createSun() {
  const sun = new THREE.DirectionalLight(0xcdc1c5, 0.9)
  sun.position.set(12, 6, -7)
  sun.castShadow = true
  sun.shadow.mapSize.width = 256
  sun.shadow.mapSize.height = 256
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 50
  return sun
}
