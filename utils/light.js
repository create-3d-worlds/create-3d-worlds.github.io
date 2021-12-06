import * as THREE from '/node_modules/three108/build/three.module.js'

// https://threejs.org/docs/#api/en/lights/shadows/DirectionalLightShadow

export function createSunLight({ x = 150, y = 350, z = 350, d = 400, target } = {}) {
  const light = new THREE.DirectionalLight(0xffffff, 1)
  // light.intensity = 0.4
  light.position.set(x, y, z)
  light.castShadow = true
  // area of the shadow
  light.shadow.camera.left = -d
  light.shadow.camera.right = d
  light.shadow.camera.top = d
  light.shadow.camera.bottom = -d
  light.shadow.camera.far = 3500
  // svetlo prati objekat
  if (target) light.target = target
  light.name = 'sunLight'
  return light
}
