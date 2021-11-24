import * as THREE from '/node_modules/three108/build/three.module.js'

export function createSunLight({ d = 1000 } = {}) {
  const light = new THREE.DirectionalLight(0xffffff, 1)

  light.position.set(150, 350, 350)
  light.castShadow = true
  // define the visible area of the projected shadow
  light.shadow.camera.left = -400
  light.shadow.camera.right = 400
  light.shadow.camera.top = 400
  light.shadow.camera.bottom = -400
  light.shadow.camera.near = 1
  light.shadow.camera.far = 1000
  // shadow resolution
  light.shadow.mapSize.width = 2048
  light.shadow.mapSize.height = 2048

  // light.color.setHSL(0.1, 1, 0.95)
  // light.position.set(- 10, 17.5, 10)
  // light.position.multiplyScalar(30)
  // light.castShadow = true
  // light.shadow.mapSize.width = 2048
  // light.shadow.mapSize.height = 2048
  // // dužina bacanja senke
  // light.shadow.camera.left = - d
  // light.shadow.camera.right = d
  // light.shadow.camera.top = d
  // light.shadow.camera.bottom = - d
  // light.shadow.camera.far = 3500
  // light.shadow.bias = - 0.0001
  return light
}
